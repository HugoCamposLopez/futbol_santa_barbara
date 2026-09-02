import { Link } from 'react-router-dom';
import jugadores from '../data/jugadores.json';

export default function Equipos() {
  // Filtramos los jugadores por su atributo "equipo"
  // Ajusta la comparación ("Azules" / "Rojos") según cómo los nombraste exactamente en el JSON
  const azules = jugadores.filter(
    (j) => j.equipo.toLowerCase() === 'azules'
  );
  const rojos = jugadores.filter(
    (j) => j.equipo.toLowerCase() === 'rojos'
  );

  return (
    <main className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🛡️ Plantillas de la Liga</h1>

      {/* SECCIÓN AZULES */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ 
          color: 'var(--neon-cyan)', 
          borderBottom: '1px solid rgba(0, 242, 254, 0.2)', 
          paddingBottom: '10px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🔵 Equipo Azul ({azules.length})
        </h2>

        <div className="grid-2">
          {azules.map((jugador) => (
            <Link to={`/jugadores/${jugador.id}`} key={jugador.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={jugador.fotoUrl} alt={jugador.nombre} className="avatar" />
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{jugador.nombre} #{jugador.dorsal}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{jugador.posicion}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIÓN ROJOS */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ 
          color: 'var(--neon-pink)', 
          borderBottom: '1px solid rgba(247, 37, 133, 0.2)', 
          paddingBottom: '10px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🔴 Equipo Rojo ({rojos.length})
        </h2>

        <div className="grid-2">
          {rojos.map((jugador) => (
            <Link to={`/jugadores/${jugador.id}`} key={jugador.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={jugador.fotoUrl} alt={jugador.nombre} className="avatar" style={{ borderColor: 'rgba(247, 37, 133, 0.3)' }} />
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{jugador.nombre} #{jugador.dorsal}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{jugador.posicion}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}