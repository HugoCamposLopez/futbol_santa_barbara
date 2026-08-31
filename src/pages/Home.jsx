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

  if (loading) return <div className="loader">Buscando señal del partido... ⚽</div>;
  if (!partido) return <div className="loader">Sin partido registrado.</div>;

  return (
    <main className="container">
      <div className="badge">MATCH OF THE WEEK</div>
      <p className="fecha">{partido.fecha}</p>

      {/* Tarjeta Cristal/Líquida */}
      <div className="glass-card">
        <div className="team">
          <span className="team-name">{partido.equipoLocal}</span>
          <span className="score cyan">{partido.golesLocal}</span>
        </div>

        <div className="vs-container">
          <span className="vs">VS</span>
          {partido.enJuego && <span className="live-dot">LIVE</span>}
        </div>

        <div className="team">
          <span className="team-name">{partido.equipoVisitante}</span>
          <span className="score purple">{partido.golesVisitante}</span>
        </div>
      </div>

      <Link to="/estadisticas" className="liquid-btn">
        Ver Tabla y Estadísticas →
      </Link>
    </main>
  );
}