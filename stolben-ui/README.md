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
| `img/`           | Imagens reais de licença livre usadas nos exemplos |

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

**Fundamentos:** `.ds-app` (shell), `.ds-lines`, `.ds-noise`, `.ds-glow`,
`.ds-panel-dark`, `.ds-surface`, `.ds-media` + `.ds-media-grad` (foto de fundo),
helpers de tipografia (`.ds-display`, `.ds-h1..h3`, `.ds-kicker`, `.ds-muted`).

**Ações:** `.ds-btn` (`--solid`, `--primary`, `--ghost`, `--subtle`, `--danger`,
tamanhos `--sm`/`--lg`, `--block`, `--icon`), `.ds-icon-btn`.

**Navegação:** `.ds-topbar` (+ `--dark`), `.ds-topbar-nav`, `.ds-avatar`,
`.ds-tabs`/`.ds-tab`, `.ds-menu` (dropdown), `.ds-pagination`.

**Conteúdo:** `.ds-card` (+ `--hover`), `.ds-stat`, `.ds-icon-box`, `.ds-badge`
(`--neutral/info/success/warn/danger`), `.ds-empty`.

**Formulários:** `.ds-field`, `.ds-label`, `.ds-input`, `.ds-textarea`,
`.ds-select`, `.ds-search`, `.ds-check`, `.ds-switch`, `.ds-help` (+ `--error`),
`.ds-input--invalid`.

**Dados:** `.ds-table` + `.ds-table-wrap` (hover, seleção, `aria-sort`,
`.ds-row-actions`), `.ds-toolbar`.

**Feedback:** `.ds-alert` (4 tipos), `.ds-toast` (+ `window.dsToast(msg, tipo)`),
`.ds-modal`/`.ds-overlay`, `.ds-progress`, `.ds-spinner`, `.ds-skeleton`.

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
