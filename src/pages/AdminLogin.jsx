import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Si el login es exitoso, redirecciona al dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o usuario no encontrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: '100%', marginTop: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <div className="glass-panel">
          <h2 style={{ textAlign: 'center', color: 'var(--neon-purple)', marginBottom: '10px' }}>
            🔒 Área Restringida
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '25px', fontSize: '0.9rem' }}>
            Ingresa con tu cuenta de administrador.
          </p>

          {error && (
            <div style={{
              background: 'rgba(247, 37, 133, 0.15)',
              border: '1px solid var(--neon-pink)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="liquid-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="liquid-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="liquid-btn"
              disabled={loading}
              style={{
                width: '100%',
                height: '45px',
                border: 'none',
                backgroundColor: 'var(--neon-purple)',
                color: '#fff',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}