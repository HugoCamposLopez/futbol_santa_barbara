import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Historial() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const q = query(collection(db, "partidos"), orderBy("jornada", "desc"));
        const querySnapshot = await getDocs(q);
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setPartidos(docs);
      } catch (error) {
        console.error("Error al traer historial de partidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '80px', color: 'var(--text-muted)' }}>Cargando cancha e historial... ⚽</div>;
  }

  return (
    <main className="container" style={{ width: '100%', marginTop: '40px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🏟️ Historial de Partidos</h1>

        {partidos.map((p) => {
          const posAzul = p.posesion?.azules || 50;
          const posRojo = p.posesion?.rojos || 50;

          return (
            <div key={p.id} className="glass-panel" style={{ marginBottom: '40px', padding: '30px' }}>

              {/* Header del partido */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>JORNADA {p.jornada}</span>
                <span>{p.fecha}</span>
              </div>

              {/* Marcador Principal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h2 style={{ color: 'var(--neon-cyan)', fontSize: '1.8rem' }}>AZULES</h2>
                  <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--neon-cyan)' }}>{p.resultado?.golesAzules}</span>
                </div>

                <div style={{ fontSize: '1.5rem', fontWeight: 900, opacity: 0.3 }}>VS</div>

                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h2 style={{ color: 'var(--neon-pink)', fontSize: '1.8rem' }}>ROJOS</h2>
                  <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--neon-pink)' }}>{p.resultado?.golesRojos}</span>
                </div>
              </div>

              {/* CANCHA SINTÉTICAMENTE PINTADA POR POSESIÓN */}
              <div 
                className="pitch-container"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(0, 242, 254, 0.25) 0%, 
                    rgba(0, 242, 254, 0.25) ${posAzul}%, 
                    rgba(247, 37, 133, 0.25) ${posAzul}%, 
                    rgba(247, 37, 133, 0.25) 100%)`,
                  boxShadow: `0 0 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(0, 242, 254, ${posAzul / 200})`
                }}
              >
                {/* Área izquierda (Azules) */}
                <div className="pitch-box left"></div>

                {/* Línea media cancha */}
                <div className="pitch-half-line">
                  <div className="pitch-center-circle"></div>
                </div>

                {/* Área derecha (Rojos) */}
                <div className="pitch-box right"></div>
              </div>

              {/* ETIQUETAS DE POSESIÓN */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--neon-cyan)' }}>POSESIÓN AZUL: {posAzul}%</span>
                <span style={{ color: 'var(--neon-pink)' }}>POSESIÓN ROJA: {posRojo}%</span>
              </div>

              {/* Métricas secundarias (Tiros, Faltas) */}
              {p.estadisticas && (
                <div className="grid-3" style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{p.estadisticas.tirosPuertaAzules}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Tiros a Puerta</div>
                    <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>{p.estadisticas.tirosPuertaRojos}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{p.estadisticas.faltasAzules}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Faltas</div>
                    <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>{p.estadisticas.faltasRojos}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{p.estadisticas.tarjetasAmarillasAzules}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Amarillas</div>
                    <div style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>{p.estadisticas.tarjetasAmarillasRojos}</div>
                  </div>
                </div>
              )}

              {/* ANOTADORES DEL PARTIDO */}
              {p.goleadores && p.goleadores.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.85rem'
                }}>

                  {/* Lista Goles Azules */}
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>GOLES</div>
                    {p.goleadores
                      .filter((g) => g.equipo.toLowerCase() === 'azules')
                      .map((g, index) => (
                        <div key={index} style={{ color: 'var(--neon-cyan)', marginBottom: '4px', fontWeight: 600 }}>
                          ⚽ {g.nombre}
                        </div>
                      ))}
                  </div>

                  {/* Lista Goles Rojos */}
                  <div style={{ textAlign: 'right', flex: 1 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>GOLES</div>
                    {p.goleadores
                      .filter((g) => g.equipo.toLowerCase() === 'rojos')
                      .map((g, index) => (
                        <div key={index} style={{ color: 'var(--neon-pink)', marginBottom: '4px', fontWeight: 600 }}>
                          {g.nombre} ⚽
                        </div>
                      ))}
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </main>
  );
}