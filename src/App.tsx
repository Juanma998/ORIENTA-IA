/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReglaDeOroBanner } from './components/ReglaDeOroBanner';
import { TrackingPills } from './components/TrackingPills';
import { ChatInterface } from './components/ChatInterface';
import { ChecklistView } from './components/ChecklistView';
import { CanalesModal } from './components/CanalesModal';
import { AiToolsModal } from './components/AiToolsModal';
import { DatosMinimos, ChecklistFinal } from './types';
import { generarChecklistOficial } from './data/manualCAT';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'chat' | 'checklist' | 'herramientas-ia' | 'canales'
  >('chat');

  const [datos, setDatos] = useState<DatosMinimos>({
    categoria: null,
    condicionLaboral: null,
    destinatario: null,
  });

  const [checklist, setChecklist] = useState<ChecklistFinal | null>(null);

  // If user updates tracking pills directly and all 3 are set, automatically update checklist
  const handleUpdateDatos = (nuevosDatos: DatosMinimos) => {
    setDatos(nuevosDatos);
    if (nuevosDatos.categoria && nuevosDatos.condicionLaboral && nuevosDatos.destinatario) {
      const nuevoChk = generarChecklistOficial(
        nuevosDatos.categoria,
        nuevosDatos.condicionLaboral,
        nuevosDatos.destinatario
      );
      setChecklist(nuevoChk);
    }
  };

  const handleChecklistGenerado = (chk: ChecklistFinal) => {
    setChecklist(chk);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#263D38] flex flex-col font-sans relative antialiased">
      {/* Official SSSalud Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasChecklist={checklist !== null}
      />

      {/* Regla de Oro institucional */}
      <div className="no-print">
        <ReglaDeOroBanner />
      </div>

      {/* Minimum data point tracking pills */}
      <div className="no-print">
        <TrackingPills datos={datos} onUpdateDatos={handleUpdateDatos} />
      </div>

      {/* Main Content Body */}
      <main className="flex-1 py-2 sm:py-4">
        {activeTab === 'chat' && (
          <ChatInterface
            datos={datos}
            onUpdateDatos={handleUpdateDatos}
            onChecklistGenerado={handleChecklistGenerado}
            onVerChecklist={() => setActiveTab('checklist')}
            onAbrirHerramientasIa={() => setActiveTab('herramientas-ia')}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistView
            checklist={checklist}
            onCrearNuevo={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'herramientas-ia' && (
          <AiToolsModal categoriaActual={datos.categoria} />
        )}

        {activeTab === 'canales' && <CanalesModal />}
      </main>

      {/* Official Argentine Footer */}
      <footer className="no-print bg-[#174A45] text-[#E4F2EC] py-6 border-t border-[#174A45]/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-7 h-7 rounded-lg bg-[#E4F2EC] text-[#174A45] flex items-center justify-center font-bold text-xs border border-white/40">
              AR
            </div>
            <div>
              <p className="font-semibold text-white">
                Superintendencia de Servicios de Salud (SSSalud)
              </p>
              <p className="text-[12px] text-[#E4F2EC]/80">
                Ministerio de Salud • Presidencia de la Nación • Bartolomé Mitre 434, CABA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#E4F2EC]/80 font-medium">
              Canal de Orientación y Requisitos Previos (CAT)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
