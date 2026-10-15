import React, { useState } from 'react';
import {
  Printer,
  Copy,
  CheckCircle2,
  ExternalLink,
  Calendar,
  AlertTriangle,
  FileCheck,
  Building,
  Info,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';
import { ChecklistFinal, ChecklistItem } from '../types';

interface ChecklistViewProps {
  checklist: ChecklistFinal | null;
  onCrearNuevo: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  checklist,
  onCrearNuevo,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiado, setCopiado] = useState(false);

  if (!checklist) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-10 text-center">
        <div className="bg-white rounded-2xl border border-[#DDE5DF] p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#E4F2EC] text-[#174A45] flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-8 h-8 text-[#174A45]" />
          </div>
          <h3 className="text-xl font-bold text-[#174A45]">
            Aún no se ha generado un Checklist de Requisitos
          </h3>
          <p className="mt-2 text-[#52645D] max-w-md mx-auto text-sm">
            Conversá con <strong>Orienta IA</strong> indicando tu trámite y tu condición laboral, o seleccioná los datos arriba para generar tu lista oficial de documentación y canales.
          </p>
          <button
            onClick={onCrearNuevo}
            className="mt-6 h-10 px-5 bg-[#174A45] hover:bg-[#205B53] text-white rounded-[9px] font-semibold text-sm shadow-xs transition-colors duration-200 cursor-pointer"
          >
            Iniciar consulta con Orienta IA
          </button>
        </div>
      </div>
    );
  }

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems =
    checklist.docGeneral.length +
    checklist.docMedica.length +
    checklist.docLaboral.length;

  const completados = Object.values(checkedItems).filter(Boolean).length;
  const porcentaje = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0;

  const copiarAlPortapapeles = () => {
    const texto = `SUPERINTENDENCIA DE SERVICIOS DE SALUD (SSSalud)
CHECKLIST OFICIAL DE REQUISITOS - GENERADO POR ORIENTA IA
Fecha: ${checklist.fecha}

1. CATEGORÍA DEL RECLAMO:
${checklist.categoria} (Condición: ${checklist.condicionLaboral}, Destinatario: ${checklist.destinatario})

2. DOCUMENTACIÓN GENERAL:
${checklist.docGeneral.map((i) => `[ ] ${i.texto}: ${i.detalle || ''}`).join('\n')}

3. DOCUMENTACIÓN MÉDICA:
${
  checklist.docMedica.length > 0
    ? checklist.docMedica.map((i) => `[ ] ${i.texto}: ${i.detalle || ''}`).join('\n')
    : 'No requerida para este trámite.'
}

4. DOCUMENTACIÓN LABORAL (${checklist.condicionLaboral}):
${checklist.docLaboral.map((i) => `[ ] ${i.texto}: ${i.detalle || ''}`).join('\n')}

5. CANAL OFICIAL DE PRESENTACIÓN:
- Digital: ${checklist.canalPresentacion.tadCodigo} (${checklist.canalPresentacion.tadUrl})
- Presencial: ${checklist.canalPresentacion.presencialDireccion}, ${checklist.canalPresentacion.presencialHorario} (Turno web: ${checklist.canalPresentacion.turnosUrl})
- IMPORTANTE EN TAD: Completar "Datos del Trámite", "Presentación de Reclamos de Beneficiarios" y en "Balance" adjuntar el Formulario de Reclamo firmado.`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const imprimir = () => {
    window.print();
  };

  const renderItemSection = (
    titulo: string,
    items: ChecklistItem[],
    subtitulo?: string
  ) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#DDE5DF] mb-3">
          <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#174A45] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#174A45] inline-block no-print" />
            <span className="print-only hidden font-black">■</span>
            {titulo}
          </h4>
          {subtitulo && <span className="text-[12px] text-[#52645D] font-medium">{subtitulo}</span>}
        </div>

        <div className="space-y-2.5">
          {items.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-[9px] border transition-colors duration-200 cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-[#E4F2EC] border-[#6FA99A] text-[#263D38]'
                    : 'bg-white border-[#DDE5DF] hover:border-[#6FA99A] hover:bg-[#F0F7F3]'
                }`}
              >
                {/* Checkbox en pantalla (UI) */}
                <div
                  className={`no-print w-5 h-5 rounded-[6px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-[#174A45] border-[#174A45] text-white'
                      : 'border-[#DDE5DF] bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                {/* Checkbox limpio para impresión en papel / PDF */}
                <span className="print-only hidden shrink-0 mt-0.5 text-black font-mono text-base leading-none">
                  {isChecked ? '[X]' : '[  ]'}
                </span>

                <div className="flex-1 text-[14px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-semibold ${
                        isChecked ? 'text-[#174A45] line-through print:no-underline' : 'text-[#263D38]'
                      }`}
                    >
                      {item.texto}
                    </span>
                    {item.obligatorio && (
                      <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FFF3D8] text-[#805515] border border-[#F3D79B]">
                        Obligatorio
                      </span>
                    )}
                  </div>
                  {item.detalle && (
                    <p className={`mt-0.5 text-[12px] ${isChecked ? 'text-[#52645D]' : 'text-[#52645D]'}`}>
                      {item.detalle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
      {/* Botonera superior destacada para imprimir (no-print) */}
      <div className="no-print mb-4 bg-white border border-[#DDE5DF] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E4F2EC] text-[#174A45] flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5 text-[#174A45]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#174A45]">
              Checklist Oficial listo para imprimir o guardar en PDF
            </h3>
            <p className="text-xs text-[#52645D]">
              Formato limpio y profesional para presentar en mesa de entradas o llevar con tus papeles.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={imprimir}
            className="flex-1 sm:flex-initial h-10 px-4 bg-[#174A45] hover:bg-[#205B53] text-white font-semibold text-sm rounded-[9px] shadow-xs flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer"
            title="Imprimir documento oficial en formato limpio"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Checklist</span>
          </button>

          <button
            onClick={copiarAlPortapapeles}
            className="h-10 px-4 bg-white hover:bg-[#F0F7F3] text-[#174A45] border border-[#6FA99A] font-semibold text-sm rounded-[9px] flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
            title="Copiar texto para WhatsApp o email"
          >
            {copiado ? <CheckCircle2 className="w-4 h-4 text-[#174A45]" /> : <Copy className="w-4 h-4 text-[#174A45]" />}
            <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      {/* Contenedor imprimible del documento oficial */}
      <div className="bg-white rounded-2xl border border-[#DDE5DF] shadow-xs overflow-hidden print-card">
        {/* Cabecera oficial exclusiva para impresión física o PDF */}
        <div className="print-only hidden p-6 pb-4 border-b-2 border-slate-900 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                República Argentina • Poder Ejecutivo Nacional
              </span>
              <h1 className="text-lg font-black text-slate-950 leading-tight">
                SUPERINTENDENCIA DE SERVICIOS DE SALUD
              </h1>
              <p className="text-xs font-semibold text-slate-800">
                Centro de Atención Telefónica (CAT) • Orientación Oficial al Beneficiario
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <span className="block font-bold text-slate-900">Checklist Oficial de Requisitos</span>
              <span>Emisión: {checklist.fecha}</span>
            </div>
          </div>
        </div>

        {/* Header en pantalla */}
        <div className="bg-[#174A45] text-white p-6 sm:p-8 border-b border-[#205B53]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#E4F2EC] text-xs font-semibold uppercase tracking-wider mb-1">
                <span>República Argentina</span>
                <span>•</span>
                <span>Superintendencia de Servicios de Salud</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Checklist Oficial de Requisitos
              </h2>
              <p className="text-xs sm:text-sm text-[#E4F2EC]/90 mt-1">
                Guía oficial para la presentación de trámites y reclamos ante la SSSalud
              </p>
            </div>

            <div className="no-print flex items-center gap-2">
              <button
                onClick={imprimir}
                className="h-10 px-4 bg-white/10 hover:bg-white/20 text-white rounded-[9px] text-sm font-semibold flex items-center gap-2 transition-colors duration-200 border border-white/20 cursor-pointer"
                title="Imprimir o guardar como PDF"
              >
                <Printer className="w-4 h-4 text-[#E4F2EC]" />
                Imprimir / PDF
              </button>

              <button
                onClick={copiarAlPortapapeles}
                className="h-10 px-4 bg-[#6FA99A] hover:bg-[#5E9486] text-white rounded-[9px] text-sm font-semibold flex items-center gap-1.5 transition-colors duration-200 shadow-xs cursor-pointer"
                title="Copiar texto para WhatsApp o email"
              >
                {copiado ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Metadata badges */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-white/10 rounded-[9px] p-2.5 border border-white/10">
              <span className="text-[#E4F2EC]/80 text-[11px] block">Trámite</span>
              <strong className="text-white truncate block text-xs sm:text-sm">{checklist.categoria}</strong>
            </div>

            <div className="bg-white/10 rounded-[9px] p-2.5 border border-white/10">
              <span className="text-[#E4F2EC]/80 text-[11px] block">Condición Titular</span>
              <strong className="text-white truncate block text-xs sm:text-sm">{checklist.condicionLaboral}</strong>
            </div>

            <div className="bg-white/10 rounded-[9px] p-2.5 border border-white/10">
              <span className="text-[#E4F2EC]/80 text-[11px] block">Beneficiario</span>
              <strong className="text-white truncate block text-xs sm:text-sm">{checklist.destinatario}</strong>
            </div>

            <div className="bg-white/10 rounded-[9px] p-2.5 border border-white/10">
              <span className="text-[#E4F2EC]/80 text-[11px] block">Fecha de emisión</span>
              <strong className="text-white flex items-center gap-1 text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 text-[#E4F2EC]" />
                {checklist.fecha}
              </strong>
            </div>
          </div>
        </div>

        {/* Progress bar in UI (hidden in print) */}
        <div className="no-print bg-[#F0F7F3] px-6 py-3 border-b border-[#DDE5DF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#174A45]">
            <span>Progreso de recolección:</span>
            <span className="font-bold text-[#174A45]">{completados} de {totalItems} documentos</span>
          </div>

          <div className="flex-1 max-w-xs bg-[#DDE5DF] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#174A45] h-full transition-all duration-300 rounded-full"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          <span className="text-xs font-bold text-[#174A45]">{porcentaje}%</span>
        </div>

        {/* Checklist Content */}
        <div className="p-6 sm:p-8">
          {/* Categoría destacada */}
          <div className="bg-[#E4F2EC] border border-[#DDE5DF] rounded-[10px] p-4 mb-6 flex items-start gap-3">
            <Building className="w-5 h-5 text-[#174A45] shrink-0 mt-0.5 no-print" />
            <div>
              <h3 className="font-bold text-[#174A45] text-sm">
                Trámite: {checklist.categoria}
              </h3>
              <p className="text-xs text-[#52645D] mt-1">
                Reclamo iniciado para titular en condición de <strong>{checklist.condicionLaboral}</strong> con cobertura para <strong>{checklist.destinatario}</strong>.
              </p>
            </div>
          </div>

          {/* Requisitos Documentales */}
          {renderItemSection('1. Documentación General (Obligatoria para todo trámite)', checklist.docGeneral)}
          {renderItemSection('2. Documentación Médica Específica', checklist.docMedica, 'Emitida por médico tratante')}
          {renderItemSection(`3. Documentación Laboral (${checklist.condicionLaboral})`, checklist.docLaboral, 'Acreditación de aportes')}

          {/* Canales oficiales de presentación */}
          <div className="mt-8 pt-6 border-t border-[#DDE5DF]">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#174A45] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#174A45] inline-block no-print" />
              <span className="print-only hidden font-black">■</span>
              4. Canales Oficiales Habilitados para la Presentación
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Canal Digital TAD */}
              <div className="bg-[#F7F8F4] border border-[#DDE5DF] rounded-[10px] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#174A45] bg-[#E4F2EC] border border-[#DDE5DF] px-2 py-0.5 rounded">
                      Canal Digital Recomendado
                    </span>
                    <span className="text-xs font-medium text-[#52645D]">100% online</span>
                  </div>

                  <h5 className="font-bold text-[#174A45] text-sm">
                    Trámites a Distancia (TAD)
                  </h5>

                  <p className="text-xs font-semibold text-[#174A45] mt-1">
                    Código de trámite: {checklist.canalPresentacion.tadCodigo}
                  </p>

                  <p className="text-xs text-[#52645D] mt-1">
                    {checklist.canalPresentacion.nombre}
                  </p>

                  <div className="mt-3 bg-[#FFF3D8] border border-[#F3D79B] rounded-[9px] p-2.5 text-xs text-[#805515]">
                    <strong className="block mb-1 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#805515] no-print" />
                      Paso crítico en TAD:
                    </strong>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#805515]">
                      <li>Completar <em>"Datos del Trámite"</em>.</li>
                      <li>Completar <em>"Presentación de Reclamos de Beneficiarios"</em>.</li>
                      <li>
                        En <strong>"Balance"</strong>: adjuntar el Formulario de Reclamo completo y firmado.
                      </li>
                    </ol>
                  </div>
                </div>

                {checklist.canalPresentacion.tadUrl && (
                  <a
                    href={checklist.canalPresentacion.tadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print mt-4 inline-flex items-center justify-center gap-2 h-10 px-4 bg-[#174A45] hover:bg-[#205B53] text-white rounded-[9px] text-sm font-semibold transition-colors duration-200"
                  >
                    Ir a {checklist.canalPresentacion.tadCodigo} en TAD
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                
                <p className="print-only hidden text-xs text-slate-600 mt-2 font-mono">
                  Enlace TAD: {checklist.canalPresentacion.tadUrl}
                </p>
              </div>

              {/* Canal Presencial */}
              <div className="bg-[#F7F8F4] border border-[#DDE5DF] rounded-[10px] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#52645D] bg-white border border-[#DDE5DF] px-2 py-0.5 rounded">
                      Canal Presencial
                    </span>
                    <span className="text-xs font-semibold text-[#174A45] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 no-print" /> Turno previo obligatorio
                    </span>
                  </div>

                  <h5 className="font-bold text-[#174A45] text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#174A45] no-print" />
                    Sede Central SSSalud
                  </h5>

                  <p className="text-xs font-medium text-[#263D38] mt-1">
                    {checklist.canalPresentacion.presencialDireccion}
                  </p>

                  <p className="text-xs text-[#52645D] mt-1">
                    Horario de atención: <strong>{checklist.canalPresentacion.presencialHorario}</strong>.
                  </p>

                  <div className="mt-3 bg-white border border-[#DDE5DF] rounded-[9px] p-2.5 text-xs text-[#52645D]">
                    <p>
                      No se reciben reclamos espontáneos sin turno agendado. Presentarse con todos los documentos originales impresos del checklist.
                    </p>
                  </div>
                </div>

                <a
                  href={checklist.canalPresentacion.turnosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print mt-4 inline-flex items-center justify-center gap-2 h-10 px-4 bg-white hover:bg-[#F0F7F3] text-[#174A45] border border-[#6FA99A] rounded-[9px] text-sm font-semibold transition-colors duration-200"
                >
                  Solicitar Turno Presencial Web
                  <ExternalLink className="w-4 h-4" />
                </a>

                <p className="print-only hidden text-xs text-slate-600 mt-2 font-mono">
                  Turnos Web: {checklist.canalPresentacion.turnosUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Criterios normativos aplicables */}
          {checklist.criteriosAplicables.length > 0 && (
            <div className="mt-6 p-4 rounded-[10px] bg-[#E4F2EC] border border-[#DDE5DF]">
              <span className="text-xs font-bold text-[#174A45] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-[#174A45] no-print" />
                Criterios del Manual CAT aplicables a este caso:
              </span>
              <ul className="space-y-1.5 text-xs text-[#263D38]">
                {checklist.criteriosAplicables.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#174A45] font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pie de página institucional */}
          <div className="mt-8 pt-4 border-t border-[#DDE5DF] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#52645D] gap-2">
            <span>Superintendencia de Servicios de Salud • Centro de Atención Telefónica (CAT)</span>
            <span>Manual v1.0 Mariana Ríos Insaurralde • Orientación no vinculante</span>
          </div>
        </div>
      </div>

      {/* Botón inferior adicional para imprimir (no-print) */}
      <div className="no-print mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-[#DDE5DF] shadow-xs">
        <div className="text-xs text-[#52645D] text-center sm:text-left">
          ¿Listo para armar tu carpeta de presentación? Imprimí o guardá este checklist en PDF para chequear cada documento.
        </div>
        <button
          onClick={imprimir}
          className="w-full sm:w-auto h-10 px-5 bg-[#174A45] hover:bg-[#205B53] text-white rounded-[9px] font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors duration-200 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Checklist</span>
        </button>
      </div>
    </div>
  );
};
