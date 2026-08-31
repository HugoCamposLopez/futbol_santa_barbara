import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartido = async () => {
      try {
        const docRef = doc(db, "partidos", "partido_actual");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPartido(docSnap.data());
      } catch (error) {
        console.error("Error al traer el partido:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartido();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }}>Cargando partido... ⚽</div>;
  if (!partido) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }}>Sin partido registrado.</div>;

  return (
    <main style={{ maxWidth: '850px', margin: '60px auto 0', padding: '0 20px', textAlign: 'center' }}>
      
      {/* Badge / Tag */}
      <span style={{
        display: 'inline-block',
        padding: '6px 16px',
        borderRadius: '20px',
        background: 'rgba(0, 242, 254, 0.1)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        color: 'var(--neon-cyan)',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '2px',
        marginBottom: '10px'
      }}>
        MATCH OF THE WEEK
      </span>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '30px' }}>
        {partido.fecha}
      </p>

      {/* Tarjeta Cristal/Líquida con la clase del CSS Maestro */}
      <div className="glass-panel" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '40px 30px',
        marginBottom: '40px'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '10px' }}>{partido.equipoLocal}</h2>
          <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--neon-cyan)', textShadow: '0 0 20px rgba(0, 242, 254, 0.4)' }}>
            {partido.golesLocal}
          </span>
        </div>

        <div style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic', color: 'var(--text-muted)', opacity: 0.5 }}>
          VS
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '10px' }}>{partido.equipoVisitante}</h2>
          <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--neon-purple)', textShadow: '0 0 20px rgba(157, 78, 221, 0.4)' }}>
            {partido.golesVisitante}
          </span>
        </div>
      </div>

      <Link to="/estadisticas" style={{
        display: 'inline-block',
        padding: '14px 32px',
        borderRadius: '50px',
        background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
        color: '#000',
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 10px 25px rgba(0, 242, 254, 0.3)'
      }}>
        Ver Tabla y Estadísticas →
      </Link>
    </main>
  );
}