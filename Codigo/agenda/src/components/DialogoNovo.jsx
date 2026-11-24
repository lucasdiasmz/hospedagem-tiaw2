import { useEffect, useRef, useState } from 'react';
import { DIAS_SEMANA, diaDaSemana } from '../utils/datas.js';
import Dialogo from '@ds/Dialogo.jsx';

const ROTULO_DIA = { dom: 'D', seg: 'S', ter: 'T', qua: 'Q', qui: 'Q', sex: 'S', sab: 'S' };
const NOME_DIA = { dom: 'Domingo', seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado' };

const LEMBRETES = [
  { valor: '', rotulo: 'Sem lembrete' },
  { valor: '15', rotulo: '15 minutos antes' },
  { valor: '30', rotulo: '30 minutos antes' },
  { valor: '60', rotulo: '1 hora antes' },
  { valor: '1440', rotulo: '1 dia antes' },
];

/* dica do campo "Detalhe" conforme o tipo */
const DICA_DETALHE = {
  consulta: 'Ex.: Dra. Fernanda · Clínica Vida',
  exame: 'Ex.: Laboratório Central · jejum de 8 h',
  visita: 'Ex.: Ana Souza',
  medicamento: 'Ex.: 1 comprimido após o café',
  tarefa: 'Ex.: no quintal, com andador',
};

function estadoInicial(data) {
  return {
    tipo: 'consulta', titulo: '', subtitulo: '', data, horario: '09:00',
    repetir: 'nao', dias: [DIAS_SEMANA[diaDaSemana(data)]], lembrete: '60',
  };
}

/* formulário de novo compromisso (POST /idosos/:id/eventos) */
export default function DialogoNovo({ aberto, dataInicial, tipos, aoFechar, aoSalvar }) {
  const [f, setF] = useState(() => estadoInicial(dataInicial));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const tituloRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    setF(estadoInicial(dataInicial));
    setErro('');
    setSalvando(false);
    tituloRef.current.focus();
  }, [aberto, dataInicial]);

  const mudar = (campo) => (e) => setF((atual) => ({ ...atual, [campo]: e.target.value }));

  function alternarDia(dia) {
    setF((atual) => ({
      ...atual,
      dias: atual.dias.includes(dia) ? atual.dias.filter((d) => d !== dia) : [...atual.dias, dia],
    }));
  }

  async function enviar(e) {
    e.preventDefault();
    if (f.repetir === 'semanal' && !f.dias.length) {
      setErro('Escolha pelo menos um dia da semana.');
      return;
    }
    const recorrencia = f.repetir === 'nao' ? null
      : f.repetir === 'diaria' ? { frequencia: 'diaria' }
        : { frequencia: 'semanal', diasSemana: f.dias };
    setSalvando(true);
    setErro('');
    try {
      await aoSalvar({
        tipo: f.tipo,
        titulo: f.titulo,
        subtitulo: f.subtitulo,
        data: f.data,
        horario: f.horario,
        recorrencia,
        lembrete: f.lembrete ? { ativo: true, minutosAntes: Number(f.lembrete) } : { ativo: false, minutosAntes: 0 },
      });
    } catch (err) {
      setErro(err.message);
      setSalvando(false);
    }
  }

  return (
    <Dialogo aberto={aberto} aoFechar={aoFechar} tituloId="novo-titulo" className="dialogo-form">
      <form onSubmit={enviar}>
        <h2 id="novo-titulo">Novo compromisso</h2>

        <fieldset className="campo">
          <legend>Tipo</legend>
          <div className="opcoes-tipo">
            {tipos.map((t) => (
              <label key={t.id} className={'opcao-tipo ' + t.id}>
                <input type="radio" name="tipo" value={t.id} checked={f.tipo === t.id} onChange={mudar('tipo')} />
                <span className="ponto" aria-hidden="true"></span>
                {t.rotulo}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="campo">
          Título
          <input
            ref={tituloRef}
            type="text"
            maxLength="80"
            placeholder="Ex.: Consulta com cardiologista"
            value={f.titulo}
            onChange={mudar('titulo')}
            required
          />
        </label>

        <label className="campo">
          <span>Detalhe <span className="opcional">(opcional)</span></span>
          <input type="text" maxLength="80" placeholder={DICA_DETALHE[f.tipo]} value={f.subtitulo} onChange={mudar('subtitulo')} />
        </label>

        <div className="campos-lado">
          <label className="campo">
            Data
            <input type="date" value={f.data} onChange={mudar('data')} required />
          </label>
          <label className="campo">
            Horário
            <input type="time" value={f.horario} onChange={mudar('horario')} required />
          </label>
        </div>

        <div className="campos-lado">
          <label className="campo">
            Repetir
            <select value={f.repetir} onChange={mudar('repetir')}>
              <option value="nao">Não repete</option>
              <option value="diaria">Todos os dias</option>
              <option value="semanal">Toda semana</option>
            </select>
          </label>
          <label className="campo">
            Lembrete
            <select value={f.lembrete} onChange={mudar('lembrete')}>
              {LEMBRETES.map((l) => <option key={l.valor} value={l.valor}>{l.rotulo}</option>)}
            </select>
          </label>
        </div>

        {f.repetir === 'semanal' && (
          <fieldset className="campo">
            <legend>Dias da semana</legend>
            <div className="opcoes-dias">
              {DIAS_SEMANA.map((d) => (
                <label key={d} className="opcao-dia" title={NOME_DIA[d]}>
                  <input type="checkbox" checked={f.dias.includes(d)} onChange={() => alternarDia(d)} aria-label={NOME_DIA[d]} />
                  <span aria-hidden="true">{ROTULO_DIA[d]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {erro && <p className="form-erro" role="alert">{erro}</p>}

        <div className="dialogo-botoes">
          <button type="button" className="btn" onClick={aoFechar}>Cancelar</button>
          <button type="submit" className="btn btn-primario" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}
