import Dialogo from '@ds/Dialogo.jsx';

/* ficha da dose: abre como folha no celular e centralizada no computador */
export default function Detalhes({ medicamento, aoFechar }) {
    const linhas = [
        ['Dosagem', medicamento?.dosagem],
        ['Horário', medicamento?.horario],
        ['Frequência', medicamento?.frequencia],
        ['Forma', medicamento?.forma],
        ['Via de uso', medicamento?.via],
        ['Observações', medicamento?.observacoes],
        ['Status hoje', medicamento?.status],
    ].filter(([, valor]) => valor);

    return (
        <Dialogo aberto={!!medicamento} aoFechar={aoFechar} titulo={medicamento?.nome || 'Medicamento'}>
            <dl className="ficha">
                {linhas.map(([rotulo, valor]) => (
                    <div key={rotulo}>
                        <dt>{rotulo}</dt>
                        <dd>{valor}</dd>
                    </div>
                ))}
            </dl>
            <div className="dialogo-botoes">
                <button type="button" className="btn btn-primario" onClick={aoFechar}>Fechar</button>
            </div>
        </Dialogo>
    );
}
