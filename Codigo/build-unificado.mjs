/* Junta as 8 telas num site só (usado pelo deploy único na Vercel; veja Codigo/HOSPEDAGEM.md).
   Cada tela é construída com o Vite numa subpasta de dist/ (ex.: dist/inicio/), e o vercel.json
   da raiz repassa /srv/<api>/... para as APIs no Render.
   Rodar da raiz do repositório:  node Codigo/build-unificado.mjs */
import { execSync } from 'node:child_process';
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');
const saida = join(raiz, 'dist');

/* pasta do módulo → caminho no site (os mesmos de src/navegacao.js) */
const TELAS = [
  ['Codigo/boas-vindas', 'boas-vindas'],
  ['Codigo/inicio', 'inicio'],
  ['Codigo/agenda', 'agenda'],
  ['Codigo/medicamentos', 'medicamentos'],
  ['Codigo/cadastro-medicamentos', 'cadastro-medicamentos'],
  ['Codigo/tarefas', 'tarefas'],
  ['Codigo/cuidadores', 'cuidadores'],
  ['Codigo/perfil-linha-do-tempo/frontend', 'idoso'],
];

rmSync(saida, { recursive: true, force: true });
mkdirSync(saida, { recursive: true });

for (const [pasta, caminho] of TELAS) {
  const dir = join(raiz, pasta);
  console.log(`\n== ${pasta} → /${caminho}/`);
  /* na Vercel as dependências ainda não existem; no computador, reaproveita as já instaladas */
  if (!existsSync(join(dir, 'node_modules'))) execSync('npm ci --no-audit --no-fund', { cwd: dir, stdio: 'inherit' });
  execSync(`npx vite build --base=/${caminho}/ --outDir "${join(saida, caminho)}" --emptyOutDir`, {
    cwd: dir,
    stdio: 'inherit',
    env: { ...process.env, VITE_SITE_UNICO: '1' },
  });
}

/* a raiz do site abre a tela de boas-vindas */
writeFileSync(
  join(saida, 'index.html'),
  '<!DOCTYPE html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/boas-vindas/">' +
    '<title>AcessaMob</title><a href="/boas-vindas/">AcessaMob</a>\n'
);

console.log('\nSite único pronto em dist/');
