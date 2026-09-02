import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import jugadoresData from '../data/jugadores.json';
export default function AdminDashboard() {
  // Estado para Sección 1: Jugadores
  const [jugadores, setJugadores] = useState([]);
  const [golesNuevos, setGolesNuevos] = useState({}); // Mapa de { idJugador: cantidadAAgregar }
  const [loadingJugadores, setLoadingJugadores] = useState(true);
  const [goleadoresList, setGoleadoresList] = useState([]); // Array de objetos: [{ id, nombre, equipo, goles }]
  const [selectedJugadorId, setSelectedJugadorId] = useState('');
  const [golesPillInput, setGolesPillInput] = useState(1);
  const [equipoPillInput, setEquipoPillInput] = useState('azules');
  // Estado para Sección 2: Nuevo Partido
  const [jornada, setJornada] = useState('');
  const [fecha, setFecha] = useState('');
  const [golesAzules, setGolesAzules] = useState(0);
  const [golesRojos, setGolesRojos] = useState(0);
  const [posAzul, setPosAzul] = useState(50);
  const [posRojo, setPosRojo] = useState(50);
  const [savingPartido, setSavingPartido] = useState(false);
  const fetchJugadores = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'estadisticas_jugadores'));
      const docs = [];
      snapshot.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.goles || 0) - (a.goles || 0)); // Ordenar por goles descendente
      setJugadores(docs);
    } catch (error) {
      console.error('Error al cargar jugadores:', error);
    } finally {
      setLoadingJugadores(false);
    }
  };
  // Cargar lista de jugadores desde 'estadisticas_jugadores'
  useEffect(() => {
    fetchJugadores();
  }, []);



  // Manejar el cambio del input de suma de goles por jugador
  const handleInputGolChange = (id, valor) => {
    const num = parseInt(valor, 10);
    setGolesNuevos({
      ...golesNuevos,
      [id]: isNaN(num) ? 0 : num
    });
  };

  // Guardar/Sumar goles a Firestore
  const handleGuardarGol = async (jugador) => {
    const agregar = golesNuevos[jugador.id] || 0;
    if (agregar === 0) return;

    const golesActuales = jugador.goles || 0;
    const nuevoTotal = golesActuales + agregar;

    try {
      const ref = doc(db, 'estadisticas_jugadores', jugador.id);
      await updateDoc(ref, { goles: nuevoTotal });

      // Limpiar input local y actualizar lista
      setGolesNuevos({ ...golesNuevos, [jugador.id]: 0 });
      fetchJugadores();
    } catch (error) {
      console.error('Error al actualizar goles:', error);
    }
  };

  // Manejar la sincronización de Posesión (suma 100%)
  const handlePosesionAzul = (val) => {
    const azul = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setPosAzul(azul);
    setPosRojo(100 - azul);
  };

  const handleAddGoleadorPill = () => {
    if (!selectedJugadorId) return;

    // Buscar info del jugador en jugadores.json
    const info = jugadoresData.find(j => j.id === selectedJugadorId);
    const nombre = info ? info.nombre : selectedJugadorId;

    // Si ya existe en la lista de pills, actualizamos sus goles
    const indexExistente = goleadoresList.findIndex(
      g => g.id === selectedJugadorId && g.equipo === equipoPillInput
    );
    if (indexExistente >= 0) {
      const nuevaLista = [...goleadoresList];
      nuevaLista[indexExistente].goles += Number(golesPillInput);
      setGoleadoresList(nuevaLista);
    } else {
      // Agregar nueva pill
      setGoleadoresList([
        ...goleadoresList,
        {
          id: selectedJugadorId,
          nombre,
          equipo: equipoPillInput,
          goles: Number(golesPillInput)
        }
      ]);
    }

    // Reset inputs
    setSelectedJugadorId('');
    setGolesPillInput(1);
  };

  const handleRemovePill = (id) => {
    setGoleadoresList(goleadoresList.filter(g => g.id !== id));
  };
  // Guardar nuevo partido en colección 'partidos'
  const handleCrearPartido = async (e) => {
    e.preventDefault();
    if (!jornada || !fecha) return alert('Completa jornada y fecha');

    setSavingPartido(true);

    const goleadoresFinales = [];
    goleadoresList.forEach(g => {
      for (let i = 0; i < g.goles; i++) {
        goleadoresFinales.push({ nombre: g.nombre, equipo: g.equipo });
      }
    });

    try {
      // A) Guardar el partido en la colección 'partidos'
      await addDoc(collection(db, 'partidos'), {
        jornada: Number(jornada),
        fecha,
        resultado: {
          golesAzules: Number(golesAzules),
          golesRojos: Number(golesRojos)
        },
        posesion: {
          azules: Number(posAzul),
          rojos: Number(posRojo)
        },
        goleadores: goleadoresFinales
      });

      for (const pill of goleadoresList) {
        try {
          const jugRef = doc(db, 'estadisticas_jugadores', pill.id);
          await updateDoc(jugRef, {
            goles: increment(pill.goles)
          });
        } catch (err) {
          console.error(`Error al actualizar goles del jugador ${pill.id}:`, err);
        }
      }
      // C) Recargar la tabla de la Sección 1 para ver los nuevos totales al instante
      await fetchJugadores();

      alert('¡Partido y estadísticas de goles actualizados con éxito!');
      setJornada('');
      setFecha('');
      setGolesAzules(0);
      setGolesRojos(0);
      setGoleadoresList([]);
    } catch (error) {
      console.error('Error al crear partido:', error);
    } finally {
      setSavingPartido(false);
    }
  };
  const handleJugadorSelect = (id) => {
    setSelectedJugadorId(id);
    const info = jugadoresData.find(j => j.id === id);
    if (info && info.equipo) {
      setEquipoPillInput(info.equipo.toLowerCase());
    }
  };
  return (
    <main className="container" style={{ maxWidth: '800px', margin: '30px auto 60px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>⚙️ Panel de Administración</h1>

      {/* ==========================================
    SECCIÓN 1: ACTUALIZACIÓN RÁPIDA DE GOLES
   ========================================== */}
      <section className="glass-panel" style={{ padding: '25px', marginBottom: '40px' }}>
        <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '20px', fontSize: '1.4rem' }}>
          ⚽ 1. Tabla de Goleadores
        </h2>

        {loadingJugadores ? (
          <div style={{ color: 'var(--text-muted)' }}>Cargando plantilla...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jugadores.map((j) => {
              // Hacemos MATCH por ID con el jugadores.json
              const jugadorInfo = jugadoresData.find((item) => item.id === j.id);

              // Extraemos el nombre del JSON (o fallback si no hace match)
              const nombreJugador = jugadorInfo ? jugadorInfo.nombre : (j.nombre || j.id);
              const equipoJugador = jugadorInfo ? jugadorInfo.equipo : '';

              const golesActuales = j.goles ?? 0;
              const sumar = golesNuevos[j.id] || 0;
              const totalProyectado = golesActuales + sumar;

              return (
                <div
                  key={j.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Nombre extraído del JSON y Goles de Firebase */}
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                      {nombreJugador}
                      {equipoJugador && (
                        <span style={{
                          fontSize: '0.75rem',
                          marginLeft: '8px',
                          color: equipoJugador.toLowerCase() === 'azules' ? 'var(--neon-cyan)' : 'var(--neon-pink)',
                          opacity: 0.8
                        }}>
                          • {equipoJugador}
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem', marginTop: '2px' }}>
                      {golesActuales} goles en Firestore
                    </div>
                  </div>

                  {/* Controles por ID individual */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="number"
                      min="0"
                      placeholder="+0"
                      value={golesNuevos[j.id] || ''}
                      onChange={(e) => handleInputGolChange(j.id, e.target.value)}
                      style={{
                        width: '65px',
                        padding: '8px',
                        borderRadius: '10px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(0,0,0,0.4)',
                        color: '#fff',
                        textAlign: 'center',
                        fontWeight: 700
                      }}
                    />

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '75px', textAlign: 'center' }}>
                      Total: <strong style={{ color: 'var(--neon-cyan)', fontSize: '0.95rem' }}>{totalProyectado}</strong>
                    </div>

                    <button
                      onClick={() => handleGuardarGol(j)}
                      disabled={sumar === 0}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        background: sumar > 0 ? 'linear-gradient(135deg, var(--neon-cyan), #00c6ff)' : 'rgba(255,255,255,0.08)',
                        color: sumar > 0 ? '#000' : 'var(--text-muted)',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: sumar > 0 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        boxShadow: sumar > 0 ? '0 0 12px rgba(0, 242, 254, 0.3)' : 'none'
                      }}
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==========================================
          SECCIÓN 2: FORMULARIO NUEVO PARTIDO
         ========================================== */}
      <section className="glass-panel" style={{ padding: '25px' }}>
        <h2 style={{ color: 'var(--neon-pink)', marginBottom: '20px', fontSize: '1.4rem' }}>
          🏟️ 2. Registrar Nuevo Partido
        </h2>

        <form onSubmit={handleCrearPartido} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Jornada #</label>
              <input
                type="number"
                placeholder="Ej. 4"
                value={jornada}
                onChange={(e) => setJornada(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fecha / Hora</label>
              <input
                type="text"
                placeholder="Viernes 4 - 20:00 hrs"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Marcador */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--neon-cyan)' }}>Goles Azules</label>
              <input
                type="number"
                min="0"
                value={golesAzules}
                onChange={(e) => setGolesAzules(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--neon-pink)' }}>Goles Rojos</label>
              <input
                type="number"
                min="0"
                value={golesRojos}
                onChange={(e) => setGolesRojos(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Slider de Posesión */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 700 }}>
              <span style={{ color: 'var(--neon-cyan)' }}>Posesión Azul: {posAzul}%</span>
              <span style={{ color: 'var(--neon-pink)' }}>Posesión Roja: {posRojo}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={posAzul}
              onChange={(e) => handlePosesionAzul(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--neon-cyan)' }}
            />
          </div>

          {/* CONTROLES PARA AGREGAR PILLS DE GOLEADORES */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ⚽ Anotadores del Partido
            </label>

            {/* Selector + Contador + Botón */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <select
                value={selectedJugadorId}
                onChange={(e) => handleJugadorSelect(e.target.value)}
                style={{ ...inputStyle, flex: 2, minWidth: '160px' }}
              >
                <option value="">-- Seleccionar Jugador --</option>
                {jugadoresData.map((j) => (
                  <option key={j.id} value={j.id} style={{ background: '#1a1a1a' }}>
                    {j.nombre} ({j.equipo})
                  </option>
                ))}
              </select>

              <select
                value={equipoPillInput}
                onChange={(e) => setEquipoPillInput(e.target.value)}
                style={{ ...inputStyle, flex: 1, minWidth: '110px' }}
              >
                <option value="azules" style={{ background: '#1a1a1a' }}>Azules</option>
                <option value="rojos" style={{ background: '#1a1a1a' }}>Rojos</option>
              </select>

              <input
                type="number"
                min="1"
                value={golesPillInput}
                onChange={(e) => setGolesPillInput(e.target.value)}
                style={{ ...inputStyle, width: '65px', textAlign: 'center' }}
              />

              <button
                type="button"
                onClick={handleAddGoleadorPill}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--neon-cyan)',
                  background: 'rgba(0, 242, 254, 0.15)',
                  color: 'var(--neon-cyan)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Agregar
              </button>
            </div>

            {/* CONTENEDOR DE PILLS ESTILO OUTLOOK / CHIPS */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              minHeight: '50px',
              alignItems: 'center'
            }}>
              {goleadoresList.length === 0 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  No hay anotadores agregados. Elige un jugador arriba para crear su Pill.
                </span>
              ) : (
                goleadoresList.map((g) => {
                  const esAzul = g.equipo === 'azules';
                  return (
                    <div
                      key={g.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: esAzul ? 'rgba(0, 242, 254, 0.15)' : 'rgba(247, 37, 133, 0.15)',
                        border: `1px solid ${esAzul ? 'rgba(0, 242, 254, 0.4)' : 'rgba(247, 37, 133, 0.4)'}`,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#fff',
                        boxShadow: `0 0 10px ${esAzul ? 'rgba(0, 242, 254, 0.2)' : 'rgba(247, 37, 133, 0.2)'}`
                      }}
                    >
                      <span>⚽ {g.nombre}</span>
                      <span style={{
                        background: esAzul ? 'var(--neon-cyan)' : 'var(--neon-pink)',
                        color: '#000',
                        borderRadius: '10px',
                        padding: '1px 6px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        x{g.goles}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePill(g.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.6)',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          fontSize: '1rem',
                          lineHeight: 1
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPartido}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {savingPartido ? 'Guardando Partido...' : '🚀 Publicar Partido'}
          </button>
        </form>
      </section>
    </main>
  );
}

// Estilo reutilizable de Inputs
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(0, 0, 0, 0.3)',
  color: '#fff',
  fontSize: '0.9rem'
};