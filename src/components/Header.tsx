import React from 'react';
import {
  ShieldCheck,
  FileText,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { OrientaLogo } from './OrientaLogo';

interface HeaderProps {
  activeTab: 'chat' | 'checklist' | 'herramientas-ia' | 'canales';
  setActiveTab: (tab: 'chat' | 'checklist' | 'herramientas-ia' | 'canales') => void;
  hasChecklist: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasChecklist,
}) => {
  const navItems = [
    {
      id: 'chat' as const,
      label: 'Asistente Ciudadano',
      icon: HelpCircle,
    },
    {
      id: 'checklist' as const,
      label: 'Checklist Requisitos',
      icon: FileText,
      badge: hasChecklist,
    },
    {
      id: 'herramientas-ia' as const,
      label: 'Herramientas IA',
      icon: Sparkles,
    },
    {
      id: 'canales' as const,
      label: 'Canales TAD',
      icon: ShieldCheck,
    },
  ];

  return (
    <header className="bg-white border-b border-[#DDE5DF] sticky top-0 z-40">
      {/* Top flag bar oficial sutil */}
      <div className="h-1 w-full bg-gradient-to-r from-[#75AADB] via-white to-[#75AADB]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
          {/* Brand & SSSalud identification */}
          <div className="flex items-center justify-between w-full xl:w-auto gap-4">
            <div className="flex items-center gap-3.5">
              <OrientaLogo size="md" />
              <div>
                <div className="flex items-center gap-1.5 leading-tight mb-0.5">
                  <span className="text-[12px] uppercase tracking-wider text-[#52645D] font-semibold">
                    República Argentina
                  </span>
                  <span className="text-[#52645D]/60 text-xs">•</span>
                  <span className="text-[12px] text-[#52645D] font-medium">
                    Superintendencia de Servicios de Salud
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <h1
                    className="text-[27px] font-extrabold tracking-[-0.8px] leading-tight text-[#174A45]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Orienta IA
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-[#E4F2EC] text-[#174A45] text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-[#DDE5DF]">
                    <Sparkles className="w-3 h-3 text-[#174A45]" />
                    Asistente Oficial
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 max-w-full overflow-x-auto pb-1 xl:pb-0">
            <nav className="flex items-center gap-1" aria-label="Navegación principal">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`h-10 px-3.5 rounded-[9px] text-[14px] font-semibold flex items-center gap-2 transition-colors duration-200 whitespace-nowrap cursor-pointer relative select-none ${
                      isActive
                        ? 'bg-[#174A45] text-white shadow-xs'
                        : 'bg-transparent text-[#174A45] hover:bg-[#F0F7F3]'
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 ${
                        isActive ? 'text-white' : 'text-[#174A45]'
                      }`}
                      strokeWidth={1.9}
                    />
                    <span>{item.label}</span>

                    {item.badge && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#174A45] ring-2 ring-white absolute top-2 right-2 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
