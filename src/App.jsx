import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Estadisticas from './pages/Estadisticas';
import Equipos from './pages/Equipos';
import PerfilJugador from './pages/PerfilJugador';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Historial from './components/Historial';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores/:id" element={<PerfilJugador />} />
          <Route path="/historial" element={<Historial />} />
          
          {/* Rutas de Administración */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;