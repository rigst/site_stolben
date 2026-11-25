# site_stolben

[![CI](https://github.com/rigst/site_stolben/actions/workflows/ci.yml/badge.svg)](https://github.com/rigst/site_stolben/actions/workflows/ci.yml)
[![Licença: AGPL v3](https://img.shields.io/badge/licen%C3%A7a-AGPL--3.0-blue.svg)](LICENSE)

Site/portfólio de Rodrigo Stölben ([stolben.com](https://stolben.com)).
Estático: HTML, CSS e JavaScript escritos à mão, sem build e sem dependências.

## Rodar localmente

Não há passo de build. Qualquer servidor estático serve:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000/
```

Abrir o `index.html` direto pelo `file://` também funciona, mas alguns
caminhos absolutos só resolvem servindo pela raiz.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Home: projetos, como eu construo, sobre e contato |
| `bastidores/index.html` | `/bastidores/`: CI/CD, monitoramento e servidor |
| `privacidade/index.html` | `/privacidade/`: privacidade, LGPD, termos e licenças |
| `404.html` | Página de erro (precisa de `error_page 404 /404.html;` no nginx) |
| `style.css` | Estilos de todas as páginas (redesign v1: grafite, Mona Sans, laranja-sinal só em detalhe) |
| `script.js` | Lista "no ar agora" da home, lida do `/status.json` |
| `assets/` | Foto do Sobre e a logo (`assets/logo/`) |
| `fonts/` | Mona Sans (variável, `wght` + `wdth`) e Geist Mono, servidas localmente |
| raiz | `favicon.svg`/`.ico`, `apple-touch-icon.png`, `icone-*.png`, `site.webmanifest`, `og-image.png` |

Todos os caminhos são absolutos (`/style.css`), porque as páginas internas
ficam em subpastas e a 404 é servida em qualquer URL.

## Editar os projetos do portfólio

As linhas ficam em `index.html`, na seção `<section id="projetos">`, agrupadas
por categoria. Cada linha é um `<a class="row">` apontando para o sistema em
produção, com nome (`.nm`), descrição (`.d`) e domínio (`.u`). Sem imagem e
sem numeração (regra do design).

Para o domínio entrar na lista "no ar agora", inclua também um
`<li data-host="...">` na `.live-list` e o host em `.scripts/check-status.sh`.
Um host que aparece no `status.json` e não está no HTML é acrescentado no fim
da lista pelo `script.js`.

## CI

O pipeline é o compartilhado de [rigst/ci](https://github.com/rigst/ci): varredura
de segredos com `gitleaks` sobre todo o histórico e verificação de que todo
`href`/`src` local aponta para um arquivo que existe.

## Deploy contínuo

O merge de um PR em `main` que passar no CI é publicado sozinho — `deploy/cd-deploy.sh`
(disparado por SSH pelo `deploy-static.yml` do `rigst/ci`) faz só um `git
fetch` + `merge --ff-only` no checkout que o nginx serve direto como `root`;
não há build nem restart. A branch `main` tem proteção ativa (checks
obrigatórios, sem push direto nem pra admin); mudanças sempre entram por PR,
sem exigir aprovação de terceiros. Procedimento completo: RUNBOOK.md do `rigst/ci`,
seção 7.

## Licença

[AGPL-3.0](LICENSE) — Copyright (C) 2026 Rodrigo Caballero Stölben.

A licença cobre o código (HTML, CSS, JavaScript). Ela **não** concede direito de
uso da identidade visual, do nome, das fotografias ou dos textos biográficos:
esses são conteúdo pessoal, e reaproveitá-los criaria um site que se passa por
outra pessoa. Use o código, troque o conteúdo.

## Cabeçalhos de segurança

O site é servido direto pelo nginx, então os cabeçalhos (HSTS, CSP, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP) ficam em `deploy/nginx-seguranca.conf`. Instalação, uma vez:

```bash
sudo cp /var/www/site_stolben/deploy/nginx-seguranca.conf /etc/nginx/snippets/stolben-seguranca.conf
# em /etc/nginx/sites-available/site_stolben, dentro do server{} da porta 443:
#   include /etc/nginx/snippets/stolben-seguranca.conf;
sudo nginx -t && sudo systemctl reload nginx
```

A CSP não aceita estilo nem script inline. Desde o redesign v1 as páginas não têm nenhum script inline (o hash que segue no snippet era do antigo efeito de surgimento e pode sair numa próxima revisão da CSP). Conferência diária no rigst/ci (`headers.yml`).
