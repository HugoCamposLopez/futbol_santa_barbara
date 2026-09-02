export default function LogoAnime() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradiente Cyan Neón para las líneas de velocidad */}
          <linearGradient id="animeTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--neon-pink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--neon-purple)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="1" />
          </linearGradient>

          {/* Filtro Glow para efecto neón */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ESTELAS / LÍNEAS DE VELOCIDAD TIPO ANIME (EFECTO GIRO Y AIRE) */}
        <path
          d="M 10 85 C 20 75, 35 70, 50 65"
          stroke="url(#animeTrail)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 5 60 C 25 50, 45 40, 65 30"
          stroke="url(#animeTrail)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />
        <path
          d="M 25 95 C 45 80, 60 60, 75 35"
          stroke="url(#animeTrail)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* BALÓN EN EL AIRE CON ROTACIÓN (GRUPO ANIMADO) */}
        <g filter="url(#neonGlow)" style={{ transformOrigin: '65px 35px', animation: 'spinBall 2s linear infinite' }}>
          {/* Circulo base del balón */}
          <circle cx="65" cy="35" r="22" stroke="var(--neon-cyan)" strokeWidth="3" fill="#0f172a" />
          
          {/* Cascos/Líneas dinámicas del balón (Pentágono estilizado en perspectiva) */}
          <polygon points="65,23 74,29 70,39 60,39 56,29" fill="var(--neon-cyan)" opacity="0.9" />
          <line x1="65" y1="23" x2="65" y2="13" stroke="var(--neon-cyan)" strokeWidth="2" />
          <line x1="74" y1="29" x2="84" y2="26" stroke="var(--neon-cyan)" strokeWidth="2" />
          <line x1="70" y1="39" x2="78" y2="47" stroke="var(--neon-cyan)" strokeWidth="2" />
          <line x1="60" y1="39" x2="52" y2="47" stroke="var(--neon-cyan)" strokeWidth="2" />
          <line x1="56" y1="29" x2="46" y2="26" stroke="var(--neon-cyan)" strokeWidth="2" />
        </g>
      </svg>

      {/* CSS Inline para la animación de giro continuo */}
      <style>{`
        @keyframes spinBall {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}