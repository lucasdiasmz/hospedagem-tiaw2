import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Shell from "@ds/Shell.jsx";
import { USUARIO_LOGADO } from "./data/usuario.js";
import PerfilIdoso from "./pages/PerfilIdoso.jsx";
import LinhaDoTempo from "./pages/LinhaDoTempo.jsx";

/* o item ativo do menu depende da rota: /perfil → Perfil do idoso; /linha-do-tempo → Linha do tempo */
function Telas() {
  const { pathname } = useLocation();
  const tela = pathname.startsWith("/linha-do-tempo") ? "linha-do-tempo" : "perfis";

  return (
    <Shell tela={tela} usuario={{ nome: USUARIO_LOGADO.nome, tipo: "cuidador" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/perfil" replace />} />
        <Route path="/perfil" element={<PerfilIdoso />} />
        <Route path="/linha-do-tempo" element={<LinhaDoTempo />} />
        <Route path="*" element={<Navigate to="/perfil" replace />} />
      </Routes>
    </Shell>
  );
}

function App() {
  return (
    /* no site único esta tela fica em /idoso/ (Codigo/build-unificado.mjs) */
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Telas />
    </BrowserRouter>
  );
}

export default App;
