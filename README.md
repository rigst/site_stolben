# site_stolben

[![CI](https://github.com/rigst/site_stolben/actions/workflows/ci.yml/badge.svg)](https://github.com/rigst/site_stolben/actions/workflows/ci.yml)
[![Licença: AGPL v3](https://img.shields.io/badge/licen%C3%A7a-AGPL--3.0-blue.svg)](LICENSE)

Site/portfólio de página única de Rodrigo Stölben ([stolben.com](https://stolben.com)).
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
| `index.html` | Conteúdo e marcação da página |
| `style.css` | Estilos (tema "Infra Premium": claro/escuro, azul como acento) |
| `script.js` | Surgimento ao rolar, scrollspy do menu e cabeçalho fixo |
| `assets/` | Imagens (hero, capas dos projetos) |
| `fonts/` | Fontes servidas localmente |
| `design-system/` | Tokens e componentes reaproveitáveis |
| `stolben-ui/` | Biblioteca de UI compartilhada entre os projetos |
| `orcamentos-ui-nova/` | Protótipo estático de UI, para revisão antes de virar template |

## Editar os projetos do portfólio

Os cards ficam em `index.html`, na seção `<section id="projects">`. Cada card é
um `<a class="card ...">` apontando para o sistema em produção. Para adicionar
um, copie um card existente e ajuste:

- o `href` (URL do sistema);
- o número (`<span class="num">`), o título (`<h3>`) e a descrição (`<p>`);
- a imagem de capa em `assets/` — sempre com `width` e `height` na tag `<img>`,
  para não causar deslocamento de layout durante o carregamento.

## CI

O pipeline é o compartilhado de [rigst/ci](https://github.com/rigst/ci): varredura
de segredos com `gitleaks` sobre todo o histórico e verificação de que todo
`href`/`src` local aponta para um arquivo que existe.

## Licença

[AGPL-3.0](LICENSE) — Copyright (C) 2026 Rodrigo Caballero Stölben.

A licença cobre o código (HTML, CSS, JavaScript). Ela **não** concede direito de
uso da identidade visual, do nome, das fotografias ou dos textos biográficos:
esses são conteúdo pessoal, e reaproveitá-los criaria um site que se passa por
outra pessoa. Use o código, troque o conteúdo.
