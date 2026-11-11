import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import PerfilIdoso from "./pages/PerfilIdoso.jsx";
import LinhaDoTempo from "./pages/LinhaDoTempo.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <Routes>
            <Route path="/" element={<Navigate to="/perfil" replace />} />
            <Route path="/perfil" element={<PerfilIdoso />} />
            <Route path="/linha-do-tempo" element={<LinhaDoTempo />} />
            <Route path="*" element={<Navigate to="/perfil" replace />} />
          </Routes>
        </div>
      </div>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
