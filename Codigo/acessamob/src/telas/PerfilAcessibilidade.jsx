import { useEffect, useState } from 'react';

const tiposMobilidade = [
  { id: 'cadeira-manual', rotulo: 'Cadeira manual', icone: '🦽' },
  { id: 'cadeira-motorizada', rotulo: 'Cadeira motorizada', icone: '🦼' },
  { id: 'muletas', rotulo: 'Muletas', icone: '🩼' },
  { id: 'andador', rotulo: 'Andador', icone: '🚶' },
  { id: 'nenhuma', rotulo: 'Nenhuma', icone: '🚫' },
];

function Toggle({ id, rotulo, icone, checked, onChange }) {
  return (
    <label className="preferencia" htmlFor={id}>
      <span className="preferencia-info">
        <span aria-hidden="true">{icone}</span>
        {rotulo}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function PerfilAcessibilidade({ onVoltar, onProximo }) {
  const [mobilidade, setMobilidade] = useState(null);
  const [fonteMaior, setFonteMaior] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);

  // Aplica as preferências no site inteiro
  useEffect(() => {
    document.body.classList.toggle('fonte-maior', fonteMaior);
    document.body.classList.toggle('alto-contraste', altoContraste);
  }, [fonteMaior, altoContraste]);

  function handleProximo() {
    onProximo?.({ mobilidade, fonteMaior, altoContraste });
  }

  return (
    <main className="tela-acessibilidade">
      <button className="btn-voltar" onClick={onVoltar}>
        ← Voltar
      </button>

      <h1>Perfil de acessibilidade</h1>
      <p className="subtitulo">
        Isso nos ajuda a encontrar os melhores cuidadores e serviços para você.
      </p>

      <h3 className="secao-titulo">Tipo de mobilidade</h3>
      <div className="grid-mobilidade">
        {tiposMobilidade.map((tipo) => (
          <button
            key={tipo.id}
            type="button"
            className={`opcao ${mobilidade === tipo.id ? 'opcao--ativa' : ''}`}
            aria-pressed={mobilidade === tipo.id}
            onClick={() => setMobilidade(tipo.id)}
          >
            <span className="opcao-icone" aria-hidden="true">
              {tipo.icone}
            </span>
            {tipo.rotulo}
          </button>
        ))}
      </div>

      <h3 className="secao-titulo">Preferências</h3>
      <div className="lista-preferencias">
        <Toggle
          id="fonte-maior"
          rotulo="Fonte maior"
          icone="🔠"
          checked={fonteMaior}
          onChange={setFonteMaior}
        />
        <Toggle
          id="alto-contraste"
          rotulo="Alto contraste"
          icone="🌗"
          checked={altoContraste}
          onChange={setAltoContraste}
        />
      </div>

      <button className="btn-proximo" onClick={handleProximo}>
        Próximo
      </button>
    </main>
  );
}

export default PerfilAcessibilidade;