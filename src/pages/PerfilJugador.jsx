import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import jugadoresJSON from '../data/jugadores.json';

export default function PerfilJugador() {
  const { id } = useParams();
  
  // Buscar info estática del JSON
  const jugadorBase = jugadoresJSON.find((j) => j.id === id);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRef = doc(db, "estadisticas_jugadores", id);
        console.log(docRef, 'docRef')
        const docSnap = await getDoc(docRef);
        console.log(docSnap, 'docsnap')
        if (docSnap.exists()) {
          setStats(docSnap.data());
        } else {
          // Si no hay datos en Firebase aún, usamos 0 por defecto
          setStats({ goles: 0 });
        }
      } catch (error) {
        console.error("Error al traer stats del jugador:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jugadorBase) fetchStats();
  }, [id, jugadorBase]);

  if (!jugadorBase) return <Navigate to="/equipos" />;

  return (
    <main className="container">
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <img src={jugadorBase.fotoUrl} alt={jugadorBase.nombre} className="avatar" style={{ width: '120px', height: '120px' }} />
        
        <h1 style={{ color: 'var(--neon-cyan)', margin: '15px 0 5px' }}>{jugadorBase.nombre} #{jugadorBase.dorsal}</h1>
        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>{jugadorBase.equipo}</h3>
        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>{jugadorBase.posicion}</p>
        
        {loading ? (
          <p style={{ marginTop: '30px', color: 'var(--text-muted)' }}>Cargando estadísticas...</p>
        ) : (
          <div className="grid-1" style={{ marginTop: '30px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>{stats.goles}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>GOLES</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}