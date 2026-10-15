import React from 'react';
import {
  OFFICIAL_LINKS,
  CAT_INFO,
} from '../data/manualCAT';
import {
  ExternalLink,
  Laptop,
  MapPin,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const CanalesModal: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#174A45] bg-[#E4F2EC] px-2.5 py-1 rounded-[6px] border border-[#DDE5DF]">
            Canales Oficiales Habilitados
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#174A45] mt-2">
            ¿Cómo y Dónde Presentar tu Reclamo Formal?
          </h2>
          <p className="text-xs sm:text-sm text-[#52645D] mt-1">
            Una vez reunida toda la documentación del checklist, podés ingresar tu presentación formal a través de los canales habilitados por la SSSalud.
          </p>
        </div>
      </div>

      {/* Cards: TAD vs Presencial */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* TAD */}
        <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#174A45] bg-[#E4F2EC] px-2.5 py-1 rounded-[6px] border border-[#DDE5DF]">
                100% Digital y Gratuito
              </span>
              <Laptop className="w-5 h-5 text-[#174A45]" />
            </div>

            <h3 className="text-lg font-bold text-[#174A45]">
              Trámites a Distancia (TAD)
            </h3>
            <p className="text-xs text-[#52645D] mt-1 leading-relaxed">
              Permite ingresar denuncias y reclamos desde cualquier punto del país sin concurrir a oficinas.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="bg-[#F7F8F4] p-3 rounded-xl border border-[#DDE5DF]">
                <strong className="text-[#174A45] block font-bold">
                  Trámite TAD 6020 - Reclamos por Afiliación
                </strong>
                <span className="text-[#52645D] block mt-0.5">
                  Falta de alta, rechazo de opción, negativa a incorporar familiares.
                </span>
                <a
                  href={OFFICIAL_LINKS.tad6020}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-[#174A45] hover:text-[#205B53]"
                >
                  Acceder a TAD 6020 <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-[#F7F8F4] p-3 rounded-xl border border-[#DDE5DF]">
                <strong className="text-[#174A45] block font-bold">
                  Trámite TAD 2723 - Reclamos Prestacionales
                </strong>
                <span className="text-[#52645D] block mt-0.5">
                  Falta de medicamentos, prótesis, turnos médicos, tratamientos, discapacidad.
                </span>
                <a
                  href={OFFICIAL_LINKS.tad2723}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-[#174A45] hover:text-[#205B53]"
                >
                  Acceder a TAD 2723 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Crucial TAD section explanation */}
            <div className="mt-4 bg-[#FFF3D8] border border-[#F3D79B] rounded-xl p-3.5 text-xs text-[#805515]">
              <strong className="flex items-center gap-1 font-bold text-[#805515] mb-1">
                <AlertCircle className="w-4 h-4 text-[#805515]" />
                Regla Operativa TAD (Sección 13.2 y 13.3):
              </strong>
              <p className="text-[#805515] leading-snug">
                En TAD debés completar 3 apartados obligatorios:
              </p>
              <ul className="list-disc list-inside mt-1 text-[#805515] space-y-0.5">
                <li>1. <strong>Datos del Trámite</strong>.</li>
                <li>2. <strong>Presentación de Reclamos de Beneficiarios</strong>.</li>
                <li>
                  3. <strong className="underline">Balance</strong>: Es indispensable adjuntar el Formulario de Reclamo Oficial firmado en este apartado para que el expediente sea admitido.
                </li>
              </ul>
            </div>
          </div>

          <a
            href={OFFICIAL_LINKS.tadInicio}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full h-10 bg-[#174A45] hover:bg-[#205B53] text-white rounded-[9px] text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
          >
            Ingresar al Portal General de TAD
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Presencial con Turno */}
        <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52645D] bg-[#F0F7F3] px-2.5 py-1 rounded-[6px] border border-[#DDE5DF]">
                Atención Personalizada
              </span>
              <MapPin className="w-5 h-5 text-[#174A45]" />
            </div>

            <h3 className="text-lg font-bold text-[#174A45]">
              Sede Central Presencial SSSalud
            </h3>
            <p className="text-xs text-[#52645D] mt-1 leading-relaxed">
              Atención presencial en oficinas de la SSSalud en la Ciudad Autónoma de Buenos Aires.
            </p>

            <div className="mt-4 bg-[#F7F8F4] p-4 rounded-xl border border-[#DDE5DF] space-y-2 text-xs text-[#263D38]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#174A45] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#174A45]">Dirección:</strong>
                  <span>{CAT_INFO.sedePresencial}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#174A45] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#174A45]">Horario de atención:</strong>
                  <span>{CAT_INFO.horarioAtencion}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-[#E4F2EC] border border-[#DDE5DF] rounded-xl p-3.5 text-xs text-[#174A45]">
              <strong className="block font-bold mb-1">
                IMPORTANTE: Turno previo indispensable
              </strong>
              <p className="text-[#263D38] leading-snug">
                Por disposición operativa de la SSSalud, no se reciben reclamos de manera espontánea sin turno previo asignado por el sistema de turnos de la República Argentina.
              </p>
            </div>
          </div>

          <a
            href={OFFICIAL_LINKS.turnos}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full h-10 bg-white hover:bg-[#F0F7F3] text-[#174A45] border border-[#6FA99A] rounded-[9px] text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
          >
            Solicitar Turno Presencial en Mi Argentina
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Enlaces de Consulta y Seguimiento */}
      <div className="bg-white rounded-2xl border border-[#DDE5DF] p-6 shadow-xs">
        <h4 className="text-sm font-bold text-[#174A45] uppercase tracking-wider mb-3">
          Herramientas y Enlaces Oficiales de Consulta
        </h4>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <a
            href={OFFICIAL_LINKS.cav}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F7F8F4] p-3 rounded-xl border border-[#DDE5DF] hover:border-[#6FA99A] hover:bg-[#F0F7F3] transition-all flex items-center justify-between"
          >
            <div>
              <strong className="text-[#174A45] block font-bold">CAV SSSalud</strong>
              <span className="text-[#52645D] text-[11px]">Centro de Atención Virtual</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#174A45]" />
          </a>

          <a
            href={OFFICIAL_LINKS.listadoMonotributo}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F7F8F4] p-3 rounded-xl border border-[#DDE5DF] hover:border-[#6FA99A] hover:bg-[#F0F7F3] transition-all flex items-center justify-between"
          >
            <div>
              <strong className="text-[#174A45] block font-bold">Listado Monotributistas</strong>
              <span className="text-[#52645D] text-[11px]">Agentes que aceptan monotributo</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#174A45]" />
          </a>

          <a
            href={OFFICIAL_LINKS.sssalud}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F7F8F4] p-3 rounded-xl border border-[#DDE5DF] hover:border-[#6FA99A] hover:bg-[#F0F7F3] transition-all flex items-center justify-between"
          >
            <div>
              <strong className="text-[#174A45] block font-bold">Portal SSSalud</strong>
              <span className="text-[#52645D] text-[11px]">Sitio institucional general</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#174A45]" />
          </a>
        </div>
      </div>
    </div>
  );
};
