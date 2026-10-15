export type TramiteCategoria =
  | 'Afiliación'
  | 'Problema Prestacional / Cobertura'
  | 'Opción de Cambio'
  | 'Discapacidad'
  | 'Unificación de Aportes';

export type CondicionLaboral =
  | 'Relación de dependencia'
  | 'Monotributo'
  | 'Monotributo Social'
  | 'Casas particulares / Servicio doméstico'
  | 'Jubilado / Pensionado'
  | 'Seguro de desempleo'
  | 'Usuario directo de Prepaga / Adherente';

export type DestinatarioReclamo =
  | 'Titular'
  | 'Familiar (Cónyuge / Conviviente)'
  | 'Hijo/a menor de 21 años'
  | 'Hijo/a estudiante (21 a 25 años)'
  | 'Persona con CUD (Discapacidad)';

export interface DatosMinimos {
  categoria: TramiteCategoria | null;
  condicionLaboral: CondicionLaboral | null;
  destinatario: DestinatarioReclamo | null;
  subtipo?: string;
  entidadSalud?: string;
}

export interface ChecklistItem {
  id: string;
  texto: string;
  detalle?: string;
  obligatorio: boolean;
  seccion: 'general' | 'medica' | 'laboral' | 'canal';
  checked?: boolean;
}

export interface ChecklistFinal {
  id: string;
  fecha: string;
  categoria: TramiteCategoria;
  condicionLaboral: CondicionLaboral;
  destinatario: DestinatarioReclamo;
  docGeneral: ChecklistItem[];
  docMedica: ChecklistItem[];
  docLaboral: ChecklistItem[];
  canalPresentacion: {
    nombre: string;
    tadCodigo?: string;
    tadUrl?: string;
    presencialDireccion: string;
    presencialHorario: string;
    turnosUrl: string;
    instruccionesTad: string[];
    aclaracionEspecial?: string;
  };
  criteriosAplicables: string[];
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  checklist?: ChecklistFinal;
  quickReplies?: string[];
  isThinking?: boolean;
}
