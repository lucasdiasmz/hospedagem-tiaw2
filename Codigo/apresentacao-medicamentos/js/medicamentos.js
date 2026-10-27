const medicamentosIniciais = [
    {
        id: 1,
        nome: 'Losartana 50mg',
        dosagem: '1 comprimido',
        horario: '08:00',
        frequencia: 'Diariamente',
        observacoes: 'Tomar após o café da manhã',
        via: 'Oral',
        status: 'Pendente'
    },
    {
        id: 2,
        nome: 'Metformina 850mg',
        dosagem: '1 comprimido',
        horario: '12:00',
        frequencia: 'Diariamente',
        observacoes: 'Tomar após o almoço',
        via: 'Oral',
        status: 'Tomado'
    },
    {
        id: 3,
        nome: 'Sinvastatina 20mg',
        dosagem: '1 comprimido',
        horario: '20:00',
        frequencia: 'Diariamente',
        observacoes: 'Tomar antes de dormir',
        via: 'Oral',
        status: 'Pendente'
    }
];

const chave = 'acessamob-medicamentos';
let medicamentos = medicamentosIniciais.map(medicamento => ({ ...medicamento }));
const lista = document.querySelector('#lista-medicamentos');
const busca = document.querySelector('#busca');
const detalhes = document.querySelector('#detalhes');
const mensagem = document.querySelector('#mensagem');

try {
    const salvos = JSON.parse(localStorage.getItem(chave));
    // Os registros são restaurados apenas para o dia em que foram feitos.
    if (salvos && salvos.data === dataAtual() && Array.isArray(salvos.tomados)) {
        medicamentos.forEach(medicamento => {
            medicamento.status = salvos.tomados.includes(medicamento.id) ? 'Tomado' : 'Pendente';
        });
    }
} catch {
    mensagem.textContent = 'Não foi possível recuperar os registros salvos neste navegador.';
}

function dataAtual() {
    return new Date().toLocaleDateString('sv-SE');
}

function normalizar(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function mostrarMedicamentos() {
    lista.replaceChildren();
    const filtrados = medicamentos.filter(medicamento =>
        normalizar(medicamento.nome).includes(normalizar(busca.value.trim()))
    );

    filtrados.forEach(medicamento => {
        const linha = document.createElement('tr');
        ['nome', 'dosagem', 'horario', 'frequencia', 'observacoes'].forEach(campo => {
            const celula = document.createElement('td');
            celula.textContent = medicamento[campo];
            linha.append(celula);
        });

        const celulaStatus = document.createElement('td');
        const status = document.createElement('span');
        status.className = medicamento.status === 'Tomado' ? 'status tomado' : 'status';
        status.textContent = medicamento.status;
        celulaStatus.append(status);
        linha.append(celulaStatus);

        const celulaDetalhes = document.createElement('td');
        const verDetalhes = document.createElement('button');
        verDetalhes.className = 'botao';
        verDetalhes.textContent = 'Ver detalhes';
        verDetalhes.setAttribute('aria-label', 'Ver detalhes de ' + medicamento.nome);
        verDetalhes.addEventListener('click', () => mostrarDetalhes(medicamento));
        celulaDetalhes.append(verDetalhes);

        const celulaTomar = document.createElement('td');
        const tomar = document.createElement('button');
        const tomado = medicamento.status === 'Tomado';
        tomar.className = tomado ? 'botao tomar desfazer' : 'botao tomar';
        tomar.textContent = tomado ? 'Desfazer registro' : 'Marcar como tomado';
        tomar.dataset.id = medicamento.id;
        tomar.setAttribute(
            'aria-label',
            tomado
                ? 'Desfazer registro de ' + medicamento.nome
                : 'Marcar ' + medicamento.nome + ' como tomado'
        );
        tomar.addEventListener('click', () => marcarTomado(medicamento.id));
        celulaTomar.append(tomar);
        linha.append(celulaDetalhes, celulaTomar);
        lista.append(linha);
    });

    document.querySelector('#sem-resultados').hidden = filtrados.length > 0;
    mostrarProximo();
}

function mostrarProximo() {
    const pendentes = medicamentos
        .filter(medicamento => medicamento.status === 'Pendente')
        .sort((a, b) => a.horario.localeCompare(b.horario));
    const proximo = pendentes[0];
    document.querySelector('#nome-proximo').textContent = proximo ? proximo.nome : 'Todos os medicamentos foram tomados';
    document.querySelector('#orientacao-proximo').textContent = proximo ? proximo.horario + '  |  ' + proximo.observacoes : 'Nenhuma dose pendente na lista de hoje.';
}

function marcarTomado(id) {
    const medicamento = medicamentos.find(item => item.id === id);
    medicamento.status = medicamento.status === 'Tomado' ? 'Pendente' : 'Tomado';
    mensagem.textContent = medicamento.status === 'Tomado'
        ? medicamento.nome + ' marcado como tomado.'
        : 'Registro de ' + medicamento.nome + ' desfeito. O medicamento está pendente novamente.';
    try {
        localStorage.setItem(
            chave,
            JSON.stringify({
                data: dataAtual(),
                tomados: medicamentos
                    .filter(item => item.status === 'Tomado')
                    .map(item => item.id)
            })
        );
    } catch {
        mensagem.textContent += ' O navegador não permitiu salvar o registro. Ele será perdido ao recarregar.';
    }
    mostrarMedicamentos();
    const proximoBotao = lista.querySelector('[data-id="' + id + '"]') || document.querySelector('.voltar');
    proximoBotao.focus();
}

function mostrarDetalhes(medicamento) {
    document.querySelector('#titulo-detalhes').textContent = medicamento.nome;
    const dados = document.querySelector('#dados-detalhes');
    dados.replaceChildren();
    const campos = {
        dosagem: 'Dosagem',
        horario: 'Horário',
        frequencia: 'Frequência',
        via: 'Via de uso',
        observacoes: 'Observações',
        status: 'Status'
    };
    Object.entries(campos).forEach(([campo, titulo]) => {
        const termo = document.createElement('dt');
        const valor = document.createElement('dd');
        termo.textContent = titulo;
        valor.textContent = medicamento[campo];
        dados.append(termo, valor);
    });
    detalhes.showModal();
}

document.querySelector('#form-busca').addEventListener('submit', evento => evento.preventDefault());
busca.addEventListener('input', mostrarMedicamentos);
mostrarMedicamentos();

const dataHoje = document.querySelector('#data-hoje');
if (dataHoje) dataHoje.textContent = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});
