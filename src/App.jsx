import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de Páginas (las crearemos en blanco por ahora)
import Home from './pages/Home';
import Estadisticas from './pages/Estadisticas';
import Equipos from './pages/Equipos';
import PerfilJugador from './pages/PerfilJugador';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz6pLf6wMDxsP_TOYq9MISWQyavzBs4vo",
  authDomain: "futbol-santa-barbara.firebaseapp.com",
  projectId: "futbol-santa-barbara",
  storageBucket: "futbol-santa-barbara.firebasestorage.app",
  messagingSenderId: "345592854227",
  appId: "1:345592854227:web:2090e70fe231fabbd78626"
};

// Initialize Firebase
// Componentes globales
import Navbar from './components/Navbar';
import Historial from './components/Historial';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>

    <BrowserRouter>
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
    </BrowserRouter>
    </AuthProvider>
  );
}
const app = initializeApp(firebaseConfig);

export default App;