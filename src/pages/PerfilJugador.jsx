import { useParams } from 'react';

export default function PerfilJugador() {
  const { id } = useParams();
  return <div style={{ padding: '20px' }}><h1>👤 Perfil del Jugador: {id}</h1></div>;
}