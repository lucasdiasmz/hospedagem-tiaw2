import Lista from './Lista.jsx';
import Perfil from './Perfil.jsx';

/* index.html → busca de cuidadores; perfil.html?id=cui-1 → perfil completo */
export default function App() {
    const id = new URLSearchParams(window.location.search).get('id');
    return id ? <Perfil id={id} /> : <Lista />;
}
