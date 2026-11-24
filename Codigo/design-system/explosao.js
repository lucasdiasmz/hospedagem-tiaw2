/* Easter egg: o site "explode". Treme a tela, dá um clarão, cada pedaço da página sai voando
   com estilhaços e no fim aparece um aviso com o botão para reconstruir (recarrega a página).
   Só usa a Web Animations API, sem bibliotecas. Com "reduzir movimento" ligado, vira só um clarão. */

const CORES = ['#1d63dc', '#6f97e3', '#f0a020', '#c42b23', '#12784a', '#ffffff'];

function aleatorio(min, max) {
  return min + Math.random() * (max - min);
}

function criar(tag, estilo, texto) {
  const el = document.createElement(tag);
  Object.assign(el.style, estilo);
  if (texto) el.textContent = texto;
  return el;
}

/* pedaços visíveis da página: os blocos "folha" (títulos, botões, campos, imagens...) */
function pedacos(raiz) {
  const seletor = 'h1, h2, h3, p, span, button, input, select, textarea, img, svg, label, li, a, small, strong, time, .tag, .card';
  return [...raiz.querySelectorAll(seletor)].filter((el) => {
    if (el.closest('[data-explosao]')) return false;
    if (el.parentElement?.closest(seletor)) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < (document.documentElement.clientHeight || innerHeight);
  });
}

function aviso(camada) {
  const caixa = criar('div', {
    position: 'fixed', inset: '0', display: 'grid', placeItems: 'center', zIndex: '1002',
  });
  caixa.dataset.explosao = '';
  const cartao = criar('div', {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '28px 32px',
    borderRadius: '28px', background: '#0c2152', color: '#fff', textAlign: 'center',
    boxShadow: '0 24px 48px -16px rgba(0,0,0,.5)', maxWidth: 'calc(100% - 32px)',
    fontFamily: 'Inter, system-ui, sans-serif',
  });
  cartao.setAttribute('role', 'alertdialog');
  cartao.setAttribute('aria-label', 'O site explodiu');
  const boom = criar('strong', { fontSize: '64px', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1', color: '#f0a020' }, 'BOOM');
  const texto = criar('p', { margin: '0', fontSize: '17px', color: '#e8eefb' }, 'Esse nome o AcessaMob não aceita.');
  const botao = criar('button', {
    minHeight: '48px', padding: '0 24px', border: '0', borderRadius: '14px', background: '#fff',
    color: '#0c2152', font: '600 17px Inter, system-ui, sans-serif', cursor: 'pointer',
  }, 'Reconstruir o site');
  botao.type = 'button';
  botao.addEventListener('click', () => window.location.reload());
  cartao.append(boom, texto, botao);
  caixa.append(cartao);
  camada.append(caixa);
  cartao.animate(
    [{ transform: 'scale(.4) rotate(-8deg)', opacity: 0 }, { transform: 'scale(1.08) rotate(2deg)', opacity: 1, offset: 0.7 }, { transform: 'none', opacity: 1 }],
    { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
  );
  botao.focus();
}

let explodindo = false;

export function explodir() {
  if (explodindo) return;
  explodindo = true;
  document.activeElement?.blur?.();

  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const camada = criar('div', { position: 'fixed', inset: '0', zIndex: '1000', pointerEvents: 'none', overflow: 'hidden' });
  camada.dataset.explosao = '';
  document.body.append(camada);

  /* clarão alaranjado a partir do centro */
  const clarao = criar('div', {
    position: 'fixed', inset: '0', zIndex: '1001',
    background: 'radial-gradient(circle at 50% 45%, #fff 0%, #ffd27a 25%, #f0a020 45%, rgba(196,43,35,.85) 70%, rgba(12,33,82,.95) 100%)',
  });
  camada.append(clarao);
  clarao.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 0.9, offset: 0.5 }, { opacity: 0.82 }], { duration: 1800, fill: 'forwards' });

  if (reduzido) {
    setTimeout(() => aviso(camada), 500);
    return;
  }

  /* a tela treme */
  document.body.animate(
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ transform: i === 8 ? 'none' : `translate(${aleatorio(-14, 14)}px, ${aleatorio(-10, 10)}px) rotate(${aleatorio(-1.5, 1.5)}deg)` })),
    { duration: 450, easing: 'linear' },
  );

  /* cada pedaço da página sai voando para longe do centro */
  /* tamanho visível da tela (clientWidth é mais confiável que innerWidth em celular com zoom) */
  const largura = document.documentElement.clientWidth || innerWidth;
  const altura = document.documentElement.clientHeight || innerHeight;
  const cx = largura / 2;
  const cy = altura * 0.45;
  pedacos(document.body).forEach((el) => {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - cx;
    const dy = r.top + r.height / 2 - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const forca = aleatorio(500, 1100);
    el.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translate(${(dx / dist) * forca}px, ${(dy / dist) * forca + aleatorio(100, 400)}px) rotate(${aleatorio(-540, 540)}deg) scale(${aleatorio(0.3, 1.2)})`, opacity: 0 },
      ],
      { duration: aleatorio(900, 1500), delay: 350 + aleatorio(0, 120), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' },
    );
  });

  /* estilhaços coloridos */
  for (let i = 0; i < 70; i++) {
    const tamanho = aleatorio(6, 18);
    const caco = criar('span', {
      position: 'fixed', left: cx + 'px', top: cy + 'px', width: tamanho + 'px', height: tamanho * aleatorio(0.4, 1) + 'px',
      background: CORES[i % CORES.length], borderRadius: i % 3 ? '2px' : '50%', zIndex: '1001',
    });
    camada.append(caco);
    const angulo = aleatorio(0, Math.PI * 2);
    const alcance = aleatorio(200, Math.max(largura, altura));
    caco.animate(
      [
        { transform: 'translate(-50%, -50%) scale(.2)', opacity: 1 },
        { transform: `translate(${Math.cos(angulo) * alcance}px, ${Math.sin(angulo) * alcance + 200}px) rotate(${aleatorio(-720, 720)}deg) scale(1)`, opacity: 0 },
      ],
      { duration: aleatorio(1000, 1800), delay: 300, easing: 'cubic-bezier(.1,.8,.3,1)', fill: 'forwards' },
    );
  }

  setTimeout(() => aviso(camada), 1700);
}

/* o nome que detona: qualquer nome com "Jeffrey E" (sem diferenciar maiúsculas e acentos) */
export function nomeDetona(nome) {
  /* tira os acentos (NFD separa a letra do acento) e espaços repetidos */
  const limpo = nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
  return limpo.includes('jeffrey e');
}
