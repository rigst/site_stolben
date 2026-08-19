# Regras para mexer no Stölben UI v2

Vale para pessoa e para agente. Se alguma regra parecer arbitrária, ela
provavelmente resolveu um problema que voltou duas vezes.

## Antes de escrever qualquer linha

1. Abrir `index.html` num navegador. A galeria tem todo componente em tamanho
   real; muita "falta" some ao ver que já existe com outro nome.
2. Este sistema é **de ferramenta**, não de site. Se o pedido é hero, seção de
   preço, depoimento ou animação de rolagem, o sistema certo é o
   [v1](../stolben-ui-v1/) e a resposta é usar aquele.

## O que não fazer

- **Não acrescentar caixa.** Fundo + borda + raio em torno de conteúdo é a
  coisa que este sistema existe para evitar. Superfície com moldura tem um caso
  legítimo: objeto repetido numa grade (`.ds-obj`). Qualquer outro uso precisa
  de justificativa escrita no CSS.
- **Não usar cor de camada como fundo chapado.** Camada é filete, tique e
  rótulo. Fundo tingido só no `.ds-quadro`, e a 9%.
- **Não escrever hex à mão.** Se não há token, o passo é criar o token — não
  passar por cima.
- **Não acrescentar sombra difusa, brilho ou gradiente decorativo.** A única
  sombra do sistema é `--ds-shadow-soft`, e ela quase não aparece.
- **Não passar de 220 ms** em transição, nem animar o que a pessoa vai usar
  cem vezes por dia.
- **Não pôr modo escuro.** É decisão de produto, documentada no princípio 5 do
  README. Se mudar, muda com o Rodrigo, não numa refatoração.
- **Não puxar nada de CDN.** Fonte, ícone, script: tudo mora no repositório.
  É requisito de LGPD do projeto, não preferência.

## O que fazer

- **Camada de cascata explícita.** Toda regra nova entra numa `@layer` que já
  existe: `fontes, tokens, base, layout, componentes, utilitarios, ajustes`.
  O A.R.Q. herdou 17 seletores duplicados cuja ordem dependia da posição no
  arquivo; a razão de existir das camadas aqui é que isso não se repita.
  **Nunca escrever regra fora de camada** — regra sem camada vence todas as
  camadas, e o próximo a mexer vai perder uma tarde com isso.
- **Comentário explica o porquê, não o quê.** `/* filete de 1px */` sobre uma
  linha que diz `border: 1px` é ruído. `/* O gap de 1px deixa o fundo aparecer
  como filete */` é o que se quer ler seis meses depois.
- **Estado vazio é convite.** Todo componente de lista precisa do par
  `.ds-vazio` com uma frase que diga o que fazer, e não "nenhum registro".
- **Todo controle precisa de `:focus-visible`** que se veja sobre o papel *e*
  sobre a lateral escura. Foco é traço, nunca sombra.
- **Toda medida em `rem`**, menos filete (`1px`) e o que é literalmente um pixel.

## Depois de mexer

1. Recarregar `index.html` e olhar. O sistema é visual; diff de CSS mente.
2. Conferir em 390 px de largura. O burger aparece? A gaveta abre?
3. Ligar movimento reduzido no sistema operacional e recarregar.
4. `Ctrl+P`: a folha sai limpa?
5. Se mudou token ou nome de classe, atualizar `README.md` **e** a tabela de
   migração em `DEPLOY-EM-APPS.md`. App vendorado com cópia velha quebra
   silenciosamente.

## Como os apps consomem

Por **cópia** dos arquivos para `static/`, sem symlink e sem pacote. Isso
significa que uma mudança aqui não chega em app nenhum até alguém copiar. Ao
fazer mudança que quebra, escrever na tabela de migração o que renomear —
é o único aviso que o outro lado vai receber.
