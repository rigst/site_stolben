# Stölben UI — Design System

Sistema de design extraído do site **stolben.com** (tema *Infra Premium*), voltado
à construção de **aplicativos web reais (CRUD)**: listagens, formulários, modais,
dashboards. CSS puro + um JS opcional, sem build — funciona em qualquer stack
(Django templates, HTML estático, React, etc.).

> Showcase visual: abra **`index.html`** (fontes, cores, componentes e um exemplo
> de tela CRUD completa).

> Substitui e amplia o `design-system/` anterior. Use este para apps novos.

## Arquivos

| Arquivo | O que é |
|---|---|
| `stolben-ui.css` | Tokens (variáveis CSS) + todos os componentes (prefixo `.ds-`) |
| `stolben-ui.js`  | Comportamentos opcionais (reveal, modal, menu, tabs, toast, tabela) |
| `index.html`     | Página de showcase / styleguide vivo |
| `AGENTS.md`      | **Guia para IA**: como construir telas com este DS (design + acessibilidade) |
| `img/`           | Imagens reais de licença livre usadas nos exemplos |

> **Construindo com IA?** Leia o **[`AGENTS.md`](AGENTS.md)** — regras de design,
> checklist de acessibilidade e receitas de tela (lista, formulário, detalhe).

## Como usar

No `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/static/stolben-ui/stolben-ui.css">
```

Adicione a classe `ds-root` no elemento raiz (`<body class="ds-root">`) e, antes do
`</body>`:

```html
<script src="/static/stolben-ui/stolben-ui.js"></script>
```

O JS adiciona `js` no `<html>` (para o reveal degradar sem JavaScript) e inicializa
tudo via *data-attributes*.

---

## Princípios de design

1. **Azul como único acento.** Tudo é cinza/preto/branco; o azul (`--ds-blue`) marca
   ações, foco e seleção. Cores semânticas (sucesso/atenção/erro) só para estados.
2. **Tipografia com função.** Títulos em **Manrope** (600, tracking negativo); texto
   em **Inter**. Segunda linha de título em cinza (`.ds-muted`) cria ritmo.
3. **Ritmo claro ↔ escuro.** Cartões claros e painéis escuros (`.ds-panel-dark`) se
   alternam. Nunca empilhe dois blocos escuros pesados seguidos.
4. **Atmosfera sutil.** Glow desfocado (`.ds-glow`), ruído (`.ds-noise`) e linhas
   tracejadas (`.ds-lines`) dão profundidade sem poluir.
5. **Imagens reais, livres.** Foto de workspace/código/servidores (ex.: Unsplash) com
   gradiente de leitura. Nunca render 3D/"cara de IA" nem stock clichê. Sempre com
   `width`/`height` (evita "pulo" de layout).
6. **Movimento discreto.** Entradas suaves ao rolar e hovers leves, sempre
   respeitando `prefers-reduced-motion`.
7. **Acessível por padrão.** HTML semântico, rótulos clicáveis, foco visível,
   ícones decorativos com `aria-hidden`, `tabular-nums` em números/tabelas.

---

## Temas de acento (cor por aplicativo)

O azul é o padrão, mas **cada app pode usar uma cor de acento diferente**. Basta
uma classe no `<body class="ds-root">`:

```html
<body class="ds-root ds-theme-violet">   <!-- ou indigo, teal, emerald, amber, rose, slate -->
```

Todos os componentes seguem `--ds-accent*` (botões, foco, links ativos, seleção,
badges *info*, glows…). Os estados **success / warn / danger** não mudam (continuam
verde / âmbar / vermelho). Para uma cor própria, defina os 5 tokens:

```css
.ds-theme-minha { --ds-accent:#0ea5e9; --ds-accent-light:#38bdf8; --ds-accent-dark:#0284c7; --ds-accent-50:#f0f9ff; --ds-accent-100:#e0f2fe; }
```

> Evite escolher um acento idêntico ao verde de sucesso ou ao vermelho de erro,
> para não confundir ação com estado.

## Tema claro e escuro

Modo claro (padrão) e escuro. Aplique `ds-dark` no `<html>` (funciona com qualquer
`.ds-theme-*`):

```html
<html class="ds-dark"> … </html>
```

Controle de 3 modos — **claro / automático / escuro** (`auto` segue o sistema e é
o padrão). O JS aplica a classe, guarda a preferência em `localStorage` e, em
`auto`, reage a mudanças do sistema ao vivo:

```html
<div class="ds-segment ds-mode" data-ds-theme-mode role="group" aria-label="Tema">
  <button type="button" data-mode="light" aria-label="Tema claro">…sol…</button>
  <button type="button" data-mode="auto"  aria-label="Tema automático">…◐…</button>
  <button type="button" data-mode="dark"  aria-label="Tema escuro">…lua…</button>
</div>
```

> Variante simples (2 estados): um `<button data-ds-dark-toggle>` que alterna
> claro/escuro. Os modos persistem em `localStorage` (`ds-theme-mode`).

Para evitar "flash", leia a preferência no `<head>`, antes do CSS:

```html
<script>(function(){var e=document.documentElement;e.classList.add("js");
try{var m=localStorage.getItem("ds-theme-mode");
if(m==="dark"||(!m&&matchMedia("(prefers-color-scheme:dark)").matches))e.classList.add("ds-dark");}catch(x){}})();</script>
```

O escuro usa **cinzas suaves (sem preto puro)**, texto off-white e **acento
clareado** (`--ds-accent-fg`) para leitura confortável; sucesso/atenção/erro
ganham versões legíveis no escuro. Para texto forte (valores) use
`--ds-text-strong` (não `--ds-ink`, que é superfície escura).

## Templates prontos (`templates/`)

Pontos de partida para copiar. Cada um usa um **tema** e uma **visualização de
lista** diferentes, sobre o mesmo shell (sidebar + topbar):

| Arquivo | Tema | Visualização |
|---|---|---|
| `01-admin-tabela.html`   | indigo | **Tabela** (⇄ cards), stats, drawer de edição, paginação |
| `02-catalogo-cards.html` | teal   | **Grade de cards** (⇄ lista), filtros |
| `03-board-colunas.html`  | amber  | **Board / colunas** (kanban) |

## Visualizações de lista

Mesma informação, leituras diferentes — sempre com **só o essencial em destaque**
(título forte › valor › status › meta discreta):

- **Tabela** `.ds-table` — densidade alta, comparação por colunas.
- **Grade de cards** `.ds-record` (em `.ds-grid--3/4`) — visual, com miniatura.
- **Lista compacta** `.ds-list` / `.ds-list-item` — leitura rápida, mobile.
- **Board** `.ds-board` / `.ds-board-col` / `.ds-board-card` — fluxo por status.
- **Gráfico de barras** `.ds-chart` / `.ds-chart-col` / `.ds-chart-bar` — métricas (dashboard).
- **Timeline** `.ds-timeline` / `.ds-timeline-item` — feed de atividade cronológico.

Alternador: `.ds-segment` com `data-view="x"` dentro de `[data-ds-views]`; os blocos
são `[data-view-panel="x"]` (o JS mostra/esconde).

## Tokens (principais)

```
Superfícies   --ds-bg --ds-panel --ds-surface --ds-ink --ds-ink-soft
Acento        --ds-blue --ds-blue-light --ds-blue-dark --ds-blue-50 --ds-blue-100
Estados       --ds-success --ds-warn --ds-danger --ds-info (+ -50 / -100)
Texto         --ds-t-900/700/500/400  + sobre escuro --ds-on-dark*
Linhas        --ds-line --ds-line-strong --ds-line-dash
Tipografia    --ds-font-sans --ds-font-display --ds-fs-hero/h1/h2/h3
Raios         --ds-radius-xl(2.5) lg(1.5) md(1) sm(.6) pill
Espaço        --ds-space-1..16 (escala de 4px)
Sombras       --ds-shadow-sm/card/block/glow-blue/menu
Movimento     --ds-ease --ds-dur-fast/dur/dur-slow
```

Use sempre `var(--ds-…)` no lugar de valores soltos.

---

## Componentes

**Layout:** `.ds-app` (shell de site), `.ds-shell` + `.ds-sidebar` (admin/CRUD),
`.ds-main`, `.ds-lines`, `.ds-noise`, `.ds-glow`, `.ds-panel-dark`, `.ds-surface`,
`.ds-media` + `.ds-media-grad` (foto de fundo).

**Tipografia:** `.ds-display`, `.ds-h1..h3`, `.ds-lead`, `.ds-kicker`, `.ds-muted`,
`.ds-mono`.

**Ações:** `.ds-btn` (`--solid`, `--primary`, `--ghost`, `--subtle`, `--danger`,
tamanhos `--sm`/`--lg`, `--block`, `--icon`), `.ds-icon-btn`.

**Navegação:** `.ds-topbar` (+ `--dark`), `.ds-topbar-nav`, `.ds-sidebar-link`,
`.ds-breadcrumb`, `.ds-avatar`, `.ds-tabs`/`.ds-tab`, `.ds-menu` (dropdown),
`.ds-pagination`, `.ds-segment` (filtros).

**Conteúdo:** `.ds-card` (+ `--hover`), `.ds-stat`, `.ds-icon-box`, `.ds-badge`
(`--neutral/info/success/warn/danger`), `.ds-dl` (detalhe), `.ds-chip`,
`.ds-accordion`, `.ds-kbd`, `.ds-count`, `.ds-empty`, `[data-ds-tip]` (tooltip).

**Formulários:** `.ds-field`, `.ds-label`, `.ds-input`, `.ds-textarea`,
`.ds-select`, `.ds-search`, `.ds-check`, `.ds-radio`, `.ds-switch`, `.ds-dropzone`,
`.ds-help` (+ `--error`), `.ds-input--invalid`.

**Dados:** `.ds-table` + `.ds-table-wrap` (hover, seleção, `aria-sort`,
`.ds-row-actions`), `.ds-toolbar`.

**Feedback:** `.ds-alert` (4 tipos), `.ds-toast` (+ `window.dsToast(msg, tipo)`),
`.ds-modal` / `.ds-drawer` (slide-over) / `.ds-overlay`, `.ds-progress`,
`.ds-spinner`, `.ds-skeleton`.

### Comportamentos (data-attributes)

```html
<header data-ds-topbar>…</header>              <!-- sombra ao rolar -->
<nav data-ds-spy>…<a href="#sec">…</a></nav>   <!-- destaca a seção atual -->
<div class="ds-reveal">…</div>                  <!-- surge ao rolar -->
<span data-ds-menu><button data-ds-menu-trigger>…</button><div class="ds-menu">…</div></span>
<button data-ds-open="meu-modal">Abrir</button> … <div class="ds-overlay" id="meu-modal">… <button data-ds-close>×</button></div>
<div data-ds-tabs> .ds-tabs > .ds-tab[data-ds-tab="x"] … .ds-tabpanel[data-ds-panel="x"] </div>
<table> <input data-ds-check-all> … <input data-ds-row-check> </table>
<button data-ds-toast="Salvo!" data-ds-toast-type="success">…</button>
<div data-ds-segment> .ds-segment > button.is-active … </div>      <!-- filtros -->
<div data-ds-accordion> .ds-accordion-item > .ds-accordion-trigger + .ds-accordion-panel </div>
<label data-ds-dropzone class="ds-dropzone"> … <input type="file" hidden> </label>
<button data-ds-open="meu-drawer">…</button> … <div class="ds-overlay ds-overlay--side" id="meu-drawer"><aside class="ds-drawer">…</aside></div>
```

---

## Acessibilidade

- Foco visível padrão (`:focus-visible`) com contorno azul.
- Ícones decorativos: `aria-hidden="true"`; botões-ícone com `aria-label`.
- Inputs com `<label>` clicável; erros com `aria-describedby`.
- Modais com `role="dialog"`/`aria-modal`, foco inicial e `Esc` para fechar.
- Movimento desativado em `prefers-reduced-motion`.
- Números e colunas de valor com `font-variant-numeric: tabular-nums`.

## Versão

v1.0 — junho/2026. Sistema voltado a apps/CRUD, derivado do redesign do
stolben.com. Imagens: Unsplash (livres). Ícones: estilo Lucide (SVG inline,
stroke 1.8–2).
