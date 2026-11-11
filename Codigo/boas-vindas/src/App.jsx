import { useState } from 'react';
import './style.css';
import idosoImg from './assets/imgs/1761366.png';
import familiarImg from './assets/imgs/11126155.png';
import cuidadorImg from './assets/imgs/images.jpg';
import PerfilAcessibilidade from './telas/PerfilAcessibilidade';
import CuidadorProfissional from './telas/CuidadorProfissional';
import { TELAS } from './navegacao.js';

const perfis = [
  {
    id: 'idoso',
    titulo: 'Idoso',
    descricao: 'Quero mais autonomia e segurança',
    imagem: idosoImg,
    alt: 'Ícone de idoso',
    proximaTela: 'acessibilidade',
  },
  {
    id: 'familiar',
    titulo: 'Familiar/Responsável',
    descricao: 'Acompanhar e cuidar de quem eu amo',
    imagem: familiarImg,
    alt: 'Ícone de familiar ou responsável',
    proximaTela: 'acessibilidade',
  },
  {
    id: 'cuidador',
    titulo: 'Cuidador/Profissional',
    descricao: 'Oferecer meus serviços e fazer a diferença',
    imagem: cuidadorImg,
    alt: 'Ícone de cuidador ou profissional',
    proximaTela: 'cuidador',
  },
];

function Card({ titulo, descricao, imagem, alt, onClick }) {
  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <img src={imagem} alt={alt} />
      <div>
        <h3>{titulo}</h3>
        <p>{descricao}</p>
      </div>
    </div>
  );
}

function App() {
  const [tela, setTela] = useState('perfil');
  const [perfilEscolhido, setPerfilEscolhido] = useState(null);

  /* fim do cadastro inicial: segue para a tela inicial (Codigo/inicio) */
  function concluir(dados) {
    console.log(perfilEscolhido, dados);
    window.location.assign(TELAS.inicio);
  }

  function escolherPerfil(perfil) {
    if (!perfil.proximaTela) return;
    setPerfilEscolhido(perfil.id);
    setTela(perfil.proximaTela);
  }

  if (tela === 'acessibilidade') {
    return (
      <PerfilAcessibilidade
        onVoltar={() => setTela('perfil')}
        onProximo={concluir}
      />
    );
  }

  if (tela === 'cuidador') {
    return (
      <CuidadorProfissional
        onVoltar={() => setTela('perfil')}
        onFinalizar={concluir}
      />
    );
  }

  return (
    <>
      <h1>Bem vindo a AcessaMob</h1>
      <p>Escolha o seu perfil para começar</p>

      <div className="flex-cards">
        {perfis.map((perfil) => (
          <Card
            key={perfil.id}
            {...perfil}
            onClick={() => escolherPerfil(perfil)}
          />
        ))}
      </div>
    </>
  );
}

export default App;