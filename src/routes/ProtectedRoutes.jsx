import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Si no está autenticado, lo manda directo al login
    return <Navigate to="/admin" replace />;
  }

  return children;
}