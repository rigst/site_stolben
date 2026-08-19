# Design systems

Diretório central dos sistemas de design usados nos apps em `/var/www`.
Antes ficavam espalhados (`site_stolben/stolben-ui/` e `site_stolben/design-system/`);
agora moram todos aqui, versão por versão.

```
design-systems/
├── stolben-ui-v0/   congelado — a cópia antiga, mantida só para consulta
├── stolben-ui-v1/   "Infra Premium" — site e marketing
└── stolben-ui-v2/   "A folha"       — aplicações de trabalho   ← novo
```

## Qual usar

**A escolha é pelo tipo de tela, não pela data.** v1 e v2 são irmãos, não
sucessivos: nenhum dos dois substitui o outro.

| Se a tela é… | Sistema | Por quê |
|---|---|---|
| Página de produto, landing, portfólio, blog | **v1** | Blocos arredondados alternando claro e escuro, hero, atmosfera, revelação ao rolar. Feito para convencer alguém que chegou agora. |
| Painel, listagem, cadastro, relatório, qualquer tela de uso diário | **v2** | Papel, filete, densidade, rótulo mono, nenhum brilho. Feito para quem já está dentro e vai passar o dia ali. |
| Um app que tem as duas coisas | os dois | v1 nas páginas públicas, v2 depois do login. Compartilham o prefixo `.ds-`, mas **nunca na mesma página**. |

## Os três

### [`stolben-ui-v2/`](stolben-ui-v2/) — "A folha" · agosto de 2026

Extraído do sistema visual do **A.R.Q.** (`/var/www/sistema_arq`) e
generalizado. A metáfora é a prancheta: papel levemente esverdeado, cota,
carimbo, poché, camadas. IBM Plex Sans/Mono + Archivo, auto-hospedadas.
Cascata em `@layer`. Luz só, por escolha.

Começar por [`stolben-ui-v2/index.html`](stolben-ui-v2/index.html) —
a galeria tem todo componente em tamanho real.
Instalar: [`DEPLOY-EM-APPS.md`](stolben-ui-v2/DEPLOY-EM-APPS.md), que também
traz a tabela de migração a partir do v1.

**Em uso:** nenhum app ainda. O A.R.Q. continua com o CSS próprio de onde este
sistema saiu; migrá-lo é a prova de fogo natural.

### [`stolben-ui-v1/`](stolben-ui-v1/) — "Infra Premium"

Extraído do site `stolben.com`. Blocos `border-radius: 2.5rem` alternando
escuro e claro, azul (ou o acento temável) como cor única, Inter + Manrope,
glow, ruído e linhas tracejadas. Tem modo escuro.

**Em uso:** `divisor_pdf`, `sistema_orcamentos`, `sistema_financas` (esses dois
no DS puro). `sistema_questoes` e `sistema_vetorial` seguem com cópia antiga.

### `stolben-ui-v0/` — congelado

Snapshot anterior do v1, de antes da quebra de API de tokens
(`.ds-shell` → `.ds-app`, `--ds-text-*` → `--ds-t-*`, `--ds-blue*` →
`--ds-accent*`). Serve para entender o que uma cópia vendorada antiga está
fazendo. **Não instalar em nada.**

## Como os apps consomem

Por **cópia** dos arquivos para os `static/` do app — sem symlink, sem pacote,
sem build. Consequência prática: mudar algo aqui não chega em app nenhum até
alguém copiar, e cada app pode estar numa versão diferente. Ao fazer mudança
que quebra, registrar na tabela de migração do sistema — é o único aviso que o
outro lado recebe.

Cada pasta tem o seu `AGENTS.md` com as regras de quem for mexer.
