# Stölben UI — Design System

Sistema de design extraído do site `stolben.com` para replicar a mesma
identidade ("Infra Premium") nos aplicativos web (Divisor de PDF, Orçamentos,
Finanças, Vetorial, etc.). CSS puro, sem dependências de build — funciona em
qualquer stack (Django templates, HTML estático, React, etc.).

## Arquivos

| Arquivo | O que é |
|---|---|
| `stolben-ui.css` | Tokens (variáveis CSS) + componentes prontos (prefixo `.ds-`) |
| `stolben-ui.js`  | Comportamentos opcionais: revelar ao rolar, nav fixo, link ativo |
| `README.md`      | Esta documentação |

## Como usar

No `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/static/design-system/stolben-ui.css">
```

No `<body>` (adicione a classe `ds-root` no elemento raiz) e, antes do `</body>`:

```html
<script src="/static/design-system/stolben-ui.js"></script>
```

---

## Princípios visuais

1. **Blocos arredondados alternados.** Seções em cartões `border-radius: 2.5rem`,
   alternando **escuro** (`--ds-ink`) e **claro** (`--ds-surface`). Nunca empilhe
   dois blocos escuros pesados seguidos.
2. **Azul como único acento.** Tudo é cinza/preto/branco; o azul (`--ds-blue`)
   marca ações, destaques e estados.
3. **Tipografia com contraste de função.** Títulos em **Manrope** (peso 500,
   `letter-spacing` negativo); texto em **Inter**. Segunda linha de título em
   cinza (`.ds-muted`) para criar ritmo.
4. **Atmosfera sutil.** Glow desfocado (`.ds-glow`), ruído (`.ds-noise`) e linhas
   de grade tracejadas (`.ds-lines`) dão profundidade sem poluir.
5. **Bento / hierarquia.** Um item "herói" largo + itens menores ao redor, em vez
   de uma grade uniforme.
6. **Movimento discreto.** Entradas suaves ao rolar (`.ds-reveal`), hovers leves.
   Sempre respeitando `prefers-reduced-motion`.

---

## Tokens (principais variáveis)

```
Superfícies   --ds-bg --ds-panel --ds-surface --ds-ink --ds-ink-soft --ds-ink-deep
Acento        --ds-blue --ds-blue-light --ds-blue-dark --ds-blue-50 --ds-blue-100
Estado        --ds-warn (atenção / "em desenvolvimento")
Texto         --ds-text-900/700/500/400  + sobre escuro: --ds-on-dark*
Linhas        --ds-line --ds-line-dash
Tipografia    --ds-font-sans --ds-font-display --ds-fs-hero --ds-fs-h2
Raios         --ds-radius-xl(2.5) --ds-radius-lg(1.5) --ds-radius-md(1) --ds-radius-pill
Espaço        --ds-space-1..16 (escala de 4px)
Sombra        --ds-shadow-card --ds-shadow-block --ds-shadow-glow-blue
Efeitos       --ds-blur --ds-ease --ds-noise
```

Use sempre os tokens (`var(--ds-…)`) em vez de valores soltos, para manter a
consistência entre os apps.

---

## Componentes — exemplos

### Shell + grade tracejada
```html
<div class="ds-shell">
  <div class="ds-lines"><span></span><span></span><span></span></div>
  <main class="ds-stack"> … seções … </main>
</div>
```

### Nav (pílula fixa)
```html
<header class="ds-nav">
  <nav class="ds-nav-pill">
    <a class="ds-nav-brand" href="#home">Minha App</a>
    <ul class="ds-nav-links">
      <li><a href="#features">Recursos</a></li>
      <li><a href="#price">Planos</a></li>
    </ul>
    <a class="ds-nav-cta" href="#cta">Entrar</a>
  </nav>
</header>
```
O `stolben-ui.js` adiciona `is-scrolled` ao rolar (a pílula passa de translúcida
clara → escura) e `is-active` no link da seção visível.

### Painel escuro (hero / CTA)
```html
<section class="ds-panel-dark" style="padding:3rem; min-height:620px; position:relative">
  <div class="ds-glow" style="top:-10rem; left:-5rem"></div>
  <div class="ds-noise"></div>
  <h1 class="ds-h1">Título forte <br><span class="ds-muted">com segunda linha</span></h1>
</section>
```

### Painel escuro com imagem de fundo (foto real)
```html
<section class="ds-panel-dark" style="position:relative; padding:3rem">
  <div class="ds-media"><img src="/static/img/hero.jpg" alt=""><div class="ds-media-grad"></div></div>
  <div class="ds-glow" style="top:-8rem; left:-6rem"></div>
  <div style="position:relative; z-index:2">
    <h1 class="ds-h1">Título sobre a imagem</h1>
  </div>
</section>
```
Use `.ds-media-grad--left` quando o texto ficar à esquerda. **Sempre foto real**
(workspace, código, trabalho) — nunca render 3D/“IA” ou stock clichê.

### Botões
```html
<a class="ds-btn ds-btn--primary" href="#">Ação <span class="ds-btn-ico">→</span></a>
<a class="ds-btn ds-btn--ghost" href="#">Secundária</a>
<button class="ds-btn ds-btn--solid">Enviar →</button>
```

### Card claro
```html
<article class="ds-card ds-reveal">
  <span class="ds-kicker">Categoria</span>
  <h3 class="ds-display" style="font-size:var(--ds-fs-h3)">Título</h3>
  <p>Descrição…</p>
  <ul class="ds-tags"><li>Python</li><li>Django</li></ul>
</article>
```

### Badges / status
```html
<span class="ds-badge ds-badge--info">Publicado</span>
<span class="ds-badge ds-badge--warn"><span class="ds-dot"></span> Em desenvolvimento</span>
<span class="ds-badge ds-badge--info-dark"><span class="ds-dot"></span> Online</span> <!-- sobre escuro -->
```

### Ícone em caixa (pilar/feature)
```html
<span class="ds-icon-box"><!-- svg 24x24 stroke --></span>
```

### Formulário (sobre painel escuro)
```html
<form class="ds-form">
  <label class="ds-field"><span>Nome</span>
    <input class="ds-input" name="nome" required></label>
  <label class="ds-field"><span>Mensagem</span>
    <textarea class="ds-textarea" name="msg"></textarea></label>
  <button class="ds-btn ds-btn--solid">Enviar →</button>
</form>
```

### Revelar ao rolar
Adicione `ds-reveal` a qualquer elemento; o JS aplica `is-visible` quando ele
entra na tela. Para escalonar, defina `transition-delay` nos filhos.

### Console escuro (formulário/opções dentro de cartão claro)
Bloco escuro inserido num cartão claro — gera o contraste claro↔escuro do tema
sem empilhar dois blocos escuros. Ideal para áreas de configuração/upload.
```html
<div class="ds-console">
  <span class="ds-label"><!-- svg --> Nível de compressão</span>
  <!-- choices, switch, inputs… -->
</div>
```

### Drop zone (upload arrastar/soltar)
```html
<label class="ds-dropzone"><!-- .is-drag durante o arraste -->
  <strong>Arraste os arquivos aqui</strong>
  <p class="ds-dropzone-hint">ou clique para selecionar</p>
  <input type="file" hidden multiple>
</label>
```

### Choice (cartões selecionáveis) — variante escura
Marque `.is-selected` no item ativo (via JS). Indicador de seleção embutido.
```html
<div class="ds-choice-grid" style="grid-template-columns:repeat(4,1fr)">
  <label class="ds-choice is-selected">
    <input type="radio" name="nivel" checked>
    <span class="ds-choice-title">Nenhuma</span>
    <span class="ds-choice-desc">Mantém a qualidade</span>
  </label>
  <!-- … -->
</div>
```

### Switch (alternador)
```html
<label class="ds-switch">
  <input type="checkbox" checked>
  <span class="ds-switch-track"></span>
  Dividir em partes menores
</label>
```

### Progress (barra de progresso)
Brilho deslizante automático; use `--on-light` sobre fundo claro.
```html
<div class="ds-progress"><div class="ds-progress-fill" style="width:42%"></div></div>
```

### Stat strip (linha de métricas)
```html
<ul class="ds-stat-strip ds-stat-strip--on-dark">
  <li><strong>≤ 500 MB</strong><span>por arquivo</span></li>
  <li><strong>ZIP único</strong><span>pronto para enviar</span></li>
</ul>
```

### Footer (claro, enxuto)
Fecha a página de forma leve — **não** use bloco escuro no rodapé.
```html
<footer class="ds-footer">
  <div class="ds-footer-inner">
    <div>
      <p class="ds-footer-brand">Minha App</p>
      <p class="ds-footer-copy">Um app <a href="#">Stölben</a> · © 2026</p>
    </div>
    <!-- opcional: pontos de confiança, social, links… -->
  </div>
</footer>
```

> **Dose de escuro.** Áreas interativas (dropzone, console) usam `--ds-ink-soft`,
> um dark mais leve que o `--ds-ink` do hero. Reserve o preto forte para o hero e
> um eventual bloco de destaque — um formulário inteiro em `--ds-ink` pesa.

---

## Evitar "cara de IA"
Lições da construção do site — siga para que os apps não pareçam template gerado:

- **Sem ornamentos sem função.** Nada de badge flutuante "All systems operational"
  nem marca d'água gigante de fundo. Todo elemento decorativo deve carregar
  informação real.
- **Ícones não-literais.** Evite ícone que repete a palavra (foco→alvo) e clichês
  de startup (foguete). Prefira ícones neutros ou só tipografia.
- **Acento com parcimônia.** O título em duas cores (`.ds-muted`) e os glows azuis
  têm impacto — usados em tudo, viram padrão genérico. Uma vez por página.
- **Imagens reais, não render.** Foto de workspace/código > render 3D abstrato ou
  a foto de stock mais batida (Terra do espaço, mesa branca com planta).
- **Copy concreta.** "Deploy próprio em Linux/Nginx" > "soluções escaláveis de ponta".
- **Não empilhe dois blocos escuros pesados** seguidos (alterne claro/escuro).

## Acessibilidade
- Foco visível padrão (`:focus-visible`) com contorno azul.
- Ícones decorativos: `aria-hidden="true"`. Botões-ícone: use `aria-label`.
- Animações desativadas em `prefers-reduced-motion`.
- Contraste: texto sobre escuro usa `--ds-on-dark*`; evite cinza muito claro
  sobre branco para texto pequeno.

## Versão
v1.2 — junho/2026. Acrescenta o token `--ds-ink-soft` (dark suave) e o componente
`.ds-footer` (rodapé claro/enxuto). Suaviza `.ds-console` e `.ds-dropzone` para
`--ds-ink-soft`, evitando peso de áreas interativas muito escuras.

v1.1 — junho/2026. Acrescenta componentes de aplicação derivados do Divisor de
PDF: `.ds-console` (painel de formulário/opções dentro de cartão claro),
`.ds-dropzone`, `.ds-choice`/`.ds-choice-grid`, `.ds-switch`, `.ds-progress` e
`.ds-stat-strip`. Reforça o ritmo claro↔escuro do tema.

v1.0 — derivado do site stolben.com (junho/2026). Ícones recomendados: Lucide
(SVG inline, stroke 1.8–2). Imagens de hero: livres (Unsplash) ou próprias.
