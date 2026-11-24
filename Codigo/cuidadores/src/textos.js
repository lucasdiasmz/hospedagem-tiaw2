/* Rótulos e formatações usados na lista e no perfil dos cuidadores */

export const EXPERIENCIAS = {
    '0-1': 'Menos de 1 ano',
    '1-3': '1 a 3 anos',
    '3-5': '3 a 5 anos',
    '5-10': '5 a 10 anos',
    '10+': 'Mais de 10 anos'
};

/* para ordenar por experiência */
export const ORDEM_EXPERIENCIA = { '0-1': 0, '1-3': 1, '3-5': 2, '5-10': 3, '10+': 4 };

export const SERVICOS = {
    acompanhante: 'Acompanhante',
    companhia: 'Companhia',
    'tecnico-enfermagem': 'Técnico de enfermagem',
    outro: 'Outro'
};

export const DIAS = {
    seg: 'Segunda',
    ter: 'Terça',
    qua: 'Quarta',
    qui: 'Quinta',
    sex: 'Sexta',
    sab: 'Sábado',
    dom: 'Domingo'
};

export const DIAS_CURTOS = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom' };

export function iniciais(nome) {
    return nome.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join('');
}

export function dinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function nota(valor) {
    return valor.toFixed(1).replace('.', ',');
}

export function normalizar(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
