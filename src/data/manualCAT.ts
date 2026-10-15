import { TramiteCategoria, CondicionLaboral, DestinatarioReclamo, ChecklistFinal } from '../types';

export const OFFICIAL_LINKS = {
  sssalud: 'https://www.argentina.gob.ar/sssalud',
  cav: 'https://www.argentina.gob.ar/sssalud/centro-de-atencion-virtual',
  tadInicio: 'https://tramitesadistancia.gob.ar/#/inicio',
  tad6020: 'https://tramitesadistancia.gob.ar/tramitesadistancia/detalle-tipo?id=6020',
  tad2723: 'https://tramitesadistancia.gob.ar/tramitesadistancia/detalle-tipo?id=2723',
  turnos: 'https://turnos.argentina.gob.ar/turnos/seleccionTurno/532',
  listadoMonotributo: 'https://www.sssalud.gob.ar/?page=listRnosc&tipo=3',
};

export const CAT_INFO = {
  organismo: 'Superintendencia de Servicios de Salud (SSSalud)',
  area: 'Centro de Atención Telefónica (CAT)',
  versionManual: 'Versión preliminar 1.0 - Septiembre 2026',
  compilacion: 'Mariana Ríos Insaurralde',
  sedePresencial: 'Bartolomé Mitre 434, Planta Baja, CABA',
  horarioAtencion: 'Lunes a viernes de 8:00 a 16:00 hs (Con turno previo)',
};

export const BASES_MINIMAS_2026 = {
  resolucion: 'Resolución 139/2026',
  baseMinima: '$135.837,40',
  dosBases: '$271.674,80',
  aclaracion: 'Para ejercer la opción de cambio en relación de dependencia, el empleador debe declarar en el Formulario 931 (Seguridad Social / Obra Social) al menos dos bases mínimas ($271.674,80). El CAT no modifica ni gestiona declaraciones de ARCA.',
};

export const CRITERIOS_MEDICOS_Y_OPERATIVOS = [
  {
    id: 'distancia',
    titulo: '6.1 Distancia para prestaciones',
    resumen: 'La distancia máxima de 60 km no se encuentra reglamentada como límite normativo vigente. Si la obra social/prepaga ofrece la prestación a más de 60 km, ese solo dato no determina automáticamente la procedencia del reclamo.',
    categoria: 'Prestacional',
  },
  {
    id: 'cuidador',
    titulo: '6.2 Asistente / Cuidador domiciliario',
    resumen: 'El asistente o cuidador domiciliario ÚNICAMENTE tiene cobertura obligatoria si se cuenta con Certificado Único de Discapacidad (CUD), independientemente de que exista internación domiciliaria. Sin CUD, no se encuentra incluido en el PMO.',
    categoria: 'Discapacidad / Prestacional',
  },
  {
    id: 'leches',
    titulo: '6.3 Leches maternizadas',
    resumen: 'Cobertura hasta los 6 meses de vida cuando el bebé no accede a lactancia materna por razones justificadas (madre con HIV, medicación psiquiátrica incompatible, agalactia o hipolactia) y prescripción médica. El bajo peso por sí solo NO se considera razón justificada. Se cubre hasta los 18 meses si la madre tiene HIV (Ley 27.675).',
    categoria: 'Prestacional',
  },
  {
    id: 'embarazo',
    titulo: '6.4 Estudios durante el embarazo',
    resumen: 'Tanto el Scan fetal (ecografía morfológica fetal) como la TN Plus (translucencia nucal plus) cuentan con cobertura obligatoria según la Ley 27.611 de Atención y Cuidado Integral de la Salud durante el Embarazo y la Primera Infancia.',
    categoria: 'Prestacional',
  },
  {
    id: 'pet',
    titulo: '6.5 Tomografía por Emisión de Positrones (PET)',
    resumen: 'El PET no posee cobertura obligatoria de forma automática en principio. Requiere evaluación individual del caso clínico según la historia clínica para determinar cobertura o eventual reintegro.',
    categoria: 'Prestacional',
  },
  {
    id: 'ados',
    titulo: '6.6 Diagnósticos ADOS y ADI-R (Autismo / TEA)',
    resumen: 'A partir de la Ley 27.043, las pruebas diagnósticas ADOS y ADI-R se encuentran formalmente incluidas en el Programa Médico Obligatorio (PMO). NO es necesario contar con CUD previo para exigir su cobertura obligatoria.',
    categoria: 'Prestacional / Discapacidad',
  },
  {
    id: 'ozempic',
    titulo: '6.7 Ozempic / Semaglutida',
    resumen: 'Criterio operativo febrero 2026: En el marco de la normativa de diabetes vigente, Ozempic / semaglutida no se encuentra contemplada con cobertura obligatoria al 100%. Debe revisarse ante eventuales modificaciones normativas.',
    categoria: 'Prestacional',
  },
  {
    id: 'prep',
    titulo: '6.8 Profilaxis PrEP y PEP (HIV)',
    resumen: 'Por Ley 27.675, existe cobertura de profilaxis preexposición (PrEP) para personas HIV negativas en condiciones específicas de riesgo y profilaxis postexposición (PEP) ante situaciones de urgencia o exposición de riesgo.',
    categoria: 'Prestacional',
  },
  {
    id: 'prepagas_no_inscriptas',
    titulo: '7. Prepagas no inscriptas en el RNEMP',
    resumen: 'Si una persona desea denunciar a una prepaga que NO figura inscripta en el Registro Nacional de Empresas de Medicina Prepaga (RNEMP), se la debe orientar hacia Defensa del Consumidor.',
    categoria: 'Afiliación / Cobertura',
  },
  {
    id: 'obras_sociales_baja',
    titulo: '8. Obras sociales en proceso de baja',
    resumen: 'Si el beneficiario pertenece a una obra social que está en proceso de baja oficial por la SSSalud, debe ser orientado a realizar la opción de cambio. Si es monotributista, debe elegir entre los agentes habilitados.',
    categoria: 'Opción de Cambio',
  },
];

export const MODELOS_DE_CORREO_CAT = {
  afiliacion: {
    seccion: '5.1 Mail - Afiliación',
    asunto: 'Denuncia / consulta de afiliación - Instructivo y documentación',
    cuerpo: `Buen día:
De acuerdo con su consulta, le enviamos la información necesaria para iniciar la presentación correspondiente.

Documentación requerida:
• Formulario de reclamo vigente completo y firmado.
• Documentación respaldatoria según el listado adjunto y su condición laboral.

Opciones para iniciar el trámite:
1) A través de la plataforma TAD (Trámites a Distancia) con el trámite código 6020.
2) De forma presencial con turno previo en la sede de Bartolomé Mitre 434, PB, CABA.

Para consultas sobre el estado de su expediente puede ingresar al Centro de Atención Virtual (CAV), TINA o consultar en TAD.

Saludos cordiales,
Centro de Atención Telefónica - SSSalud`,
  },
  prestacional: {
    seccion: '5.2 Mail - Problemática prestacional / cobertura',
    asunto: 'Reclamo prestacional - Formulario, documentación y canales',
    cuerpo: `Buen día:
En relación con su consulta, adjuntamos el formulario vigente y el listado de documentación correspondiente.

El formulario debe completarse y firmarse. Luego deberá acompañarse con la documentación respaldatoria médica y laboral indicada para su caso.

La presentación puede iniciarse por TAD mediante el trámite código 2723 o, cuando proceda, de forma presencial con turno previo en Bartolomé Mitre 434, PB, CABA.

Saludos cordiales,
Centro de Atención Telefónica - SSSalud`,
  },
};

export function generarChecklistOficial(
  categoria: TramiteCategoria,
  condicion: CondicionLaboral,
  destinatario: DestinatarioReclamo
): ChecklistFinal {
  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const docGeneral = [
    {
      id: 'f-rec',
      texto: 'Formulario de Reclamo Oficial SSSalud vigente',
      detalle: 'Debe estar completo en todos sus campos y debidamente firmado por el titular.',
      obligatorio: true,
      seccion: 'general' as const,
    },
    {
      id: 'dni-tit',
      texto: 'DNI del Titular (frente y dorso)',
      detalle: 'Copia clara y legible del Documento Nacional de Identidad vigente.',
      obligatorio: true,
      seccion: 'general' as const,
    },
    {
      id: 'cred-os',
      texto: 'Credencial de Obra Social o Empresa de Medicina Prepaga',
      detalle: 'Copia de credencial física o digital del titular y del beneficiario.',
      obligatorio: false,
      seccion: 'general' as const,
    },
  ];

  if (destinatario.includes('Familiar') || destinatario.includes('Hijo') || destinatario.includes('CUD')) {
    docGeneral.push({
      id: 'dni-fam',
      texto: 'DNI del beneficiario familiar (frente y dorso)',
      detalle: 'Documento de identidad de la persona para la cual se solicita la afiliación o cobertura.',
      obligatorio: true,
      seccion: 'general' as const,
    });
    docGeneral.push({
      id: 'vinculo',
      texto: 'Acreditación fehaciente del vínculo familiar',
      detalle: 'Partida de nacimiento (hijos), acta de matrimonio o certificado de unión convivencial/concubinato inscripto.',
      obligatorio: true,
      seccion: 'general' as const,
    });
  }

  if (destinatario === 'Hijo/a estudiante (21 a 25 años)') {
    docGeneral.push({
      id: 'alumno-reg',
      texto: 'Certificado de Alumno Regular actualizado',
      detalle: 'Expedido por establecimiento educativo reconocido oficialmente para hijos mayores de 21 y hasta 25 años.',
      obligatorio: true,
      seccion: 'general' as const,
    });
  }

  if (destinatario === 'Persona con CUD (Discapacidad)' || categoria === 'Discapacidad') {
    docGeneral.push({
      id: 'cud-doc',
      texto: 'Certificado Único de Discapacidad (CUD) vigente',
      detalle: 'Copia legible del CUD emitido por Junta Evaluadora oficial.',
      obligatorio: true,
      seccion: 'general' as const,
    });
  }

  const docMedica = [];
  if (
    categoria === 'Problema Prestacional / Cobertura' ||
    categoria === 'Discapacidad'
  ) {
    docMedica.push(
      {
        id: 'prescripcion',
        texto: 'Prescripción médica actualizada',
        detalle: 'Emitida por médico tratante con fecha reciente, diagnóstico claro, firma y sello con número de matrícula legible.',
        obligatorio: true,
        seccion: 'medica' as const,
      },
      {
        id: 'historia-clinica',
        texto: 'Síntesis o resumen de Historia Clínica actualizada',
        detalle: 'Elaborada por el profesional de la salud tratante, detallando evolución, tratamientos previos y estado actual.',
        obligatorio: true,
        seccion: 'medica' as const,
      },
      {
        id: 'justificacion',
        texto: 'Justificación médica actualizada de la prestación',
        detalle: 'Fundamentación técnica emitida por el médico tratante sobre la necesidad imperiosa del tratamiento, estudio o medicamento.',
        obligatorio: true,
        seccion: 'medica' as const,
      },
      {
        id: 'negativa-previa',
        texto: 'Constancia de negativa o número de reclamo ante la Obra Social/Prepaga',
        detalle: 'Si hubo rechazo previo por escrito o carta documento, adjuntar copia. Si fue telefónico, consignar número de reclamo interno.',
        obligatorio: false,
        seccion: 'medica' as const,
      }
    );
  }

  const docLaboral = [];
  switch (condicion) {
    case 'Relación de dependencia':
      docLaboral.push({
        id: 'recibo-sueldo',
        texto: 'Último recibo de sueldo oficial',
        detalle: 'Donde figuren los aportes y contribuciones a la obra social.',
        obligatorio: true,
        seccion: 'laboral' as const,
      });
      if (categoria === 'Opción de Cambio') {
        docLaboral.push({
          id: 'base-minima-f931',
          texto: 'Aportes en Formulario 931 acordes a Bases Mínimas ($271.674,80)',
          detalle: 'Según Res. 139/2026, el empleador debe declarar al menos dos bases mínimas ($271.674,80) en Seguridad Social / Obra Social.',
          obligatorio: true,
          seccion: 'laboral' as const,
        });
      }
      break;

    case 'Monotributo':
      docLaboral.push(
        {
          id: 'mono-pago',
          texto: 'Último comprobante de pago de Monotributo',
          detalle: 'Ticket o constancia de débito/pago bancario del componente de salud del mes en curso o inmediato anterior.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'mono-ctacte',
          texto: 'Estado de Cuenta Corriente o Libre Deuda de ARCA',
          detalle: 'Descargado del portal de ARCA (ex AFIP) demostrando que no existen deudas impagas.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'mono-f184',
          texto: 'Formulario 184 de ARCA',
          detalle: 'Constancia oficial de inscripción en Monotributo emitida por ARCA donde consta la obra social declarada.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'mono-f152',
          texto: 'Formulario 152 de ARCA',
          detalle: 'Credencial de pago del pequeño contribuyente.',
          obligatorio: true,
          seccion: 'laboral' as const,
        }
      );
      break;

    case 'Monotributo Social':
      docLaboral.push(
        {
          id: 'mono-soc-pago',
          texto: 'Último comprobante de pago de Monotributo Social',
          detalle: 'Ticket de pago mensual del componente correspondiente.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'mono-soc-ctacte',
          texto: 'Cuenta corriente o Libre Deuda de ARCA',
          detalle: 'Descargado del portal de ARCA.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'mono-soc-caratula',
          texto: 'Carátula de Desarrollo Social o constancia de alta de Monotributo Social',
          detalle: 'Documento original de aprobación emitido por el Ministerio de Capital Humano / Desarrollo Social.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'mono-soc-f152',
          texto: 'Formulario 152 de ARCA',
          detalle: 'Credencial de pago de ARCA.',
          obligatorio: true,
          seccion: 'laboral' as const,
        }
      );
      break;

    case 'Casas particulares / Servicio doméstico':
      docLaboral.push(
        {
          id: 'dom-pago',
          texto: 'Último comprobante de pago de aportes de Casas Particulares',
          detalle: 'Abonado por el empleador (Formulario 102/RT o débito automático).',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'dom-f575-fam',
          texto: 'Formulario 575 de ARCA (Aporte voluntario familiar)',
          detalle: 'Obligatorio si el reclamo involucra incorporar a miembros del grupo familiar.',
          obligatorio: destinatario.includes('Familiar') || destinatario.includes('Hijo'),
          seccion: 'laboral' as const,
        },
        {
          id: 'dom-f575-horas',
          texto: 'Formulario 575 ARCA por diferencia de horas (si trabaja menos de 16 hs semanales)',
          detalle: 'Si no cumple las 16 horas semanales mínimas exigidas por el régimen, debe abonar el aporte adicional voluntario con F.575.',
          obligatorio: false,
          seccion: 'laboral' as const,
        }
      );
      break;

    case 'Jubilado / Pensionado':
      docLaboral.push(
        {
          id: 'recibo-jubilacion',
          texto: 'Último recibo de haberes previsionales',
          detalle: 'Comprobante de cobro de jubilación o pensión emitido por cajero o ANSES.',
          obligatorio: true,
          seccion: 'laboral' as const,
        },
        {
          id: 'codem-anses',
          texto: 'Comprobante de Empadronamiento (CODEM) de ANSES',
          detalle: 'Constancia que certifica a qué Obra Social se destinan sus descuentos jubilatorios.',
          obligatorio: true,
          seccion: 'laboral' as const,
        }
      );
      break;

    case 'Seguro de desempleo':
      docLaboral.push({
        id: 'anses-desempleo',
        texto: 'Constancia de ANSES de Seguro de Desempleo',
        detalle: 'Certificación que acredite hacia qué Obra Social se están efectuando los aportes de continuidad de cobertura.',
        obligatorio: true,
        seccion: 'laboral' as const,
      });
      break;

    case 'Usuario directo de Prepaga / Adherente':
      docLaboral.push({
        id: 'factura-prepaga',
        texto: 'Última factura abonada de la prepaga / comprobante de pago',
        detalle: 'Comprobante de estar al día con la cuota mensual contratada de manera directa.',
        obligatorio: true,
        seccion: 'laboral' as const,
      });
      break;
  }

  // Canales oficiales
  let canalPresentacion = {
    nombre: 'Plataforma TAD (Trámites a Distancia) o Presencial con Turno',
    tadCodigo: 'TAD 2723',
    tadUrl: OFFICIAL_LINKS.tad2723,
    presencialDireccion: CAT_INFO.sedePresencial,
    presencialHorario: CAT_INFO.horarioAtencion,
    turnosUrl: OFFICIAL_LINKS.turnos,
    instruccionesTad: [
      '1. Ingresar a Trámites a Distancia (TAD) con AFIP Clave Fiscal o Mi Argentina.',
      '2. Buscar e iniciar el trámite correspondiente.',
      '3. Completar el apartado 1: "Datos del Trámite".',
      '4. Completar el apartado 2: "Presentación de Reclamos de Beneficiarios".',
      '5. OBLIGATORIO: En el apartado 3 "Balance", adjuntar el Formulario de Reclamo Oficial firmado junto a la documentación.',
    ],
    aclaracionEspecial: '',
  };

  if (categoria === 'Afiliación') {
    canalPresentacion.tadCodigo = 'TAD 6020';
    canalPresentacion.tadUrl = OFFICIAL_LINKS.tad6020;
    canalPresentacion.aclaracionEspecial =
      'Para trámites y denuncias por falta o negativa de afiliación se utiliza el trámite TAD código 6020.';
  } else if (categoria === 'Opción de Cambio') {
    canalPresentacion.nombre = 'Portal SSSalud con Clave Fiscal Nivel 3 de ARCA';
    canalPresentacion.tadCodigo = 'Opción Digital SSSalud / ARCA';
    canalPresentacion.tadUrl = OFFICIAL_LINKS.sssalud;
    canalPresentacion.aclaracionEspecial =
      'El trámite de opción de cambio debe realizarse preferentemente desde una computadora. Requiere haber cumplido al menos un año de permanencia en la obra social anterior.';
  }

  const criteriosAplicables: string[] = [];
  if (destinatario === 'Persona con CUD (Discapacidad)' || categoria === 'Discapacidad') {
    criteriosAplicables.push(
      'Criterio 6.2: El cuidador/asistente domiciliario SOLO tiene cobertura con CUD (Ley 24.901). Sin CUD no está contemplado en el PMO.',
      'Ley 24.901: Cobertura del 100% en prestaciones de rehabilitación y habilitación para personas con CUD.'
    );
  }
  if (condicion === 'Monotributo' && categoria === 'Opción de Cambio') {
    criteriosAplicables.push(
      'Listado Monotributistas: Recuerde consultar previamente el listado de Agentes de Salud que aceptan monotributistas (Res. SSSalud).'
    );
  }
  if (condicion === 'Relación de dependencia' && categoria === 'Opción de Cambio') {
    criteriosAplicables.push(
      `Resolución 139/2026: El empleador debe declarar en F.931 al menos dos bases mínimas ($271.674,80) para hacer viable la opción de cambio.`
    );
  }

  return {
    id: `chk-${Date.now()}`,
    fecha: fechaHoy,
    categoria,
    condicionLaboral: condicion,
    destinatario,
    docGeneral,
    docMedica,
    docLaboral,
    canalPresentacion,
    criteriosAplicables,
  };
}
