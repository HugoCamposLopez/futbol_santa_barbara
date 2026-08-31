import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de Páginas (las crearemos en blanco por ahora)
import Home from './pages/Home';
import Estadisticas from './pages/Estadisticas';
import Equipos from './pages/Equipos';
import PerfilJugador from './pages/PerfilJugador';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Componentes globales
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/jugadores/:id" element={<PerfilJugador />} />

        {/* Rutas de Administración */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;