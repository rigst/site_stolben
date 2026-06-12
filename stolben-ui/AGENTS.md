# Guia para IA — construção de interfaces com Stölben UI

Instruções para um agente de IA (Claude, etc.) construir telas de aplicativos
usando o design system **Stölben UI**. Siga este guia à risca: ele combina os
princípios de *frontend design* com as *Web Interface Guidelines* (acessibilidade
e qualidade). O objetivo é gerar telas **consistentes, acessíveis e com a
identidade da marca**, sem "cara de template de IA".

> Leia também o `README.md` (tokens e lista de componentes) e abra o `index.html`
> para ver cada componente renderizado.

---

## 0. Regras de ouro (inegociáveis)

1. **Use os componentes e tokens existentes.** Não reinvente botões, tabelas,
   campos ou cores. Se algo não existe, componha a partir do que existe; só então
   crie um componente novo seguindo o mesmo padrão (prefixo `.ds-`, tokens `var(--ds-…)`).
2. **Nunca use valores soltos** de cor, espaçamento, raio ou fonte. Sempre
   `var(--ds-…)`.
3. **HTML semântico sempre.** `<button>` para ação, `<a href>` para navegação,
   `<label>` para campo, `<table>` para dados tabulares. Nunca `div` clicável.
4. **Acessível por padrão.** Todo controle alcançável por teclado, com foco
   visível e nome acessível. Veja a checklist na seção 5.
5. **Um acento só.** Cinza/preto/branco dominam; **o acento** (azul por padrão)
   marca ação, foco e seleção. O acento é temável por app (ver seção 2.5): use
   sempre `--ds-accent*`, nunca `--ds-blue` direto. Cores semânticas
   (verde/âmbar/vermelho) **apenas** para estados, nunca como acento.

---

## 1. Setup de uma página

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0f1115">
  <script>document.documentElement.classList.add("js")</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/stolben-ui/stolben-ui.css">
</head>
<body class="ds-root">
  <!-- conteúdo -->
  <script src="/static/stolben-ui/stolben-ui.js"></script>
</body>
</html>
```

A classe `ds-root` no `<body>` é obrigatória. O `<script>` inline no `<head>`
evita "piscar" o reveal quando o JS está ligado.

---

## 2. Layout de aplicativo

Telas de CRUD usam **app shell com sidebar**:

```html
<div class="ds-shell">
  <aside class="ds-sidebar" data-ds-spy>
    <div class="ds-sidebar-brand"><span class="ds-logo">S</span> Minha App</div>
    <p class="ds-sidebar-group">Geral</p>
    <a class="ds-sidebar-link is-active" href="#clientes"><svg…></svg> Clientes</a>
    <a class="ds-sidebar-link" href="#pedidos"><svg…></svg> Pedidos</a>
  </aside>
  <div class="ds-main">
    <header class="ds-topbar" data-ds-topbar> … busca, avatar … </header>
    <main style="padding: 2rem"> … conteúdo da tela … </main>
  </div>
</div>
```

Para landing/marketing use o shell do site (`.ds-app` + `.ds-lines`). Para apps,
prefira `.ds-shell`.

### 2.5 Tema de acento (cor do app)
Defina a cor do app **uma vez**, na raiz, e nunca mais use cor de acento solta:

```html
<body class="ds-root ds-theme-violet">   <!-- indigo · violet · teal · emerald · amber · rose · slate -->
```

Cor própria? Defina **só** `--ds-accent` numa classe `.ds-theme-x` — os tons são
derivados e funcionam em claro/escuro. Não escolha um acento igual ao verde de
sucesso nem ao vermelho de erro.

### 2.6 Visualizações de lista
Escolha pela tarefa e mostre **só o essencial em destaque**, com hierarquia
(título forte › valor › status › meta discreta — nunca encha de colunas/campos):

| Visualização | Quando | Componentes |
|---|---|---|
| **Tabela** | Comparar muitos registros por colunas | `.ds-table` + `.ds-table-wrap` |
| **Grade de cards** | Itens visuais (catálogo, galeria) | `.ds-record` em `.ds-grid--3/4` |
| **Lista compacta** | Leitura rápida, mobile | `.ds-list` / `.ds-list-item` |
| **Board / colunas** | Fluxo por status (kanban) | `.ds-board` / `.ds-board-col` / `.ds-board-card` |
| **Gráfico de barras** | Métricas/comparação (dashboard) | `.ds-chart` / `.ds-chart-col` / `.ds-chart-bar` |
| **Timeline / feed** | Eventos cronológicos (histórico, log) | `.ds-timeline` / `.ds-timeline-item` |

Para alternar visualizações na mesma tela: `.ds-segment` com `data-view="x"`
dentro de `[data-ds-views]`, e blocos `[data-view-panel="x"]`.

### 2.7 Comece por um template
Em `templates/` há 3 exemplos prontos para copiar (tabela+indigo, cards+teal,
board+amber). Copie o mais próximo da sua tela e ajuste conteúdo e tema.

### 2.8 Claro e escuro
Três modos: **claro / automático / escuro** (`auto` segue o sistema, é o padrão).
Inclua o controle de 3 vias (`data-ds-theme-mode` com botões `data-mode`) e o
script de leitura no `<head>` (evita flash):

```html
<script>(function(){var e=document.documentElement;e.classList.add("js");
try{var m=localStorage.getItem("ds-theme-mode");
if(m==="dark"||(!m&&matchMedia("(prefers-color-scheme:dark)").matches))e.classList.add("ds-dark");}catch(x){}})();</script>
```

Regra para o escuro funcionar: **nunca cravar cor** — use tokens. Para texto forte
use `--ds-text-strong` (não `--ds-ink`); para acento como texto/ícone use
`--ds-accent-fg` (não `--ds-accent`, que pode ficar escuro demais no fundo escuro).
Fundos neutros: `--ds-subtle`. O DS já clareia o acento e os estados no escuro.

---

## 3. Princípios de design (frontend)

- **Hierarquia clara.** Um título forte (Manrope, `.ds-h1/h2`), texto de apoio em
  cinza, ação principal em azul sólido. Uma ação primária por bloco; o resto é
  `--ghost` ou `--subtle`.
- **Ritmo claro ↔ escuro.** Alterne cartões claros e painéis escuros
  (`.ds-panel-dark`). **Nunca** empilhe dois blocos escuros pesados seguidos.
- **Respiro.** Use a escala de espaçamento (`--ds-space-*`). Densidade alta só em
  tabelas; o resto respira.
- **Imagens reais e livres.** Quando usar foto (hero, fundo, card de destaque),
  use foto real de licença livre (Unsplash) coerente com o contexto
  (workspace, código, servidores). **Nunca** render 3D, gradiente roxo genérico
  ou stock clichê (planta brotando de moedas, mesa branca com plantinha). Sempre
  `width`/`height` + gradiente de leitura (`.ds-media` + `.ds-media-grad`).
- **Movimento discreto.** `.ds-reveal` para entrada ao rolar; hovers leves; brilho
  na barra de progresso. Anime só `opacity`/`transform`. Nunca `transition: all`.
- **Copy concreta.** "Deploy em Linux/Nginx" > "soluções escaláveis". Rótulos
  específicos ("Salvar cliente", não "Enviar"). Sem jargão inútil nem ornamento
  decorativo sem função.

### Evite "cara de IA"
- Sem badges flutuantes "All systems operational" nem marca d'água gigante.
- Ícones neutros (estilo Lucide, stroke 1.8–2), nunca literais (foco→alvo) nem
  clichês (foguete).
- Acento azul com parcimônia: title em duas cores e glow azul, uma vez por tela.

---

## 4. Quando usar cada componente

| Preciso de… | Use |
|---|---|
| Ação principal | `.ds-btn--solid` (azul) |
| Ação secundária / cancelar | `.ds-btn--ghost` ou `.ds-btn--subtle` |
| Ação destrutiva | `.ds-btn--danger` (com confirmação!) |
| Listagem de registros | tabela/cards/lista/board (ver §2.6) + `.ds-toolbar` + `.ds-pagination` |
| Cadastro / edição | `.ds-field` + `.ds-input/.ds-select/.ds-textarea` |
| Edição rápida sem sair da lista | `.ds-drawer` (slide-over) |
| Confirmar / formulário curto | `.ds-modal` |
| Tela de detalhe (ver registro) | `.ds-dl` (description list) |
| Status de registro | `.ds-badge--success/warn/danger/neutral` |
| Indicadores (dashboard) | `.ds-stat`, `.ds-card` |
| Mensagem persistente | `.ds-alert` |
| Confirmação efêmera | `window.dsToast(msg, "success")` |
| Filtros | `.ds-segment` ou `.ds-select` |
| Carregando | `.ds-spinner`, `.ds-skeleton`, `.ds-progress` |
| Lista vazia | `.ds-empty` |
| Navegação de seções | `.ds-tabs`, `.ds-breadcrumb`, `.ds-sidebar` |

---

## 5. Checklist de acessibilidade (Web Interface Guidelines)

Ao gerar qualquer tela, garanta:

**Formulários**
- [ ] Todo input tem `<label>` associado (`for`/`id`) ou `aria-label`.
- [ ] `name` e `autocomplete` corretos; `type`/`inputmode` semânticos
      (`email`, `tel`, `url`, `number`). Em e-mail/código: `spellcheck="false"`.
- [ ] Erro inline com `aria-describedby` apontando para a mensagem.
- [ ] Botão de envio habilitado até iniciar a requisição; foca o 1º erro ao falhar.
- [ ] Placeholders terminam com `…` e nunca substituem o rótulo.
- [ ] Nunca bloqueie colar (`onpaste`).

**Interação e foco**
- [ ] `<button>`/`<a>` reais; nada de `div` com `onclick`.
- [ ] Foco visível (já vem do DS); não remova `outline` sem substituir.
- [ ] Botão-ícone tem `aria-label`. Ícone decorativo tem `aria-hidden="true"`.
- [ ] Ação destrutiva pede confirmação (modal).

**Conteúdo e mídia**
- [ ] `<img>` com `width`/`height`; `alt` descritivo (ou `alt=""` se decorativa).
- [ ] Imagem abaixo da dobra: `loading="lazy"`; hero: `fetchpriority="high"`.
- [ ] Texto que pode estourar usa `.ds-truncate`; filhos de flex usam `min-width:0`.
- [ ] Números/valores em tabelas com `font-variant-numeric: tabular-nums`
      (classe `.ds-mono` ou `.ds-td-num`).
- [ ] Gráfico (`.ds-chart`) tem alternativa textual: `role="img"` + `aria-label`
      resumindo os dados (barras decorativas com `aria-hidden`). Timeline usa
      `<ol>`/`<li>` semânticos.

**Estrutura e estados**
- [ ] Hierarquia de headings (`h1` → `h2` → `h3`), sem pular níveis.
- [ ] Modal: `role="dialog"`, `aria-modal="true"`, foco inicial, fecha com `Esc`.
- [ ] Atualizações assíncronas em região `aria-live="polite"` (toasts já têm).
- [ ] Trate sempre os 3 estados: **carregando**, **vazio**, **erro**.

**Movimento e tema**
- [ ] Anime só `opacity`/`transform`; respeite `prefers-reduced-motion`
      (o DS já desliga). Anexe `transform-origin` correto quando rotacionar.
- [ ] `color-scheme` e `<meta name="theme-color">` definidos.
- [ ] Funciona em **claro e escuro**: toda cor via token (acento-texto com
      `--ds-accent-fg`, valores com `--ds-text-strong`, fundo neutro `--ds-subtle`),
      nunca cravada. Teste com `<html class="ds-dark">`.

---

## 6. Receitas de tela

### 6.1 Lista CRUD
`.ds-toolbar` (busca + filtro + botão "Novo") → `.ds-table-wrap` com `.ds-table`
(coluna de seleção `data-ds-check-all`/`data-ds-row-check`, coluna de status com
`.ds-badge`, coluna de ações com `.ds-row-actions`/`.ds-icon-btn`) → contagem +
`.ds-pagination`. Sem dados → `.ds-empty` com CTA. Veja o exemplo em `index.html`.

### 6.2 Criar / editar
Modal (`.ds-modal`, formulário curto) ou drawer (`.ds-drawer`, formulário médio)
ou página inteira (formulários longos, com `.ds-field` e uma barra de ações fixa
no rodapé). Ação primária à direita (`--solid`), cancelar à esquerda (`--ghost`).
Ao salvar com sucesso: feche e dispare `dsToast("Salvo.", "success")`.

### 6.3 Detalhe (mostrar registro)
`.ds-breadcrumb` → título + `.ds-badge` de status + ações no topo → `.ds-dl`
(rótulo/valor) dentro de `.ds-card`. Abas (`.ds-tabs`) para Dados/Histórico/etc.

### 6.4 Dashboard
Linha de `.ds-stat` (3–4 métricas, `tabular-nums`) → `.ds-card` com gráficos/listas.
Um único painel escuro de destaque, se houver, para criar contraste.

### 6.5 Estados
- **Carregando:** `.ds-skeleton` no lugar do conteúdo, ou `.ds-spinner` em botões.
- **Vazio:** `.ds-empty` com ícone, frase curta e ação para criar o primeiro item.
- **Erro:** `.ds-alert--danger` com a causa **e** o que fazer para resolver.

---

## 7. Faça / Não faça

| ✅ Faça | ❌ Não faça |
|---|---|
| `<button class="ds-btn ds-btn--solid">` | `<div class="botao" onclick>` |
| `color: var(--ds-blue)` | `color: #2563eb` |
| Uma ação primária por bloco | Vários botões azuis competindo |
| Foto real livre + `width`/`height` | Render 3D / gradiente roxo / stock clichê |
| `dsToast()` para confirmação | `alert()` do navegador |
| Confirmar antes de excluir | Excluir direto no clique |
| `.ds-table` com `tabular-nums` | Números desalinhados em `<div>`s |
| `prefers-reduced-motion` respeitado | `transition: all` / animação não interrompível |

---

## 8. Checklist final antes de entregar

1. Todos os controles são `<button>`/`<a>`/`<label>` semânticos.
2. Cores/espaços/raios usam tokens `var(--ds-…)`.
3. Inputs com `label`, `name`, `autocomplete`, `type`/`inputmode`.
4. Botões-ícone com `aria-label`; ícones decorativos `aria-hidden`.
5. Imagens com `width`/`height` e `alt`; fotos reais e livres.
6. Estados de carregando, vazio e erro previstos.
7. Foco visível, navegação por teclado, `Esc` fecha overlays.
8. Movimento discreto, só `opacity`/`transform`, com `prefers-reduced-motion`.
9. Uma ação primária azul por bloco; ritmo claro/escuro sem empilhar escuros.
10. Sem "cara de IA": copy concreta, ícones neutros, nada de ornamento sem função.
