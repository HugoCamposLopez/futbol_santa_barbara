import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import Estadisticas from './pages/Estadisticas';
import Home from './pages/Home';
import Navbar from './components/Navbar'
import Equipos from './pages/Equipos';
import PerfilJugador from './pages/PerfilJugador';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
// Importaciones de tus páginas...

function App() {
  return (
    <AuthProvider>
      {/* 👈 Agregamos el basename con la ruta de tu repositorio */}
      <Router basename="/futbol_santa_barbara">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores/:id" element={<PerfilJugador />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;