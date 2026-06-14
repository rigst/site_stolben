# Implantando o Stölben UI em apps existentes

Guia prático baseado em migrações reais (ex.: **divisor_pdf**). Cobre como
vendorar o DS, as **quebras de API** que pegam apps com cópia antiga, como
ligar o **modo escuro** e os detalhes de deploy (Django/gunicorn).

> Resumo: o DS é CSS + JS puro, sem build. Cada app **copia** `stolben-ui.css`
> e `stolben-ui.js` para os seus estáticos. Não há symlink nem pacote.

---

## 1. Vendorar / atualizar

```bash
cp stolben-ui.css  <app>/static/css/stolben-ui.css
cp stolben-ui.js   <app>/static/js/stolben-ui.js
```

No `<head>` (ordem importa: DS antes da camada do app):

```html
<link rel="stylesheet" href="/static/css/stolben-ui.css">
<link rel="stylesheet" href="/static/css/style.css">   <!-- camada do app -->
```

E antes de `</body>`: `<script src="/static/js/stolben-ui.js"></script>`.
No `<body class="ds-root">` e, no `<html>`, a classe de tema
(`ds-theme-violet`, etc.). Veja o README para tokens/componentes.

---

## 2. Quebras de API ao atualizar de uma versão antiga

Apps feitos com uma versão antiga **quebram** se você só trocar os arquivos.
Checklist do que reconciliar:

### 2.1 Layout raiz: `.ds-shell` → `.ds-app`
`.ds-shell` agora é o **grid de sidebar (admin/CRUD)** (`15rem 1fr`). O
container centralizado de **site** (max-width) passou a ser **`.ds-app`**.
Páginas de site/landing devem usar `.ds-app` no wrapper.

### 2.2 Tokens renomeados
Atualize toda referência (inclusive em camadas-ponte `:root` do app):

| Antigo | Novo |
|---|---|
| `--ds-text-900/700/500` | `--ds-t-900/700/500` |
| `--ds-on-dark-soft` | `--ds-on-dark-dim` |
| `--ds-on-dark-mute` | `--ds-on-dark-faint` |
| `--ds-border-dark` | `--ds-line-dark` |
| `--ds-warn-soft` | `--ds-warn-50` |
| `--ds-tracking-tight` | (removido — use `-0.02em`) |

### 2.3 Acento temável: use `--ds-accent*`, não `--ds-blue*`
O tema (`.ds-theme-*` no `<html>`) controla **`--ds-accent`**; os tons
`--ds-accent-50/100/light/dark/fg` e `--ds-on-accent` são derivados (e
recalculados no escuro). Se o app referencia `--ds-blue*` direto, o tema não
"pega". **Remapeie `--ds-blue*` → `--ds-accent*`** na camada do app:

```
--ds-blue        → --ds-accent
--ds-blue-light  → --ds-accent-light
--ds-blue-dark   → --ds-accent-dark
--ds-blue-50     → --ds-accent-50
--ds-blue-100    → --ds-accent-100
```
Para fundos sutis tintados no acento, prefira
`color-mix(in srgb, var(--ds-accent) 18%, transparent)` a um azul fixo.

### 2.4 Estados semânticos derivem do DS
Mapeie `--success/-soft`, `--danger/-soft`, `--warn*` do app para
`--ds-success/-50/-100`, `--ds-danger/-50/-100`, `--ds-warn/-50/-100`. Assim
adaptam sozinhos no escuro (evita pastéis claros fixos quebrando no dark).

### 2.5 Nav de site voltou como componente
Versões antigas tinham `.ds-nav/.ds-nav-pill` embutidos; depois sumiram; agora
existem de novo como **componente** (pílula de vidro flutuante). Se o app
tinha nav própria dependendo dessas classes, ela volta a funcionar — veja §4.

### 2.6 Cuidado: `.ds-root a { color: inherit }`
Tem especificidade `(0,1,1)`. Uma regra de cor sua em `.ds-minha-classe`
`(0,1,0)` **não vence** — o link herda a cor do pai. Eleve a especificidade
(ex.: `#site-nav .ds-nav-brand` ou `.ds-nav-pill .ds-nav-brand`).

### 2.7 Dropzone: conflito de auto-bind
O JS auto-vincula comportamento em `[data-ds-dropzone]`. Se o app tem handlers
próprios de drag&drop, **não** ponha esse atributo (use só o visual
`.ds-dropzone`), senão os dois competem.

### 2.8 Toasts
Use `window.dsToast(msg, tipo)` — tipos `success | warn | danger | info`.
Mapeie tipos próprios (ex.: `error` → `danger`).

---

## 3. Modo escuro (passo a passo)

O DS já traz o dark mode; o app só precisa **ligar**:

1. **Anti-flash no `<head>`** (antes do CSS) — aplica a preferência salva /
   do sistema antes de pintar:
   ```html
   <script>(function(){var e=document.documentElement;e.classList.add("js");
   try{var m=localStorage.getItem("ds-theme-mode");
   if(m==="dark"||(!m&&matchMedia("(prefers-color-scheme:dark)").matches))e.classList.add("ds-dark");}catch(x){}})();</script>
   ```
2. **Controle** — duas opções (o JS cuida de `localStorage` + classe `ds-dark`):
   - Simples (2 estados): `<button data-ds-dark-toggle>` com dois ícones
     `.ds-icon-moon` e `.ds-icon-sun` (na nav-pílula, vira o `.ds-nav-toggle`).
   - 3 vias (claro/auto/escuro): `.ds-segment.ds-mode` com `data-ds-theme-mode`.
3. **Auditar cores claras fixas do app.** Quase tudo adapta porque deriva de
   `--ds-*` (o DS reescreve em `.ds-dark`). Procure no `style.css` do app:
   ```bash
   grep -nE 'background:[^;]*(#fff|#ffffff|255, ?255, ?255|rgba\(255)' static/css/style.css
   ```
   Para cada fundo claro fixo que **não** seja proposital (nav/hero), adicione
   um override `.ds-dark .minha-classe { ... }`. Ex. real: uma faixa branca
   translúcida virou `.ds-dark .feature-band { background: rgba(255,255,255,.035) }`.
4. Painéis propositalmente escuros (hero `.ds-panel-dark`, nav de vidro,
   painéis de stat sobre `--ds-ink`) já funcionam nos dois modos.

---

## 4. Nav flutuante (pílula de site)

Componente para flutuar sobre um hero escuro/foto. Marque `data-ds-nav` para o
JS escurecer ao rolar (`.is-scrolled`). A página precisa de espaço no topo
(a nav é `position: fixed`).

```html
<header class="ds-nav" data-ds-nav>
  <nav class="ds-nav-pill" aria-label="Navegação principal">
    <a class="ds-nav-brand" href="/">Marca<span class="ds-nav-accent">Acento</span></a>
    <div class="ds-nav-actions">
      <!-- Tema 3-vias (recomendado): claro / automático / escuro -->
      <div class="ds-segment ds-mode" data-ds-theme-mode role="group" aria-label="Tema">
        <button type="button" data-mode="light" aria-label="Tema claro"><svg>☀</svg></button>
        <button type="button" data-mode="auto"  aria-label="Tema automático (sistema)"><svg>◐</svg></button>
        <button type="button" data-mode="dark"  aria-label="Tema escuro"><svg>☾</svg></button>
      </div>
      <a class="ds-nav-cta" href="…">CTA ↗</a>
    </div>
  </nav>
</header>
```
Dentro da `.ds-nav-pill`, o `.ds-segment.ds-mode` já fica em vidro. Variante
simples (2 estados): `.ds-nav-toggle` + `[data-ds-dark-toggle]` com dois ícones
`.ds-icon-moon`/`.ds-icon-sun`.
Opcional: `<ul class="ds-nav-links">…</ul>` (colapsa no mobile ≤820px).

**Receita — nav que adapta ao rolar (hero escuro → conteúdo claro):** o vidro
escuro fica "cinza opaco" feio quando a pílula passa sobre conteúdo claro. No
tema claro, ao rolar, troque para um vidro CLARO com texto escuro (no escuro o
conteúdo já é escuro, então mantenha o vidro escuro). Cole na camada do app:

```css
html:not(.ds-dark) .ds-nav.is-scrolled .ds-nav-pill {
  background: rgba(255,255,255,0.72); border-color: rgba(15,17,21,0.06);
  box-shadow: 0 10px 28px rgba(15,17,21,0.12), inset 0 1px 0 rgba(255,255,255,0.85);
}
html:not(.ds-dark) .ds-nav.is-scrolled .ds-nav-brand { color: var(--ds-t-900); text-shadow: none; }
html:not(.ds-dark) .ds-nav.is-scrolled .ds-nav-brand .ds-nav-accent { color: var(--ds-accent); }
html:not(.ds-dark) .ds-nav.is-scrolled .ds-nav-cta { background: var(--ds-ink); color: #fff; }
```

---

## 5. Deploy (Django + gunicorn, exemplo divisor_pdf)

Produção usa `ManifestStaticFilesStorage` → editar `static/` **não** surte
efeito até recoletar:

```bash
cd <app>
source venv/bin/activate
DJANGO_SETTINGS_MODULE=config.settings.production python manage.py collectstatic --noinput
# reload graceful do gunicorn (sem sudo): HUP no master (PPID 1)
kill -HUP "$(ps -eo pid,ppid,cmd | awk '/[g]unicorn.*<app>/ && $2==1 {print $1}')"
```

Validação: `curl -sk https://<dominio>/` (localhost costuma dar 400 por
`ALLOWED_HOSTS`). Confira no domínio real.

---

## 6. Checklist rápido de migração

- [ ] `cp` do `stolben-ui.css`/`.js` para o app
- [ ] `.ds-shell` → `.ds-app` nos wrappers de site
- [ ] Tokens renomeados (§2.2) corrigidos em todo o app
- [ ] `--ds-blue*` → `--ds-accent*` (tema temável)
- [ ] Estados success/danger/warn derivando de `--ds-*`
- [ ] Nav usando o componente (§4) ou classes próprias com especificidade ok
- [ ] Sem `[data-ds-dropzone]` se o app tem drag&drop próprio
- [ ] Toasts via `window.dsToast`
- [ ] Dark mode: anti-flash + toggle + auditoria de cores claras fixas
- [ ] `collectstatic` + `kill -HUP` + validar no domínio real
