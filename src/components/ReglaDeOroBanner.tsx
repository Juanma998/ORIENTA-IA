import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, HeartHandshake, HelpCircle } from 'lucide-react';

export const ReglaDeOroBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border-y border-[#DDE5DF] px-4 py-2.5 sm:px-6 shadow-2xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-[#E4F2EC] text-[#174A45] shrink-0 mt-0.5">
            <HeartHandshake className="w-5 h-5 text-[#174A45]" />
          </div>

          <div className="flex-1 text-sm text-[#263D38]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#174A45] flex items-center gap-1.5 text-[15px]">
                  Cómo te acompañamos desde la SSSalud
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#E4F2EC] text-[#174A45] border border-[#DDE5DF]">
                    Orientación & Acompañamiento
                  </span>
                </span>
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-semibold text-[#174A45] hover:text-[#205B53] flex items-center gap-1 cursor-pointer"
              >
                {expanded ? 'Ocultar detalles' : '¿Cómo funciona?'}
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="mt-0.5 text-xs text-[#52645D] leading-snug">
              <strong className="text-[#263D38]">Orienta está para escucharte, orientarte y facilitarte las cosas.</strong> Para proteger tu privacidad y garantizar que tu reclamo tenga validez legal, no tomamos denuncias directamente por este chat. Nuestra misión es entender tu situación, darte tu <strong className="text-[#263D38]">checklist exacto de documentación</strong> y dejarte todo preparado para que ingreses tu trámite en los canales oficiales habilitados (TAD o presencial con turno).
            </p>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-[#DDE5DF] grid sm:grid-cols-3 gap-3 text-xs text-[#263D38]">
                <div className="bg-[#F0F7F3] p-3 rounded-xl border border-[#DDE5DF] shadow-2xs">
                  <div className="font-bold text-[#174A45] flex items-center gap-1.5 mb-1 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#174A45]" />
                    En qué te ayuda Orienta
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[#52645D] text-[11px]">
                    <li>Te escucha con empatía en tu propio lenguaje.</li>
                    <li>Revisa tu situación y condición de aportes.</li>
                    <li>Te entrega el checklist listo para imprimir.</li>
                  </ul>
                </div>

                <div className="bg-[#F0F7F3] p-3 rounded-xl border border-[#DDE5DF] shadow-2xs">
                  <div className="font-bold text-[#174A45] flex items-center gap-1.5 mb-1 text-xs">
                    <HelpCircle className="w-4 h-4 text-[#174A45]" />
                    Para cuidar tu gestión
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[#52645D] text-[11px]">
                    <li>No te pedirá claves fiscales ni contraseñas.</li>
                    <li>Te evita vueltas o papeles faltantes en la mesa de entrada.</li>
                    <li>Te guía paso a paso con las normas oficiales vigentes.</li>
                  </ul>
                </div>

                <div className="bg-[#F0F7F3] p-3 rounded-xl border border-[#DDE5DF] shadow-2xs">
                  <div className="font-bold text-[#174A45] flex items-center gap-1.5 mb-1 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#174A45]" />
                    Siguientes pasos oficiales
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-[#52645D] text-[11px]">
                    <li>Subir tu trámite a Trámites a Distancia (TAD).</li>
                    <li>O presentarte en la sede central de Bartolomé Mitre 434 con turno.</li>
                    <li>Hacer valer tus derechos con el expediente iniciado.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
