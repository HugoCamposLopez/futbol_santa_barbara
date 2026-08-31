import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import jugadoresJSON from '../data/jugadores.json';

export default function Estadisticas() {
  const [tablaGoleo, setTablaGoleo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "estadisticas_jugadores"));
        
        const statsMap = {};
        querySnapshot.forEach((doc) => {
          statsMap[doc.id] = doc.data();
        });

        const jugadoresConStats = jugadoresJSON.map((jugador) => {
          const stats = statsMap[jugador.id] || { goles: 0, asistencias: 0, amarillas: 0 };
          return {
            ...jugador,
            goles: stats.goles || 0,
            asistencias: stats.asistencias || 0,
            amarillas: stats.amarillas || 0,
          };
        });

        jugadoresConStats.sort((a, b) => b.goles - a.goles);
        setTablaGoleo(jugadoresConStats);
      } catch (error) {
        console.error("Error al obtener estadisticas_jugadores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  return (
    <main className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 Tabla de Goleo</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
          Consultando estadísticas en tiempo real... ⚽
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '10px 20px', overflowX: 'auto' }}>
          <table className="liquid-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th>Goles</th>
              </tr>
            </thead>
            <tbody>
              {tablaGoleo.map((jugador, index) => (
                <tr 
                  key={jugador.id}
                  onClick={() => navigate(`/jugadores/${jugador.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    {index + 1}
                  </td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={jugador.fotoUrl} 
                      alt={jugador.nombre} 
                      style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <span style={{ fontWeight: 600 }}>{jugador.nombre}</span>
                  </td>
                  <td style={{ 
                    color: jugador.equipo.toLowerCase() === 'azules' ? 'var(--neon-cyan)' : 'var(--neon-pink)',
                    fontWeight: 500
                  }}>
                    {jugador.equipo}
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--neon-cyan)', fontSize: '1.2rem' }}>
                    {jugador.goles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}