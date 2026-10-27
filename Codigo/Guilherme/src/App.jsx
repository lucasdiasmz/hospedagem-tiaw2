import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import PerfilIdoso from "./pages/PerfilIdoso.jsx";

function App() {
  return (
    <>
      <div className="app">
        <Sidebar paginaAtiva="perfis" />
        <div className="main">
          <Topbar />
          <PerfilIdoso />
        </div>
      </div>
      <BottomNav paginaAtiva="perfis" />
    </>
  );
}

export default App;
