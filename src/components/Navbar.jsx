import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '15px', background: '#1a1a1a', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff' }}>Inicio</Link>
      <Link to="/estadisticas" style={{ color: '#fff' }}>Estadísticas</Link>
      <Link to="/equipos" style={{ color: '#fff' }}>Equipos</Link>
      <Link to="/jugadores/hugo-frontend" style={{ color: '#fff' }}>Perfil Demo (Hugo)</Link>
      <Link to="/admin" style={{ color: '#ffcc00', marginLeft: 'auto' }}>Admin</Link>
    </nav>
  );
}