import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <main className="container" style={{ maxWidth: '600px' }}>
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--neon-cyan)', margin: 0 }}>⚙️ Panel de Control</h2>
          <button 
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--text-muted)',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Conectado a Firestore</p>

        {/* Formulario de actualización de marcador */}
        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Goles Local</label>
            <input type="number" className="liquid-input" defaultValue={0} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Goles Visitante</label>
            <input type="number" className="liquid-input" defaultValue={0} />
          </div>
        </div>

        <button className="liquid-btn" style={{ width: '100%', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
          Actualizar Marcador 🚀
        </button>
      </div>
    </main>
  );
}