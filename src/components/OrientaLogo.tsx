import React from 'react';

interface OrientaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const OrientaLogo: React.FC<OrientaLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const dimensionMap = {
    sm: { container: 'w-9 h-9', badge: 'w-2.5 h-2.5' },
    md: { container: 'w-12 h-12', badge: 'w-3.5 h-3.5' },
    lg: { container: 'w-16 h-16', badge: 'w-4 h-4' },
    xl: { container: 'w-20 h-20', badge: 'w-5 h-5' },
  };

  const currentDim = dimensionMap[size];

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 group ${className}`}
      title="Orienta IA • Superintendencia de Servicios de Salud • República Argentina"
    >
      {/* 1. Aura con los colores de la bandera argentina (Celeste y Blanco con Sol de Mayo) */}
      <div
        className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#75AADB] via-white via-amber-300 to-[#0084CA] opacity-80 blur-xs transition-all duration-700 animate-spin-slow group-hover:opacity-90"
        style={{ animationDuration: '9s' }}
      />

      {/* 2. Escudo contenedor con las 3 franjas de la Bandera Argentina: Celeste - Blanco - Celeste */}
      <div
        className={`relative ${currentDim.container} rounded-xl shadow-md border-2 border-white overflow-hidden transform transition-all duration-300 group-hover:scale-105 flex items-center justify-center animate-float`}
        style={{ animationDuration: '4s' }}
      >
        {/* SVG Bandera Argentina + Sol de Mayo + Emblema de Salud SSSalud */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Franja Superior Celeste */}
          <rect x="0" y="0" width="100" height="33.3" fill="#75AADB" />
          
          {/* Franja Media Blanca */}
          <rect x="0" y="33.3" width="100" height="33.4" fill="#FFFFFF" />
          
          {/* Franja Inferior Celeste */}
          <rect x="0" y="66.7" width="100" height="33.3" fill="#75AADB" />

          {/* Sutil sombra interna en los bordes para profundidad */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="3"
          />

          {/* Sol de Mayo Argentino en el centro de la bandera */}
          <g
            className="origin-center"
            style={{ animationDuration: '10s' }}
          >
            {/* 16 Rayos rectos dorados del Sol de Mayo */}
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
              (deg, idx) => (
                <line
                  key={`ray-${idx}`}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2={idx % 2 === 0 ? "23" : "27"}
                  stroke="#F6B40E"
                  strokeWidth={idx % 2 === 0 ? "3" : "2"}
                  strokeLinecap="round"
                  transform={`rotate(${deg} 50 50)`}
                />
              )
            )}

            {/* Círculo base dorado del Sol */}
            <circle cx="50" cy="50" r="18" fill="#F6B40E" stroke="#D97706" strokeWidth="1" />
            <circle cx="50" cy="50" r="15" fill="#FDE047" />
          </g>

          {/* Escudo/Cruz de Salud Institucional SSSalud en el corazón del sol */}
          <g className="drop-shadow-sm">
            {/* Cruz Médica de Salud protegida */}
            <path
              d="M46 38 H54 V46 H62 V54 H54 V62 H46 V54 H38 V46 H46 Z"
              fill="#0284C7"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Núcleo de luz blanca empática */}
            <circle cx="50" cy="50" r="2.8" fill="#FFFFFF" />
          </g>

          {/* Reflejo de luz brillante */}
          <path
            d="M5 5 L40 5 L20 95 L5 95 Z"
            fill="url(#flagShine)"
            opacity="0.25"
          />

          <defs>
            <linearGradient id="flagShine" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Reflejo dinámico de brillo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
      </div>
    </div>
  );
};
