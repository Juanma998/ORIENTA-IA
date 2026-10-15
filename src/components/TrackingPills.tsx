import React from 'react';
import { Check, HelpCircle, Briefcase, User, Layers } from 'lucide-react';
import { DatosMinimos, TramiteCategoria, CondicionLaboral, DestinatarioReclamo } from '../types';

interface TrackingPillsProps {
  datos: DatosMinimos;
  onUpdateDatos: (nuevosDatos: DatosMinimos) => void;
}

export const TrackingPills: React.FC<TrackingPillsProps> = ({ datos, onUpdateDatos }) => {
  const categorias: TramiteCategoria[] = [
    'Afiliación',
    'Problema Prestacional / Cobertura',
    'Opción de Cambio',
    'Discapacidad',
    'Unificación de Aportes',
  ];

  const condiciones: CondicionLaboral[] = [
    'Relación de dependencia',
    'Monotributo',
    'Monotributo Social',
    'Casas particulares / Servicio doméstico',
    'Jubilado / Pensionado',
    'Seguro de desempleo',
    'Usuario directo de Prepaga / Adherente',
  ];

  const destinatarios: DestinatarioReclamo[] = [
    'Titular',
    'Familiar (Cónyuge / Conviviente)',
    'Hijo/a menor de 21 años',
    'Hijo/a estudiante (21 a 25 años)',
    'Persona con CUD (Discapacidad)',
  ];

  const completos = Boolean(datos.categoria && datos.condicionLaboral && datos.destinatario);

  return (
    <div className="bg-white border-b border-[#DDE5DF] px-4 py-2.5 sm:px-6 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#52645D]">
            Datos Mínimos del Caso:
          </span>
          {completos ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold bg-[#E4F2EC] text-[#174A45] px-2.5 py-0.5 rounded-full border border-[#DDE5DF]">
              <Check className="w-3.5 h-3.5 text-[#174A45]" /> Datos completos
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold bg-[#FFF3D8] text-[#805515] px-2.5 py-0.5 rounded-full border border-[#F3D79B]">
              <HelpCircle className="w-3.5 h-3.5 text-[#805515]" /> Relevando información
            </span>
          )}
        </div>

        {/* 3 Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* 1. Categoría */}
          <div className="flex items-center gap-1.5 bg-[#F0F7F3] border border-[#DDE5DF] rounded-[9px] px-2.5 py-1 focus-within:border-[#174A45] focus-within:ring-1 focus-within:ring-[#174A45] transition-all">
            <Layers className="w-3.5 h-3.5 text-[#174A45]" />
            <span className="text-[#52645D] font-medium">Trámite:</span>
            <select
              value={datos.categoria || ''}
              onChange={(e) =>
                onUpdateDatos({
                  ...datos,
                  categoria: (e.target.value as TramiteCategoria) || null,
                })
              }
              aria-label="Seleccionar categoría de trámite"
              className="bg-transparent font-semibold text-[#263D38] focus:outline-none cursor-pointer pr-1"
            >
              <option value="">Pendiente...</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Condición Laboral */}
          <div className="flex items-center gap-1.5 bg-[#F0F7F3] border border-[#DDE5DF] rounded-[9px] px-2.5 py-1 focus-within:border-[#174A45] focus-within:ring-1 focus-within:ring-[#174A45] transition-all">
            <Briefcase className="w-3.5 h-3.5 text-[#174A45]" />
            <span className="text-[#52645D] font-medium">Condición:</span>
            <select
              value={datos.condicionLaboral || ''}
              onChange={(e) =>
                onUpdateDatos({
                  ...datos,
                  condicionLaboral: (e.target.value as CondicionLaboral) || null,
                })
              }
              aria-label="Seleccionar condición laboral"
              className="bg-transparent font-semibold text-[#263D38] focus:outline-none cursor-pointer pr-1 max-w-[160px] truncate"
            >
              <option value="">Pendiente...</option>
              {condiciones.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Destinatario */}
          <div className="flex items-center gap-1.5 bg-[#F0F7F3] border border-[#DDE5DF] rounded-[9px] px-2.5 py-1 focus-within:border-[#174A45] focus-within:ring-1 focus-within:ring-[#174A45] transition-all">
            <User className="w-3.5 h-3.5 text-[#174A45]" />
            <span className="text-[#52645D] font-medium">Beneficiario:</span>
            <select
              value={datos.destinatario || ''}
              onChange={(e) =>
                onUpdateDatos({
                  ...datos,
                  destinatario: (e.target.value as DestinatarioReclamo) || null,
                })
              }
              aria-label="Seleccionar destinatario o beneficiario"
              className="bg-transparent font-semibold text-[#263D38] focus:outline-none cursor-pointer pr-1 max-w-[150px] truncate"
            >
              <option value="">Pendiente...</option>
              {destinatarios.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
