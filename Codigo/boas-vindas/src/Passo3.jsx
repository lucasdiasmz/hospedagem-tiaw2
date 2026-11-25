import { Acessibilidade, Campo, Opcoes } from './componentes.jsx';

const MOBILIDADE = [
  { id: 'nenhuma', rotulo: 'Nenhum apoio' },
  { id: 'andador', rotulo: 'Andador' },
  { id: 'muletas', rotulo: 'Muletas' },
  { id: 'cadeira-manual', rotulo: 'Cadeira de rodas manual' },
  { id: 'cadeira-motorizada', rotulo: 'Cadeira motorizada' },
];

const EXPERIENCIAS = [
  { valor: '0-1', rotulo: 'Menos de 1 ano' },
  { valor: '1-3', rotulo: '1 a 3 anos' },
  { valor: '3-5', rotulo: '3 a 5 anos' },
  { valor: '5-10', rotulo: '5 a 10 anos' },
  { valor: '10+', rotulo: 'Mais de 10 anos' },
];

const SERVICOS = [
  { id: 'acompanhante', rotulo: 'Acompanhante' },
  { id: 'companhia', rotulo: 'Companhia' },
  { id: 'tecnico-enfermagem', rotulo: 'Técnico de enfermagem' },
  { id: 'outro', rotulo: 'Outro' },
];

const DIAS = [
  { id: 'seg', rotulo: 'Seg', nome: 'Segunda' },
  { id: 'ter', rotulo: 'Ter', nome: 'Terça' },
  { id: 'qua', rotulo: 'Qua', nome: 'Quarta' },
  { id: 'qui', rotulo: 'Qui', nome: 'Quinta' },
  { id: 'sex', rotulo: 'Sex', nome: 'Sexta' },
  { id: 'sab', rotulo: 'Sáb', nome: 'Sábado' },
  { id: 'dom', rotulo: 'Dom', nome: 'Domingo' },
];

const LIGACAO = {
  idoso: [
    { id: 'novo', rotulo: 'Começar do zero' },
    { id: 'codigo', rotulo: 'Tenho um código da família' },
  ],
  cliente: [
    { id: 'novo', rotulo: 'Cadastrar a pessoa' },
    { id: 'codigo', rotulo: 'Tenho um código' },
    { id: 'depois', rotulo: 'Fazer depois' },
  ],
};

function Codigo({ p, mudar, erros, ...props }) {
  return (
    <Campo rotulo="Código de convite" type="text" autoComplete="off" autoCapitalize="characters" spellCheck="false" maxLength="12"
      placeholder="ABCD-EFGH" value={p.codigo} onChange={(e) => mudar('codigo', e.target.value)} erro={erros.codigo} {...props} />
  );
}

/* p: respostas do passo 3; mudar(campo, valor, erro = campo) */
export default function Passo3({ perfil, primeiroNome, p, mudar, erros, prefs, salvarPrefs, tituloRef }) {
  function alternar(lista, valor) {
    mudar(lista, p[lista].includes(valor) ? p[lista].filter((v) => v !== valor) : [...p[lista], valor]);
  }
  const novo = perfil !== 'cuidador' && p.ligacao === 'novo';

  return (
    <>
      <h1 id="titulo-passo" ref={tituloRef} tabIndex={-1}>
        {perfil === 'cuidador' ? 'Sua experiência' : perfil === 'cliente' ? 'De quem você cuida?' : `Quase lá${primeiroNome ? ', ' + primeiroNome : ''}`}
      </h1>
      <p className="bv-sub">
        {perfil === 'cuidador' && 'Conte como você trabalha e quando pode atender. A família vê estes dados na busca.'}
        {perfil === 'cliente' && 'Só você e quem você convidar veem os dados desta pessoa.'}
        {perfil === 'idoso' && 'Só você e quem você convidar veem os seus dados.'}
      </p>

      <div className="formulario">
        {perfil !== 'cuidador' && (
          <Opcoes legenda="Como quer começar?" tipo="radio" nome="ligacao" opcoes={LIGACAO[perfil]}
            marcada={(id) => p.ligacao === id} aoMudar={(id) => mudar('ligacao', id)} />
        )}
        {perfil !== 'cuidador' && p.ligacao === 'codigo' && (
          <Codigo p={p} mudar={mudar} erros={erros} dica="Quem já cuida desta pessoa pode gerar o código no Início." />
        )}
        {novo && perfil === 'cliente' && (
          <Campo rotulo="Nome completo da pessoa" type="text" autoComplete="off" value={p.nomeIdoso}
            onChange={(e) => mudar('nomeIdoso', e.target.value)} erro={erros.nomeIdoso} />
        )}
        {novo && (
          <>
            <Campo rotulo="Data de nascimento" type="date" value={p.nascimento} autoComplete={perfil === 'idoso' ? 'bday' : 'off'}
              onChange={(e) => mudar('nascimento', e.target.value)} erro={erros.nascimento} />
            <Opcoes legenda={perfil === 'idoso' ? 'Você usa algum apoio para se locomover?' : 'A pessoa usa algum apoio para se locomover?'}
              tipo="radio" nome="mobilidade" opcoes={MOBILIDADE} marcada={(id) => p.mobilidade === id} aoMudar={(id) => mudar('mobilidade', id)} />
          </>
        )}

        {perfil === 'cuidador' && (
          <>
            <Campo rotulo="Tempo de experiência com cuidado" erro={erros.experiencia}>
              {(ligacao) => (
                <select {...ligacao} value={p.experiencia} onChange={(e) => mudar('experiencia', e.target.value)}>
                  <option value="">Escolha</option>
                  {EXPERIENCIAS.map((x) => <option key={x.valor} value={x.valor}>{x.rotulo}</option>)}
                </select>
              )}
            </Campo>
            <Opcoes legenda="Serviços que você oferece" tipo="checkbox" nome="servicos" opcoes={SERVICOS}
              marcada={(id) => p.servicos.includes(id)} aoMudar={(id) => alternar('servicos', id)} erro={erros.servicos} />
            <fieldset className="campo bv-fieldset" aria-describedby={erros.dias ? 'erro-dias' : undefined}>
              <legend>Dias em que pode atender</legend>
              <div className="bv-dias">
                {DIAS.map((d, i) => (
                  <label key={d.id} className="bv-dia" title={d.nome}>
                    <input type="checkbox" data-erro={erros.dias && i === 0 ? 'true' : undefined} checked={p.dias.includes(d.id)}
                      onChange={() => alternar('dias', d.id)} aria-label={d.nome} />
                    <span aria-hidden="true">{d.rotulo}</span>
                  </label>
                ))}
              </div>
              {erros.dias && <span className="campo-erro" id="erro-dias">{erros.dias}</span>}
            </fieldset>
            <div className="campos-linha bv-horas">
              <Campo rotulo="Das" type="time" value={p.inicio} onChange={(e) => mudar('inicio', e.target.value, 'horas')} erro={erros.horas} />
              <Campo rotulo="Até" type="time" value={p.fim} onChange={(e) => mudar('fim', e.target.value, 'horas')} />
            </div>
            {p.fim && p.fim < p.inicio && <p className="bv-noturno">Plantão noturno: até {p.fim} do dia seguinte.</p>}
            <Codigo p={p} mudar={mudar} erros={erros} opcional dica="Se uma família já convidou você." />
          </>
        )}

        <Acessibilidade prefs={prefs} salvarPrefs={salvarPrefs} />

        <div className="campo">
          <label className="bv-aceite">
            <input type="checkbox" checked={p.consentimento} aria-invalid={erros.consentimento ? 'true' : undefined}
              aria-describedby={erros.consentimento ? 'erro-aceite' : undefined}
              onChange={(e) => mudar('consentimento', e.target.checked)} />
            <span>
              {perfil === 'cuidador'
                ? 'Autorizo o AcessaMob a guardar meus dados e mostrá-los às famílias.'
                : 'Autorizo o AcessaMob a guardar estes dados de saúde e mostrá-los só à rede de apoio.'}
            </span>
          </label>
          {erros.consentimento && <span className="campo-erro" id="erro-aceite">{erros.consentimento}</span>}
        </div>
      </div>
    </>
  );
}
