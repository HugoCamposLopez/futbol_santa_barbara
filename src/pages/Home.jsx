import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

export default function Home() {
  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUltimoPartido = async () => {
      try {
        const q = query(collection(db, "partidos"), orderBy("jornada", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPartido({ id: doc.id, ...doc.data() });
        }
      } catch (error) {
        console.error("Error al obtener el último partido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUltimoPartido();
  }, []);

  const posAzul = partido?.posesion?.azules || 50;
  const posRojo = partido?.posesion?.rojos || 50;

  return (
    <main className="container" style={{ width: '100%', marginTop: '30px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* 1. HERO BANNER HORIZONTAL (~500px Height) */}
        <section
          className="glass-panel"
          style={{
            height: '500px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '40px'
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Cargando el partido estelar... ⚽
            </div>
          ) : partido ? (
            <>
              {/* Header Superior del Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: partido.enJuego ? 'rgba(247, 37, 133, 0.2)' : 'rgba(0, 242, 254, 0.15)',
                  border: `1px solid ${partido.enJuego ? 'var(--neon-pink)' : 'var(--neon-cyan)'}`,
                  color: partido.enJuego ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '1.5px'
                }}>
                  {partido.enJuego ? '🔴 EN VIVO' : `JORNADA ${partido.jornada}`}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                  {partido.fecha}
                </span>
              </div>

              {/* Marcador Central */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h2 style={{ color: 'var(--neon-cyan)', fontSize: '2.2rem', margin: 0, textShadow: '0 0 15px rgba(0, 242, 254, 0.5)' }}>AZULES</h2>
                  <span style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--neon-cyan)', textShadow: '0 0 25px rgba(0, 242, 254, 0.6)' }}>
                    {partido.resultado?.golesAzules ?? 0}
                  </span>
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 900, opacity: 0.3, fontStyle: 'italic' }}>VS</div>

                <div style={{ flex: 1, textAlign: 'center' }}>
                  <h2 style={{ color: 'var(--neon-pink)', fontSize: '2.2rem', margin: 0, textShadow: '0 0 15px rgba(247, 37, 133, 0.5)' }}>ROJOS</h2>
                  <span style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--neon-pink)', textShadow: '0 0 25px rgba(247, 37, 133, 0.6)' }}>
                    {partido.resultado?.golesRojos ?? 0}
                  </span>
                </div>
              </div>

              {/* Cancha Iluminada por Posesión integrándose al Hero */}
              <div
                className="pitch-container"
                style={{
                  height: '110px',
                  zIndex: 2,
                  background: `linear-gradient(90deg, 
                    rgba(0, 242, 254, 0.25) 0%, 
                    rgba(0, 242, 254, 0.25) ${posAzul}%, 
                    rgba(247, 37, 133, 0.25) ${posAzul}%, 
                    rgba(247, 37, 133, 0.25) 100%)`
                }}
              >
                <div className="pitch-box left" style={{ height: '55px' }}></div>
                <div className="pitch-half-line">
                  <div className="pitch-center-circle" style={{ width: '45px', height: '45px' }}></div>
                </div>
                <div className="pitch-box right" style={{ height: '55px' }}></div>
              </div>

              {/* Footer del Banner con Posesión */}
              <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--neon-cyan)' }}>POSESIÓN: {posAzul}%</span>
                <span style={{ color: 'var(--neon-pink)' }}>POSESIÓN: {posRojo}%</span>
              </div>
              <Link to="/historial" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '15px', zIndex: 2 }}>
                  <h4 style={{ color: 'var(--neon-cyan)', textDecoration: 'underline', cursor: 'pointer' }}>
                    Ver más...
                  </h4>
                </div>
              </Link>
            </>
          ) : (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              No hay partidos registrados aún.
            </div>
          )}
        </section>

        {/* 2. TARJETAS / ACCESOS DIRECTOS INFERIORES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>

          {/* Card: Tabla de Goles */}
          <Link to="/estadisticas" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="glass-panel"
              style={{
                padding: '25px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
              <h3 style={{ color: 'var(--neon-cyan)', margin: '0 0 8px 0' }}>Tabla de Goleo</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Consulta el top de goleadores y estadísticas de la temporada.
              </p>
            </div>
          </Link>

          {/* Card: Plantillas / Equipos */}
          <Link to="/equipos" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="glass-panel"
              style={{
                padding: '25px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️</div>
              <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>Equipos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Explora los planteles completos divididos por Azules y Rojos.
              </p>
            </div>
          </Link>

          {/* Card: Historial de Partidos */}
          <Link to="/historial" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="glass-panel"
              style={{
                padding: '25px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏟️</div>
              <h3 style={{ color: 'var(--neon-pink)', margin: '0 0 8px 0' }}>Historial</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Revisa los resultados, partidos anteriores y las canchas sintéticas.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}