import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  // Función helper para marcar el link activo con un glow
  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: '15px',
      zIndex: 100,
      maxWidth: '900px',
      margin: '0 auto 30px',
      padding: '0 15px'
    }}>
      <nav 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between',
          padding: '12px 24px', 
          borderRadius: '50px',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        {/* LOGO / NOMBRE LIGA */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚽</span>
          <span style={{ 
            fontWeight: 800, 
            fontSize: '1.05rem', 
            background: 'linear-gradient(135deg, var(--neon-cyan), #fff)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}>
            SANTA BÁRBARA
          </span>
        </Link>

        {/* ENLACES PRINCIPALES */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'center' }}>
          <Link 
            to="/estadisticas" 
            className={`nav-link ${isActive('/estadisticas') ? 'active' : ''}`}
          >
            Goles
          </Link>
          <Link 
            to="/equipos" 
            className={`nav-link ${isActive('/equipos') ? 'active' : ''}`}
          >
            Equipos
          </Link>
          <Link 
            to="/historial" 
            className={`nav-link ${isActive('/historial') ? 'active' : ''}`}
          >
            Historial
          </Link>
        </div>

        {/* BOTÓN ADMIN RESTRICTED */}
        <Link 
          to="/admin" 
          style={{ 
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--neon-pink)',
            background: 'rgba(247, 37, 133, 0.1)',
            border: '1px solid rgba(247, 37, 133, 0.3)',
            borderRadius: '20px',
            padding: '6px',
            transition: 'all 0.3s ease',
            width: '110px',
          }}
        >
          🔒 Admin
        </Link>
      </nav>
    </header>
  );
}