import { Router } from 'express';
import { autenticar, semSegredos } from '../../../../auth/acesso.js';
import { criarLimite } from '../../../../auth/limite.js';
import { conferirSenha, gerarHash } from '../../../../auth/senha.js';
import { cookieDeEntrada, cookieDeSaida } from '../../../../auth/sessao.js';
import { agora } from '../servicos/tempo.js';
import { buscarConvite, usarConvite } from '../servicos/convites.js';
import { criarIdoso, regrasIdoso } from '../servicos/idoso.js';
import {
  DIAS_SEMANA, ErroHttp, validarCorpo, validarHora, validarLista, validarOpcao, validarTexto, validarTextoOpcional,
} from '../validacao.js';

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TELEFONE = /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/;
const PAPEIS = ['idoso', 'cliente', 'cuidador'];

function validarEmail(valor) {
  const email = typeof valor === 'string' ? valor.trim().toLowerCase() : '';
  if (email.length > 120 || !RE_EMAIL.test(email)) throw new ErroHttp(400, 'Confira o e-mail');
  return email;
}

function validarSenha(valor) {
  if (typeof valor !== 'string' || valor.length < 8) throw new ErroHttp(400, 'A senha precisa ter pelo menos 8 caracteres');
  if (valor.length > 128) throw new ErroHttp(400, 'A senha pode ter até 128 caracteres');
  return valor;
}

function validarTelefone(valor) {
  if (valor == null || valor === '') return '';
  if (typeof valor !== 'string' || !RE_TELEFONE.test(valor.replace(/\D/g, ''))) throw new ErroHttp(400, 'Confira o telefone com DDD');
  return valor.trim().slice(0, 20);
}

/* dados profissionais de quem é cuidador */
function regrasCuidador(cat) {
  return {
    experiencia: { validar: (v) => validarOpcao(v, cat.faixasExperiencia.map((f) => f.valor), 'Experiência') },
    servicos: { validar: (v) => validarLista(v, 'Serviços', (s) => validarOpcao(s, cat.servicos.map((x) => x.id), 'Serviço')) },
    dias: { validar: (v) => validarLista(v, 'Dias', (d) => validarOpcao(d, DIAS_SEMANA, 'Dia')) },
    inicio: { validar: (v) => validarHora(v, 'Início') },
    fim: { validar: (v) => validarHora(v, 'Fim') },
  };
}

/* Entrar, criar conta e sair. Estas rotas não exigem login. */
export function rotasAuth(repo) {
  const r = Router();
  /* por e-mail (senha de uma conta) e por endereço de rede (várias contas ou cadastros em massa) */
  const porEmail = criarLimite(8);
  const porRede = criarLimite(60);

  r.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  function conferirRede(req) {
    if (porRede.estourou(req.ip)) throw new ErroHttp(429, 'Muitas tentativas. Espere alguns minutos');
    porRede.contar(req.ip);
  }

  r.post('/entrar', async (req, res) => {
    conferirRede(req);
    const email = validarEmail(req.body?.email);
    const senha = typeof req.body?.senha === 'string' ? req.body.senha.slice(0, 128) : '';
    if (porEmail.estourou(email)) throw new ErroHttp(429, 'Muitas tentativas. Espere alguns minutos');

    const [usuario] = await repo.listar('usuarios', { email });
    if (!(await conferirSenha(senha, usuario?.senhaHash))) {
      porEmail.contar(email);
      throw new ErroHttp(401, 'E-mail ou senha incorretos');
    }
    porEmail.zerar(email);
    const cookie = cookieDeEntrada(usuario);
    const quem = await autenticar(repo, cookie);
    res.set('Set-Cookie', cookie);
    res.json({ ...quem.usuario, papel: quem.papel });
  });

  /* corpo: { nome, email, senha, telefone?, papel, consentimento: true, convite?, idoso?, cuidador? }
     - papel 'idoso': "idoso" tem os dados da própria pessoa (ou usa um convite da família);
     - papel 'cliente': "idoso" é a pessoa cuidada (opcional: dá para cadastrar ou usar convite depois);
     - papel 'cuidador': "cuidador" tem os dados profissionais. */
  r.post('/cadastrar', async (req, res) => {
    conferirRede(req);
    const corpo = req.body || {};
    const cat = await repo.buscarCatalogos();
    const nome = validarTexto(corpo.nome, 'Nome', 80);
    const email = validarEmail(corpo.email);
    const senha = validarSenha(corpo.senha);
    const telefone = validarTelefone(corpo.telefone);
    const papel = validarOpcao(corpo.papel, PAPEIS, 'Perfil');
    if (corpo.consentimento !== true) throw new ErroHttp(400, 'É preciso aceitar o uso dos dados para criar a conta');

    /* valida tudo antes de gravar qualquer coisa */
    const profissional = papel === 'cuidador' ? validarCorpo(corpo.cuidador || {}, regrasCuidador(cat)) : null;
    const codigo = validarTextoOpcional(corpo.convite, 'Convite', 20);
    const convite = codigo ? await buscarConvite(repo, codigo, papel) : null;
    const querIdoso = papel !== 'cuidador' && !convite && (papel === 'idoso' || corpo.idoso);
    const dadosIdoso = querIdoso
      ? validarCorpo({ ...(corpo.idoso || {}), ...(papel === 'idoso' ? { nome, telefone } : {}) }, regrasIdoso(cat))
      : null;
    if ((await repo.listar('usuarios', { email })).length) throw new ErroHttp(409, 'Já existe uma conta com este e-mail');

    const usuario = await repo.inserir('usuarios', {
      nome,
      email,
      telefone,
      senhaHash: await gerarHash(senha),
      versaoSessao: 0,
      tipo: papel === 'cuidador' ? 'cuidador' : 'cliente',
      criadoEm: agora(),
      consentimentoEm: agora(),
    });

    const perfil = papel === 'cuidador'
      ? await repo.inserir('cuidadores', {
        usuarioId: usuario.id,
        experiencia: profissional.experiencia,
        servicos: profissional.servicos,
        qualificacoes: [],
        referencias: [],
        localizacao: { cidade: '', bairro: '' },
        disponibilidade: { descricao: '', dias: profissional.dias, inicio: profissional.inicio, fim: profissional.fim },
      })
      : await repo.inserir('clientes', { usuarioId: usuario.id, relacao: papel === 'idoso' ? 'proprio' : 'familiar' });

    if (dadosIdoso) await criarIdoso(repo, perfil, dadosIdoso);
    if (convite) await usarConvite(repo, convite, { usuario, perfil, papel });

    res.set('Set-Cookie', cookieDeEntrada(usuario));
    res.status(201).json({ ...semSegredos(usuario), papel });
  });

  r.post('/sair', (req, res) => {
    res.set('Set-Cookie', cookieDeSaida());
    res.status(204).end();
  });

  return r;
}
