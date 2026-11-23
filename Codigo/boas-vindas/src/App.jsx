import { useState } from 'react';
import './style.css';
import idosoImg from './assets/imgs/1761366.png';
import familiarImg from './assets/imgs/11126155.png';
import cuidadorImg from './assets/imgs/images.jpg';
import PerfilAcessibilidade from './telas/PerfilAcessibilidade';
import CuidadorProfissional from './telas/CuidadorProfissional';
import Moldura from './telas/Moldura';
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
      <span className="card-imagem"><img src={imagem} alt={alt} /></span>
      <div className="card-texto">
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
      <Moldura etapa="Passo 2 de 2">
        <PerfilAcessibilidade
          onVoltar={() => setTela('perfil')}
          onProximo={concluir}
        />
      </Moldura>
    );
  }

  if (tela === 'cuidador') {
    return (
      <Moldura etapa="Passo 2 de 2">
        <CuidadorProfissional
          onVoltar={() => setTela('perfil')}
          onFinalizar={concluir}
        />
      </Moldura>
    );
  }

  return (
    <Moldura etapa="Passo 1 de 2">
      <main className="tela-perfil">
        <h1>Bem-vindo à AcessaMob</h1>
        <p className="subtitulo">Escolha o seu perfil para começar.</p>

        <div className="flex-cards">
          {perfis.map((perfil) => (
            <Card
              key={perfil.id}
              {...perfil}
              onClick={() => escolherPerfil(perfil)}
            />
          ))}
        </div>
      </main>
    </Moldura>
  );
}

export default App;