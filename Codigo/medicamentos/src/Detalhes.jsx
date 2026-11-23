import { useEffect, useRef } from 'react';

export default function Detalhes({ medicamento, aoFechar }) {
    const janela = useRef(null);

    useEffect(() => {
        janela.current.showModal();
    }, []);

    return (
        <dialog ref={janela} className="dialogo" aria-labelledby="titulo-detalhes" onClose={aoFechar}>
            <h2 id="titulo-detalhes">{medicamento.nome}</h2>

            <dl>
                <dt>Dosagem</dt>
                <dd>{medicamento.dosagem}</dd>

                <dt>Horário</dt>
                <dd>{medicamento.horario}</dd>

                <dt>Frequência</dt>
                <dd>{medicamento.frequencia}</dd>

                <dt>Via de uso</dt>
                <dd>{medicamento.via}</dd>

                <dt>Observações</dt>
                <dd>{medicamento.observacoes}</dd>

                <dt>Status</dt>
                <dd>{medicamento.status}</dd>
            </dl>

            <form method="dialog">
                <button className="btn btn-primario" autoFocus>Fechar</button>
            </form>
        </dialog>
    );
}
