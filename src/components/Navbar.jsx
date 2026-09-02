import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header-sticky">
      <nav className="navbar-container glass-panel">
        
        {/* LOGO IZQUIERDA */}
        <Link to="/" onClick={closeMenu} className="navbar-logo">
          <span style={{ fontSize: '1.2rem' }}>⚽</span>
          <span className="navbar-title">SANTA BÁRBARA</span>
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="desktop-menu">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Inicio</Link>
          <Link to="/estadisticas" className={`nav-link ${isActive('/estadisticas') ? 'active' : ''}`}>Goles</Link>
          <Link to="/equipos" className={`nav-link ${isActive('/equipos') ? 'active' : ''}`}>Equipos</Link>
          <Link to="/historial" className={`nav-link ${isActive('/historial') ? 'active' : ''}`}>Historial</Link>
          <Link to="/admin" className="btn-admin">🔒 Admin</Link>
        </div>

        {/* BOTÓN HAMBURGUESA / X (CON SVG PARA EVITAR DISPAREJOS) */}
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Menú"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              className={`line line-top ${isOpen ? 'open' : ''}`} 
              d="M 2 4 L 18 4" 
              stroke="var(--neon-cyan)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              className={`line line-mid ${isOpen ? 'open' : ''}`} 
              d="M 2 10 L 18 10" 
              stroke="var(--neon-cyan)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              className={`line line-bot ${isOpen ? 'open' : ''}`} 
              d="M 2 16 L 18 16" 
              stroke="var(--neon-cyan)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          </svg>
        </button>

      </nav>

      {/* MENÚ DESPLEGABLE MOBILE (FUERA DEL NAV PARA EVITAR RECORTES) */}
      <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
        <Link to="/" onClick={closeMenu} className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
          🏠 Inicio
        </Link>
        <Link to="/estadisticas" onClick={closeMenu} className={`mobile-nav-link ${isActive('/estadisticas') ? 'active' : ''}`}>
          📊 Goles
        </Link>
        <Link to="/equipos" onClick={closeMenu} className={`mobile-nav-link ${isActive('/equipos') ? 'active' : ''}`}>
          🛡️ Equipos
        </Link>
        <Link to="/historial" onClick={closeMenu} className={`mobile-nav-link ${isActive('/historial') ? 'active' : ''}`}>
          🏟️ Historial
        </Link>
        <Link to="/admin" onClick={closeMenu} className="mobile-nav-link mobile-admin">
          🔒 Panel Admin
        </Link>
      </div>
    </header>
  );
}