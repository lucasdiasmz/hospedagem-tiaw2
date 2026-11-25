/* Textos da página inicial, separados do layout */
import { IconeContraste, IconeCuidadores, IconeEscudo, IconeLetra, IconeLinhaDoTempo, IconePerfis, IconeTarefas } from '@ds/Icones.jsx';
import { TELAS } from '@ds/navegacao.js';
import objetoAgenda from './imagens/objeto-agenda.webp';
import objetoCuidadores from './imagens/objeto-cuidadores.webp';
import objetoRemedios from './imagens/objeto-remedios.webp';
import objetoTarefas from './imagens/objeto-tarefas.webp';
import telaAgenda from './imagens/tela-agenda.webp';
import telaCuidadores from './imagens/tela-cuidadores.webp';
import telaInicio from './imagens/tela-inicio.webp';
import telaLinha from './imagens/tela-linha.webp';
import telaRemedios from './imagens/tela-remedios.webp';
import telaTarefas from './imagens/tela-tarefas.webp';

export const LINKS = {
  entrar: TELAS.boasVindas,
  criar: TELAS.boasVindas + '?criar=1',
  cuidador: TELAS.boasVindas + '?perfil=cuidador',
  inicio: TELAS.inicio,
};

export const MENU = [
  { id: 'topo', rotulo: 'Início' },
  { id: 'recursos', rotulo: 'Recursos' },
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'por-que', rotulo: 'Por que usar' },
];

/* cada cartão abre a demonstração na sua tela */
export const RECURSOS = [
  { id: 'remedios', titulo: 'Remédios', texto: 'A próxima dose aparece primeiro. Um toque registra.', imagem: objetoRemedios },
  { id: 'agenda', titulo: 'Agenda', texto: 'Consultas, visitas e exames por semana ou por mês.', imagem: objetoAgenda },
  { id: 'tarefas', titulo: 'Tarefas', texto: 'Quem faz o quê, até quando, e a lista de compras.', imagem: objetoTarefas },
  { id: 'cuidadores', titulo: 'Cuidadores', texto: 'Perfil, preço e avaliações antes de chamar.', imagem: objetoCuidadores },
];

/* telas reais do sistema, com dados de exemplo */
export const DEMONSTRACAO = [
  { id: 'inicio', titulo: 'Início', texto: 'O próximo cuidado vem primeiro, com o quanto falta e a régua do dia.', tela: telaInicio },
  { id: 'remedios', titulo: 'Remédios', texto: 'Cada dose com nome, hora e orientação. Tomou ou recusou, fica registrado.', tela: telaRemedios },
  { id: 'agenda', titulo: 'Agenda', texto: 'Consultas, visitas e exames da semana ou do mês, ao lado dos remédios.', tela: telaAgenda },
  { id: 'tarefas', titulo: 'Tarefas', texto: 'A família divide as tarefas, acompanha o prazo e mantém a lista de compras.', tela: telaTarefas },
  { id: 'linha', titulo: 'Linha do tempo', texto: 'O que aconteceu no dia, com alertas e a passagem de plantão.', tela: telaLinha },
  { id: 'cuidadores', titulo: 'Cuidadores', texto: 'Busca por serviço e dia, com preço por hora e avaliações de famílias.', tela: telaCuidadores },
];

/* fatos do sistema, conferidos no código; sem número de clientes */
export const NUMEROS = [
  { valor: '3', rotulo: 'perfis de acesso', Icone: IconePerfis },
  { valor: '7', rotulo: 'telas para a rotina', Icone: IconeTarefas },
  { valor: '+19%', rotulo: 'no tamanho da letra', Icone: IconeLetra },
  { valor: '4,5:1', rotulo: 'de contraste mínimo', Icone: IconeContraste },
];

export const MOTIVOS = [
  { titulo: 'Família unida', texto: 'Todos veem a mesma rotina e dividem o cuidado.', Icone: IconeCuidadores },
  { titulo: 'Só quem você convida', texto: 'Os dados de saúde ficam com a sua rede.', Icone: IconeEscudo },
  { titulo: 'Leitura fácil', texto: 'Letra maior e alto contraste em todas as telas.', Icone: IconeLetra },
  { titulo: 'Dia registrado', texto: 'Relatos e plantões em uma linha do tempo.', Icone: IconeLinhaDoTempo },
];
