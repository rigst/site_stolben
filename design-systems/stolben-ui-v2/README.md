# Stölben UI v2 — "A folha"

Sistema de design para **aplicações de trabalho**: telas em que alguém passa o
dia inteiro cadastrando, conferindo e decidindo. Extraído do sistema visual do
**A.R.Q.** (`/var/www/sistema_arq`) e generalizado para qualquer app.

CSS puro + JS puro. Sem build, sem dependência, sem requisição externa.
Funciona em Django templates, HTML estático, React, o que for.

> **v1 e v2 são sistemas irmãos, não sucessivos.** O [v1](../stolben-ui-v1/)
> ("Infra Premium") é para **site e marketing**: blocos arredondados, escuro e
> claro alternados, atmosfera. O v2 é para **ferramenta**: papel, filete,
> densidade, nenhum brilho. Escolher pelo uso, não pela data. Ver o
> [índice dos sistemas](../README.md).

---

## Arquivos

| Arquivo | O que é |
|---|---|
| `stolben-ui.css` | Tokens + componentes. Único arquivo de estilo. |
| `stolben-ui.js` | Comportamentos opcionais. A página funciona sem ele. |
| `index.html` | Galeria viva: todo componente, em tamanho real. Abrir primeiro. |
| `fonts/` | IBM Plex Sans/Mono e Archivo em woff2 (SIL OFL 1.1). |
| `img/` | Fotos de exemplo do casco e das faixas. Trocar pelas do app. |
| `templates/` | Telas prontas para copiar: login, lista, ficha, formulário. |
| `DEPLOY-EM-APPS.md` | Como instalar num app existente e como migrar do v1. |
| `AGENTS.md` | Regras para quem (ou o que) for mexer no sistema. |

## Instalar

```html
<html lang="pt-br" class="ds-root ds-tema-verde">
<head>
  <link rel="stylesheet" href="/static/css/stolben-ui.css">
</head>
<body class="ds-shell" style="--ds-fundo: url('/static/img/fundo.jpg')">
  ...
  <script src="/static/js/stolben-ui.js"></script>
</body>
```

`ds-root` vai na raiz — é o escopo de todos os tokens. As fontes são resolvidas
com caminho relativo ao CSS, então `fonts/` precisa ficar ao lado dele.
Detalhes e pegadinhas em [DEPLOY-EM-APPS.md](DEPLOY-EM-APPS.md).

---

## Os cinco princípios

1. **O conteúdo é impresso na folha.** Superfície com moldura (`.ds-obj`) existe
   para um caso só: objeto repetido numa grade, onde a caixa é o que separa um
   do outro. Em qualquer outro lugar ela é ruído. Seção é `.ds-bloco` — sem
   fundo, sem borda, separada por respiro e pela cota.

2. **Rótulo é mono, versal, espaçado.** Todo rótulo, cabeçalho de tabela e `dt`
   usa IBM Plex Mono em 0,68 rem com `letter-spacing: .14em`. É o que faz o dado
   parecer dado, e não texto corrido. Todo número usa `.num` (tabular, zero
   cortado): a coluna alinha sozinha, sem largura fixa.

3. **Cor de camada é filete, nunca fundo.** As cinco camadas — azul, verde,
   âmbar, violeta, terra — são as áreas do trabalho. Entram na cota, no tique do
   indicador, na barra do item de calendário. Fundo chapado colorido não existe
   neste sistema.

4. **Movimento contido.** 130 ms, um pixel no clique, nenhum brilho e nenhuma
   sombra difusa. Isto é ferramenta: o controle confirma que foi acionado e sai
   da frente.

5. **Luz só.** Não há modo escuro, e não é esquecimento: a metáfora é papel.
   O sistema declara `color-scheme: light` para que o navegador não pinte
   controles nativos de escuro. Quem precisa de tela escura precisa de outro
   sistema — o v1 tem.

## As três assinaturas

O que faz este sistema ser este, e não outro claro com acento verde. As três
vêm da prancha técnica, e **cada uma carrega informação** — nenhuma é enfeite.

**Cota** (`.ds-secao-titulo`) — a régua com tique nas pontas que abre toda
seção. Mede o vão entre o título e a margem, e por isso ocupa exatamente o que
sobra. Herda a cor da camada.

**Poché** (`.ds-poche`, `.ds-vazio`) — a hachura a 45° com que o arquiteto
preenche o que foi cortado. Aqui marca o que **não** foi preenchido: vazio,
bloqueado, indisponível. O estado vazio deixa de ser buraco e vira convite.

**Carimbo** (`.ds-carimbo`) — o bloco de identificação da prancha: campos lado a
lado, divididos por filete, entre duas réguas. Cabeçalho de dados sem caixa.

---

## Tokens

Todos vivem em `.ds-root` e podem ser sobrescritos por app, por tela ou por
bloco. Os nomes antigos do A.R.Q. (`--ds-text-900` etc.) continuam valendo como
apelido.

```
Papel        --ds-bg --ds-panel --ds-surface --ds-ink --ds-ink-soft
Filete       --ds-line --ds-line-dash --ds-line-dark
Texto        --ds-t-900 --ds-t-700 --ds-t-500   (t-500 é o piso do texto: AA)
             --ds-t-400  decorativo — marcador, ícone, filete. Nunca texto.
Sobre escuro --ds-on-dark --ds-on-dark-dim --ds-on-dark-faint
Camadas      --ds-camada-azul --ds-camada-verde --ds-camada-ambar
             --ds-camada-violeta --ds-camada-terra
Acento       --ds-accent (+ -light -dark -50 -100 -fg -on-dark, derivados)
Estado       --ds-danger --ds-warn --ds-success --ds-info
Tipografia   --ds-font-sans --ds-font-display --ds-font-mono --ds-fs-base
Ritmo        --ds-gap --ds-lateral --ds-folha --ds-leitura
             --ds-radius --ds-radius-sm --ds-control-y --ds-control-x
Movimento    --ds-ease --ds-ease-out --ds-fast --ds-mid
Foco/sombra  --ds-focus-ring --ds-shadow-soft
Camada atual --sec (a cor da seção corrente; ver .ds-camada--*)
Fotos        --ds-fundo (casco) --ds-foto (faixa) --ds-foto-login
```

### Temas de acento

Classe na raiz. Só o acento muda; papel, filete e tipografia continuam iguais.

```html
<html class="ds-root ds-tema-azul">
```

`ds-tema-verde` (padrão) · `ds-tema-azul` · `ds-tema-ambar` ·
`ds-tema-violeta` · `ds-tema-terra` · `ds-tema-grafite`

`--ds-accent-light/dark/50/100/on-dark` são derivados por `color-mix`: definir
`--ds-accent` com qualquer cor já produz a família inteira.

### Camadas numa seção

```html
<section class="ds-bloco ds-camada--ambar">
  <h2 class="ds-secao-titulo">Escritório</h2>   <!-- a cota fica âmbar -->
</section>
```

---

## Componentes

| Grupo | Classes |
|---|---|
| Casco | `.ds-shell` `.ds-side` `.ds-side-head` `.ds-side-foot` `.ds-side-rodape` `.ds-frame` `.ds-main` `.ds-main--solta` |
| Navegação | `.ds-nav` `.ds-nav-grupo` `.ds-nav-label` `.ds-nav-link` `.ds-nav-badge` `.ds-burger` `.ds-nav-toggle` `.ds-side-link` |
| Marca e conta | `.ds-brand` `.ds-brand-mark` `.ds-brand-word` `.ds-brand-logo` `.ds-conta` |
| Página | `.ds-page` `.ds-page-head` `.ds-page-head--linha` `.ds-faixa` `.ds-acoes` `.ds-voltar` `.ds-contexto` |
| Texto | `.ds-h1` `.ds-h2` `.ds-h3` `.ds-display` `.ds-kicker` `.ds-sub` `.ds-muted` `.num` |
| Assinaturas | `.ds-secao-titulo` `.ds-secao-sub` `.ds-carimbo` `.ds-poche` `.ds-vazio` |
| Ações | `.ds-btn` (`--solid` `--danger` `--ghost` `--pequeno` `--bloco` `--novo`) `.ds-btn-ico` `.ds-chip` `.ds-form-actions` |
| Dados | `.ds-table` `.ds-table-scroll` `.ds-kpi-row` `.ds-kpi` `.ds-quadro` `.ds-def` `.ds-metricas` `.ds-obj` `.ds-grid` `.ds-etapas` |
| Formulário | `.ds-form` (`--duas`) `.ds-campo` `.ds-marcar` `.ds-inline-add` `.ds-passo` `.ds-ajuda` `.ds-erro-campo` |
| Situação | `.ds-badge` (`--info` `--ok` `--atencao` `--perigo` `--mudo`) `.ds-alerta` `.ds-progress` |
| Sobreposto | `.ds-avisos` `.ds-aviso` `.ds-modal` |
| Tempo e recado | `.ds-cal` `.ds-cal-item` `.ds-lembrete` |
| Entrada | `.ds-auth` `.ds-auth-quadro` `.ds-auth-hero` `.ds-auth-card` |

Todos em tamanho real, com o HTML ao lado, em [`index.html`](index.html).

## JavaScript

Sete comportamentos, todos opcionais — **nenhuma tela depende deles para ser
lida ou enviada**:

1. Indicadores contam até o valor mantendo o formato pt-BR do HTML.
2. `.ds-progress-fill[data-ds-progresso="62"]` preenche ao entrar.
3. Botão que envia formulário ganha `.is-busy` (e destrava em 8 s se nada acontecer).
4. Avisos somem em 6 s; o ponteiro em cima segura o relógio.
5. `[data-ds-abre="id"]` abre `<dialog class="ds-modal">`; o foco volta ao gatilho.
6. `<input data-ds-moeda>` escreve `1.234,56` e envia `1234.56`.
7. Gaveta da lateral no mobile (o CSS já abre; o JS cuida do `aria-expanded`).

API pública:

```js
dsToast("Projeto salvo.", "success");   // success | warn | danger | info
dsUI.iniciar(elemento);                 // religar num trecho recém-trocado
```

Com htmx presente, `htmx:afterSwap` religa sozinho.

## Acessibilidade

Contraste AA em **todo** texto do sistema, verificado medindo o pixel
renderizado (o único jeito honesto com `backdrop-filter` no meio). `--ds-t-500`
é o piso: 4,8:1 sobre o papel. `--ds-t-400` fica abaixo do AA de propósito e
por isso **não é tom de texto** — serve para marcador, ícone e filete.

A lateral tem véu escuro próprio sob o vidro: sem ele, o contraste da navegação
dependeria da foto que cada app escolhe em `--ds-fundo`, e uma foto clara
derrubava os rótulos de grupo para 2,7:1. Pelo mesmo motivo o título do login
tem sombra — foto não tem contraste previsível.

Estado nunca é dito só pela cor: fase bloqueada tem marcador e etiqueta, além
do tom. Foco sempre visível, em traço e não em sombra. `prefers-reduced-motion`,
`prefers-reduced-transparency` e `prefers-contrast: more` são respeitados. Há
`.ds-pular` para pular a navegação e `.ds-sr` para texto só de leitor de tela.
O `@media print` devolve a folha ao papel: some a lateral, somem os botões.

## Licença

O código segue a licença do repositório (AGPL-3.0). As fontes são de terceiros
sob SIL OFL 1.1 — ver [`fonts/LICENSES.md`](fonts/LICENSES.md).
