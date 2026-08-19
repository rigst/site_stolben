# Instalar o Stölben UI v2 num app

> Resumo: o DS é CSS + JS puro, sem build. Cada app **copia** os arquivos para
> os seus estáticos. Não há symlink, pacote nem etapa de compilação — a mesma
> mecânica do v1.

## 1. Copiar

```bash
DS=/var/www/site_stolben/design-systems/stolben-ui-v2
APP=/var/www/<app>/current

cp  $DS/stolben-ui.css  $APP/static/css/stolben-ui.css
cp  $DS/stolben-ui.js   $APP/static/js/stolben-ui.js
cp -r $DS/fonts         $APP/static/css/fonts        # ← ao lado do CSS
```

**A pasta `fonts/` precisa ficar ao lado do CSS.** Os `@font-face` usam caminho
relativo (`url("fonts/…")`), que o navegador resolve a partir da URL do próprio
arquivo de estilo. Se o CSS estiver em `/static/css/`, as fontes têm que estar
em `/static/css/fonts/`. Fora disso a tipografia cai no fallback do sistema e o
visual inteiro muda.

Depois: `collectstatic` e reload do gunicorn — no `sistema_trilhas` o
collectstatic exige settings de produção (Manifest storage), ver o memorial do
projeto.

## 2. Ligar no template base

```html
{% load static %}
<html lang="pt-br" class="ds-root ds-tema-verde">
<head>
  <link rel="stylesheet" href="{% static 'css/stolben-ui.css' %}">
</head>
<body class="ds-shell" style="--ds-fundo: url('{% static "img/fundo.jpg" %}')">

  <a class="ds-pular" href="#conteudo">Pular para o conteúdo</a>
  <input type="checkbox" id="nav" class="ds-nav-toggle" aria-hidden="true" tabindex="-1">

  <aside class="ds-side">…</aside>

  <div class="ds-frame">
    <main class="ds-main" id="conteudo">
      <div class="ds-page">{% block content %}{% endblock %}</div>
    </main>
  </div>

  <script src="{% static 'js/stolben-ui.js' %}"></script>
</body>
</html>
```

O casco inteiro está montado em [`templates/`](templates/) e em `index.html`.

### CSP

O `stolben-ui.js` não usa `eval` nem `new Function`, então basta o `nonce`
habitual nos `<script>`. O `<select>` traz a seta como `data:image/svg+xml`
dentro do CSS — se a política tiver `img-src`, incluir `data:`.

## 3. As fotos

Três variáveis, todas opcionais. Sem elas o sistema fica sóbrio e continua
íntegro; a lateral cai para um sólido escuro.

| Variável | Onde | Como declarar |
|---|---|---|
| `--ds-fundo` | o casco atrás de tudo (borrado) | no `<body class="ds-shell">` |
| `--ds-foto` | a faixa do topo de uma tela | no `.ds-faixa` daquela tela |
| `--ds-foto-login` | a tela de entrada | no `.ds-auth` |

Foto de fundo é uma escolha de identidade do app, não do sistema. Se o app tiver
imagem enviada pelo usuário (como o A.R.Q. tem), declarar num `<style nonce>`.

---

## Migrar do v1 (Stölben UI "Infra Premium")

Os dois usam o mesmo prefixo `.ds-`, então **trocar de sistema é trocar o
`<link>`** — mas nem tudo casa. O que muda:

### Continua igual (nome e sentido)

`.ds-root` `.ds-btn` `.ds-btn--solid` `.ds-badge` `.ds-kicker` `.ds-h1`
`.ds-h2` `.ds-muted` `.ds-progress` `.ds-progress-fill` `.ds-modal`
`.ds-avisos` `.ds-aviso` `.ds-table` (era `.ds-table` no v1 também) e a API
`window.dsToast(msg, tipo)`.

### Muda de sentido — reler antes de confiar

| v1 | v2 | O que fazer |
|---|---|---|
| `.ds-card` (caixa com fundo e borda) | `.ds-bloco` (sem caixa) | Seção vira `.ds-bloco` com `.ds-secao-titulo`. Só objeto repetido em grade vira `.ds-obj`. |
| `.ds-app` (container centrado do site) | `.ds-main` | Largura da folha agora é `--ds-folha` (74 rem). |
| `.ds-shell` (grid de sidebar do CRUD) | `.ds-shell` (casco de tela cheia) | O grid de lateral virou `.ds-side` + `.ds-frame` + `.ds-main`. |
| `--ds-t-900/700/500` | iguais | Sem mudança. Os nomes do A.R.Q. (`--ds-text-*`) também valem. |
| `--ds-accent*` | iguais | O tema continua sendo classe na raiz, só mudou o prefixo: `ds-theme-violet` → `ds-tema-violeta`. |
| `.ds-nav` / `.ds-nav-pill` (pílula de vidro sobre hero) | não existe | É componente de site. Manter o v1 nas páginas de marketing. |
| `.ds-reveal` `.ds-glow` `.ds-noise` `.ds-lines` | não existem | Atmosfera é do v1. Aqui a profundidade vem do casco (`--ds-fundo`). |
| modo escuro (`data-theme`) | não existe | O v2 é luz só, por escolha. Ver o princípio 5 do README. |

### Ordem de migração que funciona

1. Trocar o `<link>` numa tela só — a mais simples, tipo uma listagem.
2. Renomear `.ds-card` → `.ds-bloco` e pôr `.ds-secao-titulo` nos títulos de
   seção. É o passo que muda mais pixels: a caixa some.
3. Marcar todo número com `.num` e todo rótulo com `.ds-kicker`. Sem isso a
   tela fica com cara de v1 usando a paleta do v2.
4. Só então o casco: `.ds-shell` + `.ds-side` + `.ds-frame` + `.ds-main`.
5. Auditar cor fixa no CSS do app. Regra prática: se há hex escrito à mão,
   existe token para ele.

### Pegadinha herdada do A.R.Q.

`.ds-root a { color: var(--ds-accent-dark) }` tem especificidade (0,1,1) e
sobrepõe regra de cor por classe simples. Para pintar um link, subir a
especificidade (`.ds-side .ds-nav-link`, `a.ds-btn--solid`) ou usar um
componente que já resolva.

## 4. Conferir antes de dar por pronto

- [ ] As fontes carregaram (`Archivo` nos títulos, largura larga no `h1`).
- [ ] Nenhuma requisição para `fonts.googleapis.com` na aba de rede.
- [ ] O burger aparece abaixo de 62 rem e a gaveta abre.
- [ ] `Tab` percorre a tela com foco visível em todo controle.
- [ ] `Ctrl+P` produz folha legível, sem lateral e sem botão.
- [ ] Modo de movimento reduzido do sistema: nada se anima.
