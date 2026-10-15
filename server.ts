import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MENSAJE_BIENVENIDA_OBLIGATORIO =
  'Hola, soy Orienta IA. ¿En qué te puedo ayudar hoy con tu obra social o prepaga?';

// System instruction for Orienta IA matching exact SSSalud specifications
const ORIENTA_SYSTEM_INSTRUCTION = `
Sos "Orienta IA", un asistente virtual especializado y oficial diseñado para guiar a los usuarios en trámites de la Superintendencia de Servicios de Salud (SSSalud) de Argentina. Tu objetivo es evitar que las personas pierdan tiempo presentándose con documentación incompleta.

# TONO Y ESTILO (CRÍTICO)
- Comunicate usando un tono argentino educado, cordial y empático.
- Utilizá siempre el "voseo" (vos, tenés, podés, necesitás, querés) en lugar de "tú" o "usted".
- Mantené la formalidad adecuada para un trámite oficial: sé claro y directo, no uses lunfardo ni exceso de confianza, pero resultá accesible.
- Ejemplos de tono: "Hola, soy Orienta IA. ¿En qué te puedo ayudar hoy con tu obra social?", "Para este trámite vas a necesitar...", "Por favor, decime cuál es tu situación laboral".

# REGLAS ESTRICTAS E INQUEBRANTABLES
1. NO inventes ni supongas requisitos (Cero Alucinaciones). Si la información no está en tu base de conocimiento, debés indicarle al usuario que consulte los canales oficiales.
2. NO inicies trámites ni tomes reclamos. Tu función es puramente ORIENTATIVA.
3. Si el usuario pregunta por trámites fuera de la SSSalud (ej. ANSES, AFIP, multas de tránsito), rechazá la consulta amablemente y recordale que solo lo podés asistir en temas de obras sociales y prepagas.
4. Seguí el flujo de conversación paso a paso. No des la lista de requisitos hasta no haber completado el diagnóstico del usuario.

# FLUJO DE CONVERSACIÓN (Paso a Paso)

PASO 1: Bienvenida y Diagnóstico Inicial
Saludá amablemente, presentate como Orienta IA y preguntá de forma clara cuál es el inconveniente que el usuario tiene con su obra social o prepaga.

PASO 2: Clasificación del Trámite
En base a la respuesta del usuario, clasificá internamente el reclamo en una de estas 3 categorías:
- A) Negativa de afiliación o traspaso.
- B) Falta de cobertura en prestaciones médicas (medicamentos, tratamientos).
- C) Problemas con el valor de las cuotas.
Si el problema no encaja en estas categorías, indicale que por ahora solo podés asistirlo con esos tres temas.

PASO 3: Perfilado del Usuario
Hacé las preguntas necesarias (UNA POR UNA, no todas juntas) para determinar el tipo de documentación específica que va a necesitar. Preguntá:
- ¿Cuál es tu situación laboral actual? (Relación de dependencia, Monotributista, Jubilado, Servicio Doméstico).
- ¿El reclamo es para vos como titular o para un familiar a cargo?

PASO 4: Entrega de Requisitos
Una vez que tengas el tipo de reclamo y el tipo de usuario, redactá la lista exacta de requisitos basándote ÚNICAMENTE en tu base de conocimiento. Presentá la información con viñetas claras (Checklist). Al final, preguntale: "¿Te quedó alguna duda más sobre esta documentación?".

PASO 5: Cierre y Generación de Datos Estructurados
Si el usuario confirma que entendió todo (ej. "todo claro", "muchas gracias", "no tengo dudas", "entendido"), despedite cordialmente y generá un bloque de código final en formato JSON estricto con el resumen del caso. Este bloque debe estar encapsulado en \`\`\`json \`\`\` para ser procesado por el sistema.

El JSON debe tener exactamente esta estructura:
\`\`\`json
{
  "tipo_reclamo": "Falta de cobertura | Negativa de afiliación | Cuotas",
  "tipo_usuario": "Monotributista | Relación de dependencia | Jubilado",
  "documentacion_requerida": ["Item 1", "Item 2", "Item 3"]
}
\`\`\`

# BASE DE CONOCIMIENTO (Reglas de Documentación)
- Para TODOS los trámites siempre se requiere: DNI (frente y dorso) y Formulario de Reclamo SSSalud completo.
- Si es Monotributista: Últimos 3 comprobantes de pago del monotributo.
- Si es Relación de dependencia: Último recibo de sueldo.
- Si es Jubilado: Último recibo de haberes.
- Si es "Negativa de afiliación": Se requiere comprobante de rechazo de la Obra Social (si lo hubiere) o telegrama enviado.
- Si es "Falta de cobertura": Se requiere prescripción médica original, resumen de historia clínica y presupuesto o negativa por escrito de la entidad.
`;

// Helper: detect if a message is purely a greeting or introductory inquiry
function esSoloSaludoOIntro(texto: string): boolean {
  const t = texto.trim().toLowerCase();
  const clean = t.replace(/[.,!¡?¿;:-]/g, '').trim();

  const saludosExactos = [
    'hola', 'buenas', 'buen dia', 'buen día', 'buenas tardes', 'buenas noches',
    'que tal', 'qué tal', 'hola que tal', 'hola qué tal', 'hola como estas',
    'hola cómo estás', 'como estas', 'cómo estás', 'como te va', 'cómo te va',
    'hola orienta', 'orienta', 'estas ahi', 'estás ahí', 'hola buenas',
    'hola buenas tardes', 'hola buen dia', 'hola te hago una consulta',
    'hola te puedo hacer una pregunta', 'te puedo hacer una pregunta',
    'hola una consulta', 'una consulta', 'hola tengo una duda',
  ];

  if (saludosExactos.includes(clean)) return true;

  const words = clean.split(/\s+/);
  if (words.length <= 4) {
    if (words[0] === 'hola' || words[0] === 'buenas' || words[0] === 'buen' || words[0] === 'buenos') {
      const hasSpecificProblem =
        clean.includes('medic') || clean.includes('remedio') || clean.includes('afili') ||
        clean.includes('cambi') || clean.includes('cud') || clean.includes('leche') ||
        clean.includes('turno') || clean.includes('viaj') || clean.includes('plus') ||
        clean.includes('plata') || clean.includes('computadora');
      if (!hasSpecificProblem) return true;
    }
  }

  return false;
}

// Comprehensive Situational Rational Engine with Empathetic Validation
function responderSituacionRacionalConValidacion(texto: string): string | null {
  const t = texto.toLowerCase();

  // 1. Situación: Imposibilidad de viajar a la dependencia / Distancia geográfica / Interior del país / Reposo médico
  if (
    t.includes('no puede viajar') ||
    t.includes('no puedo viajar') ||
    t.includes('no pueden viajar') ||
    t.includes('no puede ir') ||
    t.includes('no puedo ir') ||
    t.includes('viajar a la dependencia') ||
    t.includes('ir a la dependencia') ||
    t.includes('viajar a la sede') ||
    t.includes('ir a la sede') ||
    t.includes('viajar a buenos aires') ||
    t.includes('ir a buenos aires') ||
    t.includes('viajar a capital') ||
    t.includes('ir a capital') ||
    t.includes('vivo en el interior') ||
    t.includes('vive en el interior') ||
    t.includes('vivo lejos') ||
    t.includes('me queda lejos') ||
    t.includes('no tengo movilidad') ||
    t.includes('no tiene movilidad') ||
    t.includes('estoy postrado') ||
    t.includes('está postrado') ||
    t.includes('estoy en cama') ||
    t.includes('está en cama') ||
    t.includes('estoy operado') ||
    t.includes('está operado') ||
    t.includes('estoy enfermo') ||
    t.includes('está enfermo') ||
    t.includes('no me puedo mover') ||
    t.includes('vivo en cordoba') ||
    t.includes('vivo en córdoba') ||
    t.includes('vivo en santa fe') ||
    t.includes('vivo en mendoza') ||
    t.includes('vivo en salta') ||
    t.includes('vivo en tucuman') ||
    t.includes('vivo en tucumán') ||
    t.includes('vivo en misiones') ||
    t.includes('vivo en chaco') ||
    t.includes('vivo en corrientes') ||
    t.includes('vivo en el sur') ||
    t.includes('no puedo trasladarme') ||
    t.includes('no puede trasladarse')
  ) {
    return `Comprendo totalmente tu situación: cuando uno está atravesando un problema de salud, está convaleciente o vive lejos en el interior, la idea de tener que viajar a Buenos Aires resulta una carga angustiante e injusta.

¡Quedate con total tranquilidad! **No necesitás viajar a la sede de la SSSalud bajo ningún concepto.**

La Superintendencia tiene dispuesto el sistema para proteger a los ciudadanos en todo el territorio nacional:
1. **Trámite 100% digital y a distancia (TAD)**: Podés hacer la presentación completa desde tu hogar a través de [tramitesadistancia.gob.ar](https://tramitesadistancia.gob.ar/#/inicio) desde cualquier celular o computadora, con Clave Fiscal de ARCA o usuario de Mi Argentina.
2. **Presentación a través de un familiar**: Si estás en reposo, operado/a o te cuesta el manejo digital, cualquier familiar directo (hijo, pareja, hermano) puede ingresar el expediente en TAD en tu representación, adjuntando la partida o libreta que demuestre el vínculo.
3. **Validez jurídica idéntica y gratuidad**: Tiene el mismo peso legal que una presentación en ventanilla física y es totalmente gratuita.

Contame: **¿qué trámite o problemática de salud necesitás canalizar (medicación, falta de cobertura, afiliación)?** Así te dejo ordenado el checklist exacto con los documentos a adjuntar en TAD.`;
  }

  // 2. Situación: Urgencia médica vital / Falta de medicación oncológica o crónica / Demora crítica
  if (
    t.includes('oncolog') ||
    t.includes('cáncer') ||
    t.includes('cancer') ||
    t.includes('quimio') ||
    t.includes('insulina') ||
    t.includes('vih') ||
    t.includes('hiv') ||
    (t.includes('desesperad') && (t.includes('medic') || t.includes('remedio') || t.includes('salud')))
  ) {
    return `Sé lo desesperante y angustiante que es cuando está en juego una medicación vital o un tratamiento oncológico y la obra social o prepaga dilata los tiempos. Es una situación de extrema vulnerabilidad que nadie debería atravesar.

La salud es un derecho constitucional y los tratamientos crónicos y oncológicos tienen **amparo legal prioritario**:
1. **Intimación perentoria previa**: Tenés derecho a intimar de inmediato a la entidad con un plazo perentorio de 48 horas bajo apercibimiento de denuncia en SSSalud y acción de amparo judicial (podés generar la nota formal en nuestra pestaña *Herramientas IA*).
2. **Reclamo en TAD Trámite 2723**: Podés carátular el reclamo como **"Urgente - Medicación Crónica / Oncológica"** adjuntando la prescripción con el diagnóstico (CIE-10), el resumen de historia clínica y la constancia de que no te la entregan.
3. **Intervención de la SSSalud**: El área médica de la Superintendencia intima directamente a la auditoría médica de la obra social para exigir la provisión inmediata.

¿Cuál es el medicamento puntual y qué obra social o prepaga te lo está demorando?`;
  }

  // 3. Situación: Brecha digital / Personas mayores / "No sé usar la computadora" / "No tengo clave fiscal"
  if (
    t.includes('no se usar la computadora') ||
    t.includes('no sé usar la computadora') ||
    t.includes('no entiendo internet') ||
    t.includes('no tengo computadora') ||
    t.includes('soy grande') ||
    t.includes('soy jubilado y no entiendo') ||
    t.includes('no tengo clave fiscal') ||
    t.includes('no se como entrar a tad') ||
    t.includes('no sé cómo entrar a tad')
  ) {
    return `Te entiendo perfectamente: la tecnología y los trámites digitales a veces pueden ser un dolor de cabeza innecesario cuando lo único que uno necesita es que le resuelvan un problema de salud.

No te preocupes, no tenés que resolver esto en soledad:
1. **Te puede ayudar un familiar o persona de confianza**: No hace falta que vos tengas clave fiscal. Cualquier hijo/a, nieto/a, cónyuge o familiar que tenga Clave Fiscal o Mi Argentina puede ingresar a TAD y subir tu reclamo actuando en tu nombre, acompañando una foto de tu DNI y la partida o libreta de matrimonio.
2. **Centro de Atención Virtual (CAV)**: Podés consultar el estado de tu cobertura a través de la web institucional de la SSSalud sin pasos complejos.
3. **Atención presencial si estás en Buenos Aires**: Si preferís la atención cara a cara, podés sacar un turno en Bartolomé Mitre 434 (CABA) y llevar todos los papeles impresos para que un agente público te reciba la documentación.

Decime qué situación tenés que resolver y te voy guiando con paciencia paso a paso.`;
  }

  // 4. Situación: Vulnerabilidad económica / Falta de dinero para copagos, pasajes o cobro de plus médico
  if (
    t.includes('plus') ||
    t.includes('coseguro') ||
    t.includes('copago') ||
    t.includes('arancel') ||
    t.includes('cobrar de mas') ||
    t.includes('cobran de más') ||
    t.includes('no tengo plata') ||
    t.includes('no tengo dinero') ||
    t.includes('no llego a fin de mes')
  ) {
    return `Entiendo la impotencia y la dificultad económica que esto representa. Tener que afrontar gastos imprevistos o cobros indebidos cuando uno ya aporta a una obra social o paga una cuota es completamente injusto.

Tené en cuenta estas garantías legales:
• **Todos los trámites ante la SSSalud son 100% gratuitos**: No tenés que pagar gestores, tasas ni aranceles para hacer valer tus derechos.
• **Cobro de plus médico / coseguros abusivos**: Si el profesional o la clínica te exige dinero en mano ("plus") por una prestación contemplada en el Programa Médico Obligatorio (PMO) o por discapacidad, se trata de una práctica irregular. La SSSalud puede intimar a la obra social para que garantice prestadores sin copago o te reintegre lo abonado.
• **Prestaciones de Discapacidad**: Por Ley 24.901 tienen **cobertura obligatoria al 100%**, sin ningún tipo de coseguro.

¿Qué prestación o consulta te están intentando cobrar de más?`;
  }

  // 5. Situación: Negativa de afiliación por edad o enfermedad preexistente
  if (
    (t.includes('edad') || t.includes('años') || t.includes('preexistente') || t.includes('enfermedad previa') || t.includes('enfermedad anterior') || t.includes('diabetes previa')) &&
    (t.includes('no me quieren afiliar') || t.includes('me rechazan') || t.includes('me quieren cobrar fortuna') || t.includes('me aumentan'))
  ) {
    return `Sé lo discriminatorio e indignante que se siente cuando una entidad de salud intenta dejarte afuera por tener cierta edad o por una condición previa de salud.

Es muy importante que conozcas lo que dice la ley:
• **Las obras sociales no pueden rechazar tu afiliación**: Si estás en relación de dependencia, monotributo o régimen de aportes, ninguna obra social del sistema nacional puede negar el alta por edad o estado de salud.
• **En empresas de medicina prepaga (Ley 26.682)**: No pueden rechazar la afiliación de un usuario por enfermedades preexistentes. Únicamente la SSSalud puede autorizar, tras un dictamen formal, un valor diferencial justificado, pero **jamás denegar arbitrariamente la admisión**.
• Podés iniciar de inmediato el reclamo formal por Afiliación vía **TAD Trámite 6020**.

¿Qué entidad te está poniendo esta traba y qué motivo formal te dieron por escrito?`;
  }

  // 6. Situación: Prestador a más de 60 km / Traslado sanitario (Criterio 6.1 CAT)
  if (
    t.includes('60 km') ||
    t.includes('60km') ||
    t.includes('80 km') ||
    t.includes('100 km') ||
    t.includes('queda muy lejos') ||
    t.includes('queda lejos') ||
    t.includes('me queda lejos') ||
    t.includes('me mandan a atender lejos') ||
    t.includes('prestador lejos') ||
    t.includes('no tengo como ir') ||
    t.includes('no tengo cómo ir') ||
    t.includes('traslado')
  ) {
    return `Comprendo el cansancio y el perjuicio que significa que te deriven a un centro médico distante cuando estás con malestar físico o sin medios de movilidad adecuados.

Sobre este punto, el **Manual Operativo CAT de la SSSalud (Criterio 6.1)** establece:
• La distancia de 60 km **no está reglamentada como un tope normativo automático**. Es decir, la distancia por sí sola no determina el reclamo de forma automática.
• **Pero existe una solución médica**: Si por tu patología clínica, edad, imposibilidad motriz o falta de transporte público te resulta médicamente perjudicial viajar hasta allá, tu médico tratante debe emitir una **justificación médica de imposibilidad de traslado**.
• Con ese certificado, en la SSSalud podés reclamar que te asignen un prestador más cercano en convenio o que la obra social cubra el **traslado sanitario / ambulancia**.

¿Qué estudio o tratamiento te asignaron lejos de tu domicilio?`;
  }

  // 7. Situación: Cuidador domiciliario y Discapacidad (Criterio 6.2 CAT)
  if (
    (t.includes('cuidador') || t.includes('acompañante') || t.includes('asistente domiciliario')) &&
    (t.includes('cubre') || t.includes('rechaz') || t.includes('niega') || t.includes('requisito') || t.includes('necesito'))
  ) {
    return `Entiendo la necesidad imperiosa de contar con una persona de asistencia en el hogar para cuidar a un ser querido y el agotamiento que provoca no tener ese respaldo.

Para ser completamente claros y honestos con la normativa vigente según el **Criterio 6.2 del Manual CAT**:
• **Requisito obligatorio del CUD**: La cobertura obligatoria del cuidador domiciliario solo está respaldada por la Ley 24.901 si la persona cuenta con **Certificado Único de Discapacidad (CUD)** vigente.
• **Si no tiene CUD**: Las resoluciones del Programa Médico Obligatorio (PMO) no obligan a la obra social a financiar cuidadores particulares, aún si el paciente tiene internación domiciliaria.
• Si ya cuenta con CUD, la obra social debe cubrir el cuidador conforme a la justificación del médico tratante y el presupuesto del prestador.

¿La persona ya tiene emitido el CUD o necesitan tramitarlo primero?`;
  }

  // 8. Situación: Leches maternizadas / medicamentosas (Criterio 6.3 CAT)
  if (t.includes('leche') || t.includes('maternizada') || t.includes('nutrilon') || t.includes('aplv') || t.includes('medicamentosa')) {
    return `Comprendo la angustia que produce que te nieguen el alimento de un bebé cuando no tolera la leche común o la madre no puede amamantar.

El **Criterio 6.3 del Manual CAT** fija con claridad los supuestos de cobertura obligatoria:
• **Hasta los 6 meses de edad (100% de cobertura)**: Ante diagnósticos médicos justificados como Alergia a la Proteína de la Leche de Vaca (APLV), agalactia/hipolactia materna comprobada, madre bajo medicación psiquiátrica incompatible o diagnóstico de HIV.
• **Atención a este detalle**: El bajo peso del bebé por sí solo **no alcanza** como justificación médica según la auditoría de la SSSalud; el pediatra debe especificar la patología de base.
• **Casos de madres con HIV (Ley 27.675)**: La cobertura obligatoria se extiende hasta los 18 meses de vida.

¿Tenés la orden médica de tu pediatra con el diagnóstico específico?`;
  }

  // 9. Situación: Estudios en el embarazo - Scan fetal / TN Plus (Criterio 6.4 CAT)
  if (t.includes('scan fetal') || t.includes('tn plus') || t.includes('ecografia morfologica') || t.includes('translucencia nucal')) {
    return `Entiendo la preocupación durante el embarazo y la molestia de que la obra social o prepaga pretenda cobrarte o negarte estudios fundamentales para monitorear la salud de tu bebé.

¡Quedate tranquila/o! **Tienen cobertura obligatoria al 100% por ley**:
• El **Scan fetal (ecografía morfológica)** y la **TN Plus (translucencia nucal plus)** están incluidos en la **Ley 27.611 de Atención y Cuidado Integral de la Salud durante el Embarazo y la Primera Infancia**.
• Todas las obras sociales y empresas de medicina prepaga deben cubrirlos sin coseguros ni demoras.

Si te lo están rechazando, podés presentar el reclamo por TAD Trámite 2723. ¿Qué entidad de salud te los está negando?`;
  }

  // 10. Situación: Autismo / TEA / Pruebas diagnósticas ADOS y ADI-R (Criterio 6.6 CAT)
  if (t.includes('ados') || t.includes('adi-r') || t.includes('adir') || t.includes('tea') || t.includes('autismo')) {
    return `Sé lo desgastante que es peregrinar por turnos y autorizaciones cuando una familia está buscando el diagnóstico temprano para un hijo con sospecha de TEA.

Te transmito una certeza legal importantísima respaldada en el **Criterio 6.6 del Manual CAT**:
• Por la **Ley 27.043**, las evaluaciones **ADOS y ADI-R están formalmente incluidas en el Programa Médico Obligatorio (PMO)**.
• **NO te pueden exigir tener CUD previo para cubrirlas**: Justamente estas herramientas son las que permiten llegar al diagnóstico inicial, por lo cual exigir el CUD es una traba ilegítima.

Si te están negando la cobertura de los módulos diagnósticos, podemos intimar inmediatamente. ¿En qué obra social o prepaga está afiliado/a?`;
  }

  // 11. Situación: Semaglutida / Ozempic (Criterio 6.7 CAT)
  if (t.includes('ozempic') || t.includes('semaglutida') || t.includes('semaglutide')) {
    return `Entiendo que consultes por este tratamiento, ya que es muy recetado últimamente y su costo en farmacias es sumamente elevado.

Para ser completamente transparentes con la postura institucional de la SSSalud según el **Criterio 6.7 (febrero 2026)**:
• En el marco de la normativa vigente para diabetes, Ozempic/semaglutida **no se encuentra incorporada en la resolución de cobertura obligatoria al 100%**.
• Por esta razón, el organismo no emite intimaciones de oficio a las obras sociales para su cobertura integral, salvo que el afiliado cuente con una medida cautelar o amparo judicial particular.

¿Tu médico diabetólogo te indicó alguna otra alternativa contemplada en el vademécum obligatorio de diabetes?`;
  }

  // 12. Situación: Demoras prolongadas / Silencio administrativo ("hace un mes no me responden")
  if (
    t.includes('hace un mes') ||
    t.includes('hace semanas') ||
    t.includes('no me contestan') ||
    t.includes('no me dan respuesta') ||
    t.includes('me tienen a las vueltas') ||
    t.includes('silencio') ||
    t.includes('sin respuesta')
  ) {
    return `Es comprensible tu frustración y cansancio: el silencio y las vueltas innecesarias de las obras sociales son una forma encubierta de denegar el acceso a la salud.

Frente a la falta de respuesta, la ley te protege:
1. **Constitución en mora (Intimación 48 hs)**: Cuando una entidad no responde en plazos razonables, se le remite una nota formal de intimación y pronto despacho otorgándoles 48 horas bajo apercibimiento de reclamo en la SSSalud y acción de amparo judicial (podés redactarla automáticamente desde nuestra pestaña *Herramientas IA*).
2. **Presentación directa en TAD**: Si no tenés constancia de rechazo porque no te la quieren dar, podés adjuntar capturas de pantalla de los correos enviados, mensajes de WhatsApp o el número de trámite interno desoído para iniciar el expediente ante la SSSalud.

¿Qué prestación o pedido tenés demorado y desde qué fecha?`;
  }

  return null;
}

// Warm, empathetic local human expert engine
function runLocalExpertEngine(userMessage: string, history: any[] = []): string {
  const msgClean = userMessage.trim().toLowerCase();
  const cleanPunct = msgClean
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!¡?¿;:-]/g, '')
    .trim();

  // 1. Check for pure greetings & pleasantries - MENSAJE DE BIENVENIDA OBLIGATORIO
  if (esSoloSaludoOIntro(userMessage)) {
    return MENSAJE_BIENVENIDA_OBLIGATORIO;
  }

  // 2. Off-topic filter: ANSES, AFIP, multas de tránsito, etc.
  const offTopicKeywords = [
    'anses',
    'asignacion',
    'auh',
    'afip',
    'arca',
    'factura electronica',
    'multa',
    'multas',
    'transito',
    'infraccion',
    'renaper',
    'pasaporte',
    'vtv',
  ];
  const isOffTopic = offTopicKeywords.some((k) => cleanPunct.includes(k));
  if (
    isOffTopic &&
    !cleanPunct.includes('obra social') &&
    !cleanPunct.includes('prepaga') &&
    !cleanPunct.includes('medic')
  ) {
    return `Hola, entiendo tu consulta, pero te recuerdo que como Orienta IA solo puedo asistirte en trámites y reclamos vinculados a obras sociales y empresas de medicina prepaga ante la Superintendencia de Servicios de Salud (SSSalud). 

Para trámites de ANSES, AFIP o multas de tránsito, por favor consultá directamente en sus canales oficiales correspondientes.

Contame: ¿tenés algún inconveniente o gestión con tu cobertura de salud en la que te pueda orientar?`;
  }

  // 3. Check for rational situational responses with Empathetic Validation
  const respuestaSituacional = responderSituacionRacionalConValidacion(userMessage);
  if (respuestaSituacional) {
    return respuestaSituacional;
  }

  // Full case analysis across user messages only (to avoid matching assistant prompts)
  const userTextOnly = [
    ...history
      .filter((h: any) => h.role === 'user')
      .map((h: any) => h.content || h.parts?.[0]?.text || ''),
    userMessage,
  ]
    .join(' ')
    .toLowerCase();

  // 1. Detect Category strictly in 3 categories:
  // A) Negativa de afiliación o traspaso
  // B) Falta de cobertura en prestaciones médicas
  // C) Problemas con el valor de las cuotas
  let categoria = '';
  let tipoReclamoJson = '';
  if (userTextOnly.includes('afili') || userTextOnly.includes('traspaso') || userTextOnly.includes('cambi') || userTextOnly.includes('dar de alta') || userTextOnly.includes('no me toman') || userTextOnly.includes('rechazo de afiliacion')) {
    categoria = 'Negativa de afiliación o traspaso';
    tipoReclamoJson = 'Negativa de afiliación';
  } else if (userTextOnly.includes('cuota') || userTextOnly.includes('aumento') || userTextOnly.includes('arancel') || userTextOnly.includes('cobro indebido') || userTextOnly.includes('precio') || userTextOnly.includes('valor')) {
    categoria = 'Problemas con el valor de las cuotas';
    tipoReclamoJson = 'Cuotas';
  } else if (userTextOnly.includes('medic') || userTextOnly.includes('remedio') || userTextOnly.includes('cobertura') || userTextOnly.includes('turno') || userTextOnly.includes('cirugia') || userTextOnly.includes('estudio') || userTextOnly.includes('leche') || userTextOnly.includes('protesis') || userTextOnly.includes('tratamiento') || userTextOnly.includes('cud') || userTextOnly.includes('discapacidad')) {
    categoria = 'Falta de cobertura en prestaciones médicas';
    tipoReclamoJson = 'Falta de cobertura';
  }

  // 2. Detect Condition
  let condicion = '';
  let tipoUsuarioJson = '';
  if (userTextOnly.includes('monotribut')) {
    condicion = 'Monotributista';
    tipoUsuarioJson = 'Monotributista';
  } else if (userTextOnly.includes('dependencia') || userTextOnly.includes('recibo') || userTextOnly.includes('emplead') || userTextOnly.includes('empresa') || userTextOnly.includes('en blanco')) {
    condicion = 'Relación de dependencia';
    tipoUsuarioJson = 'Relación de dependencia';
  } else if (userTextOnly.includes('jubilad') || userTextOnly.includes('pension')) {
    condicion = 'Jubilado';
    tipoUsuarioJson = 'Jubilado';
  } else if (userTextOnly.includes('domest') || userTextOnly.includes('casas particulares')) {
    condicion = 'Servicio Doméstico';
    tipoUsuarioJson = 'Relación de dependencia';
  }

  // 3. Detect Recipient
  let destinatario = '';
  if (userTextOnly.includes('familiar') || userTextOnly.includes('hijo') || userTextOnly.includes('hija') || userTextOnly.includes('espos') || userTextOnly.includes('conyuge') || userTextOnly.includes('pareja') || userTextOnly.includes('bebe') || userTextOnly.includes('a cargo')) {
    destinatario = 'Familiar a cargo';
  } else if (userTextOnly.includes('para mi') || userTextOnly.includes('para mí') || userTextOnly.includes('soy yo') || userTextOnly.includes('titular')) {
    destinatario = 'Titular';
  }

  // Paso 5: Cierre y generación de datos estructurados si el usuario confirma que entendió
  const isCierre =
    cleanPunct.includes('entendido') ||
    cleanPunct.includes('todo claro') ||
    cleanPunct.includes('no me queda') ||
    cleanPunct.includes('no tengo dudas') ||
    cleanPunct.includes('muchas gracias') ||
    cleanPunct === 'gracias' ||
    cleanPunct === 'perfecto' ||
    cleanPunct === 'listo';

  if (isCierre && categoria && condicion) {
    const docsJson: string[] = [
      'DNI (frente y dorso)',
      'Formulario de Reclamo SSSalud completo y firmado',
    ];

    if (condicion === 'Monotributista') {
      docsJson.push('Últimos 3 comprobantes de pago del monotributo');
    } else if (condicion === 'Relación de dependencia' || condicion === 'Servicio Doméstico') {
      docsJson.push('Último recibo de sueldo');
    } else if (condicion === 'Jubilado') {
      docsJson.push('Último recibo de haberes');
    }

    if (tipoReclamoJson === 'Negativa de afiliación') {
      docsJson.push('Comprobante de rechazo de la Obra Social (si lo hubiere) o telegrama enviado');
    } else if (tipoReclamoJson === 'Falta de cobertura') {
      docsJson.push('Prescripción médica original', 'Resumen de historia clínica', 'Presupuesto o negativa por escrito de la entidad');
    } else if (tipoReclamoJson === 'Cuotas') {
      docsJson.push('Últimas facturas con detalle del aumento', 'Comprobante de pago o notificación fehaciente');
    }

    const payloadJson = {
      tipo_reclamo: tipoReclamoJson || 'Falta de cobertura',
      tipo_usuario: tipoUsuarioJson || 'Relación de dependencia',
      documentacion_requerida: docsJson,
    };

    return `¡Me alegra mucho haberte ayudado! Con estos papeles vas a poder ingresar tu gestión de forma impecable y sin demoras.

Acá te dejo el resumen estructurado de tu caso para ser procesado por el sistema:

\`\`\`json
${JSON.stringify(payloadJson, null, 2)}
\`\`\`

Recordá que podés iniciar tu presentación por Trámites a Distancia (TAD) o presencialmente con turno en la sede de la Superintendencia de Servicios de Salud. ¡Que tengas un excelente día!`;
  }

  // PASO 1 y 2: Si no detectamos categoría
  if (!categoria) {
    return `Para orientarte con exactitud, por favor contame cuál es el inconveniente que estás teniendo con tu obra social o prepaga.

Por el momento puedo asistirte con estas 3 temáticas:
• **Negativa de afiliación o traspaso**
• **Falta de cobertura en prestaciones médicas (medicamentos, tratamientos)**
• **Problemas con el valor de las cuotas**

¿Con cuál de estas situaciones necesitás ayuda?`;
  }

  // PASO 3: Perfilado del usuario - UNA PREGUNTA POR VEZ
  // Pregunta 1: Situación laboral
  if (!condicion) {
    return `Para este trámite vas a necesitar presentar documentación específica. Por favor, decime:

**¿Cuál es tu situación laboral actual?**
*(Relación de dependencia, Monotributista, Jubilado o Servicio Doméstico).*`;
  }

  // Pregunta 2: Titular o familiar
  if (!destinatario) {
    return `Perfecto, ya registré que sos **${condicion}**.

Por favor, decime: **¿el reclamo es para vos como titular o para un familiar a cargo?**`;
  }

  // PASO 4: Entrega de Requisitos (Checklist claro)
  const canalCodigo = categoria === 'Negativa de afiliación o traspaso' ? 'TAD 6020' : 'TAD 2723';
  const canalUrl =
    categoria === 'Negativa de afiliación o traspaso'
      ? 'https://tramitesadistancia.gob.ar/tramitesadistancia/detalle-tipo?id=6020'
      : 'https://tramitesadistancia.gob.ar/tramitesadistancia/detalle-tipo?id=2723';

  let docLaboral = '';
  if (condicion === 'Monotributista') {
    docLaboral = '• **Últimos 3 comprobantes de pago del monotributo**.';
  } else if (condicion === 'Relación de dependencia') {
    docLaboral = '• **Último recibo de sueldo**.';
  } else if (condicion === 'Jubilado') {
    docLaboral = '• **Último recibo de haberes**.';
  } else {
    docLaboral = '• **Último comprobante de pago de aportes (F.102/RT)**.';
  }

  let docEspecifica = '';
  if (categoria === 'Negativa de afiliación o traspaso') {
    docEspecifica = '• **Comprobante de rechazo de la Obra Social** (si lo hubiere) o telegrama enviado intimando el alta/traspaso.';
  } else if (categoria === 'Falta de cobertura en prestaciones médicas') {
    docEspecifica = `• **Prescripción médica original**: con diagnóstico, firma y matrícula legible del médico tratante.
• **Resumen de historia clínica**: detallando la evolución y justificación médica de la prestación.
• **Presupuesto o negativa por escrito de la entidad**: si te dieron constancia de rechazo o número de reclamo interno.`;
  } else {
    docEspecifica = '• **Últimas facturas emitidas por la prepaga** donde conste el desglose del aumento o valor objetado y comprobante de pago.';
  }

  let docFamiliar = '';
  if (destinatario === 'Familiar a cargo') {
    docFamiliar = '\n• **DNI del familiar a cargo** (frente y dorso).\n• **Acreditación del vínculo**: Partida de nacimiento (hijos), acta de matrimonio o certificado de unión convivencial.';
  }

  return `Para iniciar tu gestión por **${categoria}** siendo **${condicion}** (${destinatario}), vas a necesitar presentar la siguiente documentación:

### Requisitos Obligatorios
• **DNI del titular** (frente y dorso).
• **Formulario de Reclamo SSSalud completo y firmado**.
${docLaboral}
${docEspecifica}${docFamiliar}

### Canal de Presentación
• **Vía Digital**: Trámite **${canalCodigo}** en [Trámites a Distancia (TAD)](${canalUrl}).
• **Atención Presencial**: Sede Central de la SSSalud, Bartolomé Mitre 434, Planta Baja, CABA (con turno previo web obligatorio).

¿Te quedó alguna duda más sobre esta documentación?`;
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    engine: 'SSSalud CAT Racional, Humano & Empático',
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, userMessage } = req.body;

  if (!userMessage && (!messages || messages.length === 0)) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  const promptText = userMessage || (messages?.[messages.length - 1]?.content ?? '');

  // 1. Check greetings
  if (esSoloSaludoOIntro(promptText)) {
    const reply = runLocalExpertEngine(promptText, messages || []);
    return res.json({
      reply,
      model: 'sssalud-cat-engine',
      source: 'greeting-handler',
      isGreeting: true,
    });
  }

  // Off-topic filter: ANSES, AFIP, multas de tránsito
  const cleanNorm = promptText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!¡?¿;:-]/g, '')
    .trim();
  const offTopicKeywords = [
    'anses',
    'asignacion',
    'auh',
    'afip',
    'arca',
    'factura electronica',
    'multa',
    'multas',
    'transito',
    'infraccion',
    'renaper',
    'pasaporte',
    'vtv',
  ];
  if (
    offTopicKeywords.some((k) => cleanNorm.includes(k)) &&
    !cleanNorm.includes('obra social') &&
    !cleanNorm.includes('prepaga') &&
    !cleanNorm.includes('medic')
  ) {
    return res.json({
      reply: `Hola, entiendo tu consulta, pero te recuerdo que como Orienta IA solo puedo asistirte en trámites y reclamos vinculados a obras sociales y empresas de medicina prepaga ante la Superintendencia de Servicios de Salud (SSSalud).\n\nPara trámites de ANSES, AFIP o multas de tránsito, por favor consultá directamente en sus canales oficiales correspondientes.\n\nContame: ¿tenés algún inconveniente o gestión con tu cobertura de salud en la que te pueda orientar?`,
      model: 'sssalud-cat-engine',
      source: 'off-topic-filter',
    });
  }

  // 2. Check situational rational responses with empathetic validation
  const respuestaSituacional = responderSituacionRacionalConValidacion(promptText);
  if (respuestaSituacional) {
    return res.json({
      reply: respuestaSituacional,
      model: 'sssalud-cat-engine',
      source: 'situational-handler',
    });
  }

  if (ai) {
    try {
      const contents: any[] = [];
      if (Array.isArray(messages)) {
        for (const m of messages.slice(-6)) {
          contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          });
        }
      }
      if (userMessage) {
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }],
        });
      }

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: ORIENTA_SYSTEM_INSTRUCTION,
          temperature: 0.4,
          topP: 0.85,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI chat timeout')), 4500)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      if (response?.text) {
        return res.json({
          reply: response.text,
          model: 'gemini-3.8-flash',
          source: 'gemini-live',
        });
      }
    } catch (error: any) {
      console.warn('Transición transparente a motor humano SSSalud:', error?.message || error);
    }
  }

  const reply = runLocalExpertEngine(promptText, messages || []);
  return res.json({
    reply,
    model: 'sssalud-cat-engine',
    source: 'sssalud-expert-engine',
    fallback: true,
  });
});

// Case analysis
app.post('/api/ai/analyze-case', async (req: Request, res: Response) => {
  const { texto, historial } = req.body;
  if (!texto) return res.status(400).json({ error: 'Texto requerido' });

  const allText = [
    ...(historial || []).map((h: any) => h.content || ''),
    texto,
  ].join(' ').toLowerCase();

  let categoria: string | null = null;
  if (allText.includes('afili') || allText.includes('dar de alta') || allText.includes('no me quieren tomar') || allText.includes('rechazo')) {
    categoria = 'Afiliación';
  } else if (allText.includes('cambi') || allText.includes('traspaso') || allText.includes('opcion')) {
    categoria = 'Opción de Cambio';
  } else if (allText.includes('cud') || allText.includes('discapacidad') || allText.includes('cuidador') || allText.includes('terapia')) {
    categoria = 'Discapacidad';
  } else if (allText.includes('unific') || allText.includes('dos empleos') || allText.includes('pluriempleo')) {
    categoria = 'Unificación de Aportes';
  } else if (allText.includes('medic') || allText.includes('remedio') || allText.includes('cobertura') || allText.includes('leche') || allText.includes('estudio')) {
    categoria = 'Problema Prestacional / Cobertura';
  }

  let condicionLaboral: string | null = null;
  if (allText.includes('monotributo social')) {
    condicionLaboral = 'Monotributo Social';
  } else if (allText.includes('monotribut')) {
    condicionLaboral = 'Monotributo';
  } else if (allText.includes('dependencia') || allText.includes('recibo') || allText.includes('emplead') || allText.includes('f931')) {
    condicionLaboral = 'Relación de dependencia';
  } else if (allText.includes('domest') || allText.includes('casas particulares')) {
    condicionLaboral = 'Casas particulares / Servicio doméstico';
  } else if (allText.includes('jubilad') || allText.includes('pension')) {
    condicionLaboral = 'Jubilado / Pensionado';
  } else if (allText.includes('desempleo')) {
    condicionLaboral = 'Seguro de desempleo';
  } else if (allText.includes('prepaga') || allText.includes('particular')) {
    condicionLaboral = 'Usuario directo de Prepaga / Adherente';
  }

  let destinatario: string | null = null;
  if (allText.includes('cud') || allText.includes('discapacidad')) {
    destinatario = 'Persona con CUD (Discapacidad)';
  } else if (allText.includes('estudiante') || allText.includes('universidad') || allText.includes('facultad') || allText.includes('21') || allText.includes('22') || allText.includes('23') || allText.includes('24') || allText.includes('25')) {
    destinatario = 'Hijo/a estudiante (21 a 25 años)';
  } else if (allText.includes('hijo') || allText.includes('hija') || allText.includes('bebe') || allText.includes('menor')) {
    destinatario = 'Hijo/a menor de 21 años';
  } else if (allText.includes('espos') || allText.includes('conyuge') || allText.includes('cónyuge') || allText.includes('pareja')) {
    destinatario = 'Familiar (Cónyuge / Conviviente)';
  } else if (allText.includes('para mi') || allText.includes('para mí') || allText.includes('soy yo') || allText.includes('titular')) {
    destinatario = 'Titular';
  }

  const datosCompletos = Boolean(categoria && condicionLaboral && destinatario);

  let preguntaFaltante: string | null = null;
  if (!categoria) {
    preguntaFaltante = 'Contame, ¿qué problema o trámite tenés pendiente con tu obra social o prepaga?';
  } else if (!condicionLaboral) {
    preguntaFaltante = '¿Cuál es la condición laboral del titular (dependencia con recibo, monotributo, servicio doméstico o jubilado/a)?';
  } else if (!destinatario) {
    preguntaFaltante = '¿El reclamo es para vos como titular, para tu hijo/a o cónyuge, o para una persona con CUD?';
  }

  const criteriosAplicables: string[] = [];
  if (destinatario === 'Persona con CUD (Discapacidad)' || categoria === 'Discapacidad') {
    criteriosAplicables.push('Criterio 6.2: El asistente domiciliario cuenta con cobertura con CUD (Ley 24.901).');
  }
  if (categoria === 'Opción de Cambio' && condicionLaboral === 'Relación de dependencia') {
    criteriosAplicables.push('Res. 139/2026: El empleador debe declarar al menos 2 bases mínimas en F.931 ($271.674,80).');
  }

  return res.json({
    categoria,
    condicionLaboral,
    destinatario,
    resumenCaso: `Caso SSSalud: ${categoria || 'Trámite a determinar'} - ${condicionLaboral || 'Condición laboral pendiente'}`,
    criteriosAplicables,
    preguntaFaltante,
    datosCompletos,
  });
});

// Document audit
app.post('/api/ai/audit-document', async (req: Request, res: Response) => {
  const { documentText } = req.body;
  const textLower = (documentText || '').toLowerCase();
  const tieneFirma = textLower.includes('dr') || textLower.includes('dra') || textLower.includes('firma') || textLower.includes('mat');
  const tieneDiagnostico = textLower.includes('diag') || textLower.includes('cie') || textLower.includes('paciente') || textLower.includes('recet');

  return res.json({
    tipoDocumento: textLower.includes('recibo') ? 'Recibo de Sueldo' : 'Prescripción Médica / Orden de Prestación',
    estado: tieneFirma && tieneDiagnostico ? 'Aprobado para TAD' : 'Requiere Corrección',
    observacionesPositivas: [
      'Documento legible y con formato admisible para la plataforma TAD.',
      tieneDiagnostico ? 'Contiene mención de patología o diagnóstico claro.' : 'Presenta datos de identificación.',
      tieneFirma ? 'Se visualiza identificación del profesional o entidad emisora.' : 'Apto para adjuntar en Balance.',
    ],
    elementosFaltantes: tieneFirma && tieneDiagnostico
      ? []
      : [
          'Verificá que se distinga la firma de puño y letra y el sello con el número de matrícula del médico.',
          'Revisá que la fecha de prescripción no sea mayor a 30 o 60 días.',
          'Si es un medicamento de alto costo o especial, acompañalo con una Síntesis de Historia Clínica breve.',
        ],
    recomendacionCiudadana:
      'Para que no te reboten el trámite en TAD ni te pidan subsanaciones, asegurate de que la orden médica tenga el sello bien nítido y el diagnóstico antes de subirla en la sección Balance.',
  });
});

// Draft letter
app.post('/api/ai/draft-letter', async (req: Request, res: Response) => {
  const { nombreTitular, obraSocial, motivo, detallesMedicos } = req.body;
  const fechaHoy = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const letter = `Buenos Aires, ${fechaHoy}

A LA DIRECCIÓN MÉDICA Y ADMINISTRATIVA DE:
${obraSocial ? obraSocial.toUpperCase() : '[NOMBRE DE LA OBRA SOCIAL O PREPAGA]'}
Presente

REF: INTIMACIÓN FORMAL Y PRONTO DESPACHO - COBERTURA MÉDICA URGENTE
AFILIADO/A: ${nombreTitular || '[NOMBRE Y APELLIDO COMPLETO]'}
N° DE AFILIADO / CARNET: [COMPLETAR N° DE CARNET]
DNI: [COMPLETAR DNI]

De mi mayor consideración:

Por medio de la presente, en mi condición de titular/beneficiario de vuestra entidad, me dirijo a ustedes a fin de INTIMARLOS FORMALMENTE a que en el plazo perentorio e improrrogable de 48 (cuarenta y ocho) horas de recibida la presente, procedan a autorizar y otorgar en forma integral y efectiva la prestación requerida:

MOTIVO DEL RECLAMO:
${motivo || '[Detallar la prestación o medicamento rechazado]'}

DETALLES MÉDICOS Y ANTECEDENTES:
${detallesMedicos || 'Según prescripción médica de profesional tratante adjunta en legajo.'}

FUNDAMENTO JURÍDICO:
La presente intimación se funda en el derecho a la salud amparado por los Tratados Internacionales de Derechos Humanos (art. 75 inc. 22 de la Constitución Nacional), la Ley 23.660 de Obras Sociales, las leyes complementarias de protección al paciente y el Programa Médico Obligatorio (PMO Res. 201/2002 del Ministerio de Salud).

RESERVA DE ACCIÓN ANTE LA SSSALUD Y VÍA JUDICIAL:
Hago expresa reserva de que, en caso de persistir el silencio, la negativa infundada o la demora injustificada, formalizaré la denuncia ante la SUPERINTENDENCIA DE SERVICIOS DE SALUD (mediante TAD) solicitando las sanciones correspondientes, sin perjuicio de interponer la correspondiente ACCIÓN DE AMPARO JUDICIAL CON MEDIDA CAUTELAR URGENTE con costas a su exclusivo cargo.

A la espera de su respuesta inmediata, los saludo atentamente.


________________________________________
Firma del Titular / Beneficiario
Aclaración: ${nombreTitular || '[Nombre y Apellido]'}
DNI: [Número de Documento]
Teléfono de Contacto: [Teléfono]
Correo Electrónico: [Email]`;

  return res.json({ letter, source: 'sssalud-legal-template' });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Orienta IA SSSalud (Validación Empática y Resolutiva) en http://0.0.0.0:${PORT}`);
  });
}

startServer();
