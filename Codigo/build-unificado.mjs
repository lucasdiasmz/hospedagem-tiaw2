/* Junta a página inicial e as 8 telas num site só (usado pelo deploy único na Vercel; veja Codigo/HOSPEDAGEM.md).
   A página inicial fica na raiz de dist/; cada tela, numa subpasta (ex.: dist/inicio/). O vercel.json
   da raiz repassa /srv/<api>/... para as APIs no Render.
   Rodar da raiz do repositório:  node Codigo/build-unificado.mjs */
import { execSync } from 'node:child_process';
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');
const saida = join(raiz, 'dist');

/* pasta do módulo → caminho no site (os mesmos de src/navegacao.js) */
const TELAS = [
  ['Codigo/pagina-inicial', ''],
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
  const base = caminho ? `/${caminho}/` : '/';
  console.log(`\n== ${pasta} → ${base}`);
  /* na Vercel as dependências ainda não existem; no computador, reaproveita as já instaladas */
  if (!existsSync(join(dir, 'node_modules'))) execSync('npm ci --no-audit --no-fund', { cwd: dir, stdio: 'inherit' });
  execSync(`npx vite build --base=${base} --outDir "${join(saida, caminho)}" --emptyOutDir`, {
    cwd: dir,
    stdio: 'inherit',
    env: { ...process.env, VITE_SITE_UNICO: '1' },
  });
}

/* endereço que não existe (a Vercel usa este arquivo sozinha) */
writeFileSync(
  join(saida, '404.html'),
  `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AcessaMob | Página não encontrada</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f8f9f8; color: #142420; font: 18px/1.5 Inter, system-ui, sans-serif; }
    main { padding: 24px; text-align: center; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    a { display: inline-block; margin-top: 16px; padding: 14px 24px; border-radius: 999px; background: #16463d; color: #fff; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <h1>Página não encontrada</h1>
    <p>Confira o endereço ou volte para o começo.</p>
    <a href="/">Ir para o AcessaMob</a>
  </main>
</body>
</html>
`
);

console.log('\nSite único pronto em dist/');
