import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Copy,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { auditarDocumentoConIA, redactarCartaReclamoConIA } from '../services/chatService';

interface AiToolsModalProps {
  categoriaActual?: string | null;
}

export const AiToolsModal: React.FC<AiToolsModalProps> = ({ categoriaActual }) => {
  const [activeSubTab, setActiveSubTab] = useState<'auditor' | 'redactor'>('auditor');

  // Auditor state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [docText, setDocText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    tipoDocumento: string;
    estado: string;
    observacionesPositivas: string[];
    elementosFaltantes: string[];
    recomendacionCiudadana: string;
  } | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Redactor state
  const [titularNombre, setTitularNombre] = useState('');
  const [obraSocialNombre, setObraSocialNombre] = useState('');
  const [motivoReclamo, setMotivoReclamo] = useState('');
  const [detallesMedicos, setDetallesMedicos] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftedLetter, setDraftedLetter] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setDocPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ejecutarAuditoria = async () => {
    if (!docPreview && !docText.trim()) return;

    setIsAuditing(true);
    setAuditError(null);
    setAuditResult(null);

    try {
      const res = await auditarDocumentoConIA({
        documentBase64: docPreview || undefined,
        mimeType: docFile?.type || 'image/jpeg',
        documentText: docText.trim() || undefined,
        tipoTramite: categoriaActual || 'Problema Prestacional / Cobertura',
      });
      setAuditResult(res);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || 'No se pudo auditar el documento');
    } finally {
      setIsAuditing(false);
    }
  };

  const ejecutarRedaccion = async () => {
    if (!motivoReclamo.trim()) return;

    setIsDrafting(true);
    setDraftedLetter(null);

    try {
      const res = await redactarCartaReclamoConIA({
        nombreTitular: titularNombre.trim() || undefined,
        obraSocial: obraSocialNombre.trim() || undefined,
        motivo: motivoReclamo.trim(),
        detallesMedicos: detallesMedicos.trim() || undefined,
        tipoTramite: categoriaActual || 'Problemática Prestacional / Cobertura',
      });
      setDraftedLetter(res.letter);
    } catch (err: any) {
      console.error(err);
      alert('Hubo un error al generar la nota formal con IA. Intentalo de nuevo.');
    } finally {
      setIsDrafting(false);
    }
  };

  const copiarCarta = () => {
    if (!draftedLetter) return;
    navigator.clipboard.writeText(draftedLetter);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
      {/* Banner */}
      <div className="bg-[#174A45] text-white rounded-2xl p-6 sm:p-8 mb-6 border border-[#205B53] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#E4F2EC] text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#E4F2EC]" />
              <span>Inteligencia Artificial Gemini 3.8 Flash</span>
              <span>•</span>
              <span>SSSalud</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Herramientas de IA para el Ciudadano
            </h2>
            <p className="text-xs sm:text-sm text-[#E4F2EC]/90 mt-1 max-w-2xl">
              Verificá si tu receta o historia clínica cumple los requisitos de la SSSalud antes de subirla a TAD, o redactá una nota formal de intimación a tu obra social.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-[10px] border border-white/20 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('auditor')}
              className={`h-[36px] px-3.5 rounded-[8px] text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                activeSubTab === 'auditor'
                  ? 'bg-[#E4F2EC] text-[#174A45] shadow-xs'
                  : 'text-[#E4F2EC] hover:text-white hover:bg-white/10'
              }`}
            >
              Auditor de Recetas / Docs
            </button>
            <button
              onClick={() => setActiveSubTab('redactor')}
              className={`h-[36px] px-3.5 rounded-[8px] text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                activeSubTab === 'redactor'
                  ? 'bg-[#E4F2EC] text-[#174A45] shadow-xs'
                  : 'text-[#E4F2EC] hover:text-white hover:bg-white/10'
              }`}
            >
              Redactor de Intimación
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: AUDITOR DE DOCUMENTOS CON GEMINI MULTIMODAL */}
      {activeSubTab === 'auditor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-[#174A45]" />
              <h3 className="text-base font-bold text-[#174A45]">
                Auditoría Inteligente de Documentación (Visión con IA)
              </h3>
            </div>
            <p className="text-xs text-[#52645D] mb-4">
              Subí una foto o captura de tu <strong>receta médica, historia clínica, recibo de sueldo o nota de rechazo</strong>. La IA verificará si cuenta con firma, sello con matrícula, diagnóstico legible y justificativo para evitar que te rechacen el trámite en TAD.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Upload image box */}
              <div className="border-2 border-dashed border-[#DDE5DF] hover:border-[#6FA99A] rounded-2xl p-5 text-center transition-colors flex flex-col items-center justify-center bg-[#F7F8F4]">
                {docPreview ? (
                  <div className="w-full">
                    <img
                      src={docPreview}
                      alt="Documento cargado"
                      className="max-h-48 rounded-lg mx-auto object-contain border border-[#DDE5DF] shadow-xs mb-3"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-semibold text-[#263D38] truncate max-w-[200px]">
                        {docFile?.name}
                      </span>
                      <button
                        onClick={() => {
                          setDocFile(null);
                          setDocPreview(null);
                        }}
                        className="text-xs text-[#B3261E] hover:underline font-semibold cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-[#174A45] mb-2" />
                    <span className="text-xs font-bold text-[#174A45]">
                      Hacé clic para subir foto o documento
                    </span>
                    <span className="text-[11px] text-[#52645D] mt-1">
                      Formatos soportados: JPG, PNG, WEBP (hasta 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Or paste text */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="text-xs font-bold text-[#174A45] block mb-1">
                    O pegá el texto transcripto del documento:
                  </label>
                  <textarea
                    rows={4}
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    placeholder="Ejemplo: 'Receto Leche medicamentosa Nutrilón Pepti por sospecha de APLV. Paciente de 3 meses... Dr. Gómez Mat. Nac. 123456'"
                    className="w-full text-xs p-3 bg-[#F7F8F4] border border-[#DDE5DF] rounded-[9px] focus:outline-none focus:border-[#174A45]"
                  />
                </div>

                <button
                  onClick={ejecutarAuditoria}
                  disabled={(!docPreview && !docText.trim()) || isAuditing}
                  className={`mt-3 w-full h-10 rounded-[9px] text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shadow-xs ${
                    (docPreview || docText.trim()) && !isAuditing
                      ? 'bg-[#174A45] hover:bg-[#205B53] text-white cursor-pointer'
                      : 'bg-[#F0F7F3] text-[#52645D]/50 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isAuditing ? 'Auditando con Gemini 3.8 Flash...' : 'Auditar Documento con IA'}
                </button>
              </div>
            </div>
          </div>

          {/* Audit Results */}
          {auditResult && (
            <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE5DF] mb-4">
                <div>
                  <span className="text-xs text-[#52645D] font-medium block">
                    Documento analizado:
                  </span>
                  <h4 className="text-base font-bold text-[#174A45]">
                    {auditResult.tipoDocumento}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                      auditResult.estado.includes('Aprobado')
                        ? 'bg-[#E4F2EC] text-[#174A45] border border-[#DDE5DF]'
                        : 'bg-[#FFF3D8] text-[#805515] border border-[#F3D79B]'
                    }`}
                  >
                    {auditResult.estado.includes('Aprobado') ? (
                      <CheckCircle2 className="w-4 h-4 text-[#174A45]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#805515]" />
                    )}
                    {auditResult.estado}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Positives */}
                <div className="bg-[#E4F2EC] border border-[#DDE5DF] rounded-[10px] p-4">
                  <span className="text-xs font-bold text-[#174A45] uppercase tracking-wider block mb-2">
                    ✓ Requisitos reglamentarios cumplidos:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#263D38]">
                    {auditResult.observacionesPositivas.map((obs, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#174A45] font-bold">•</span>
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing */}
                <div className="bg-[#FFF3D8] border border-[#F3D79B] rounded-[10px] p-4">
                  <span className="text-xs font-bold text-[#805515] uppercase tracking-wider block mb-2">
                    ⚠️ Elementos que podrían causar rechazo en TAD:
                  </span>
                  {auditResult.elementosFaltantes.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-[#805515]">
                      {auditResult.elementosFaltantes.map((falta, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#805515] font-bold">•</span>
                          <span>{falta}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#174A45] font-medium">
                      No se detectaron faltantes críticos para este tipo de documento.
                    </p>
                  )}
                </div>
              </div>

              {/* Citizen recommendation */}
              <div className="bg-[#F0F7F3] border border-[#DDE5DF] rounded-[10px] p-4 text-xs text-[#174A45]">
                <strong className="block font-bold text-[#174A45] mb-1">
                  Recomendación de Orienta IA para tu presentación:
                </strong>
                <p className="leading-relaxed text-[#263D38]">{auditResult.recomendacionCiudadana}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: REDACTOR DE INTIMACIÓN / PRONTO DESPACHO */}
      {activeSubTab === 'redactor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#174A45]" />
              <h3 className="text-base font-bold text-[#174A45]">
                Redactor de Intimación Previa y Pronto Despacho (con IA)
              </h3>
            </div>
            <p className="text-xs text-[#52645D] mb-4">
              Antes de presentar el reclamo formal ante la SSSalud o en simultáneo, es muy conveniente enviar una <strong>nota de intimación o carta documento</strong> a tu Obra Social o Prepaga para constituirlos en mora. La IA fundamentará la nota citando las leyes de salud de la República Argentina.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-3 text-xs">
              <div>
                <label className="font-bold text-[#174A45] block mb-1">
                  Nombre del Titular o Beneficiario:
                </label>
                <input
                  type="text"
                  value={titularNombre}
                  onChange={(e) => setTitularNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full p-2.5 bg-[#F7F8F4] border border-[#DDE5DF] rounded-[9px] focus:outline-none focus:border-[#174A45] text-sm text-[#263D38]"
                />
              </div>

              <div>
                <label className="font-bold text-[#174A45] block mb-1">
                  Nombre de la Obra Social o Prepaga:
                </label>
                <input
                  type="text"
                  value={obraSocialNombre}
                  onChange={(e) => setObraSocialNombre(e.target.value)}
                  placeholder="Ej: OSDE / OSECAC / Swiss Medical / IOMA"
                  className="w-full p-2.5 bg-[#F7F8F4] border border-[#DDE5DF] rounded-[9px] focus:outline-none focus:border-[#174A45] text-sm text-[#263D38]"
                />
              </div>
            </div>

            <div className="mb-3 text-xs">
              <label className="font-bold text-[#174A45] block mb-1">
                Motivo concreto del reclamo o prestación rechazada: *
              </label>
              <input
                type="text"
                value={motivoReclamo}
                onChange={(e) => setMotivoReclamo(e.target.value)}
                placeholder="Ej: Falta de entrega de medicación oncológica recetada desde hace 20 días sin respuesta"
                className="w-full p-2.5 bg-[#F7F8F4] border border-[#DDE5DF] rounded-[9px] focus:outline-none focus:border-[#174A45] text-sm text-[#263D38]"
              />
            </div>

            <div className="mb-4 text-xs">
              <label className="font-bold text-[#174A45] block mb-1">
                Detalles médicos o antecedentes (opcional):
              </label>
              <textarea
                rows={2}
                value={detallesMedicos}
                onChange={(e) => setDetallesMedicos(e.target.value)}
                placeholder="Ej: Prescripción médica emitida el 15/09 por el Dr. Romero, diagnóstico Cáncer de Colon, número de trámite interno ante la prepaga 98741."
                className="w-full p-2.5 bg-[#F7F8F4] border border-[#DDE5DF] rounded-[9px] focus:outline-none focus:border-[#174A45] text-sm text-[#263D38]"
              />
            </div>

            <button
              onClick={ejecutarRedaccion}
              disabled={!motivoReclamo.trim() || isDrafting}
              className={`w-full h-10 rounded-[9px] text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shadow-xs ${
                motivoReclamo.trim() && !isDrafting
                  ? 'bg-[#174A45] hover:bg-[#205B53] text-white cursor-pointer'
                  : 'bg-[#F0F7F3] text-[#52645D]/50 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isDrafting ? 'Redactando nota formal con Gemini...' : 'Generar Nota de Intimación con IA'}
            </button>
          </div>

          {/* Drafted letter preview */}
          {draftedLetter && (
            <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE5DF] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#174A45]">
                  Modelo de Nota Formal Generado
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copiarCarta}
                    className="h-10 px-4 bg-white hover:bg-[#F0F7F3] text-[#174A45] border border-[#6FA99A] rounded-[9px] text-sm font-semibold flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
                  >
                    {copiado ? <CheckCircle2 className="w-4 h-4 text-[#174A45]" /> : <Copy className="w-4 h-4" />}
                    {copiado ? 'Copiado!' : 'Copiar texto'}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="h-10 px-4 bg-[#174A45] hover:bg-[#205B53] text-white rounded-[9px] text-sm font-semibold flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                </div>
              </div>

              <div className="bg-[#F7F8F4] border border-[#DDE5DF] rounded-[10px] p-5">
                <pre className="text-xs text-[#263D38] font-mono whitespace-pre-wrap leading-relaxed">
                  {draftedLetter}
                </pre>
              </div>

              <p className="mt-3 text-[11px] text-[#52645D] italic">
                * Completá los campos entre corchetes con tus datos personales antes de presentarla en mesa de entradas o enviarla por correo/carta documento.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
