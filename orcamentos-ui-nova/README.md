# Nova UI — Sistema de Orçamentos (protótipo)

Reconstrução **do zero** da interface do `sistema_orcamentos` sobre o design system
**Stölben UI** (`/var/www/site_stolben/stolben-ui`). Estático, para revisão antes de
levar à produção. Nenhum elemento da UI antiga foi reaproveitado — só os tokens e
componentes `.ds-*` do DS.

- **Tema de acento:** `ds-theme-indigo` (no `<html>` de cada página), fontes do DS (Inter/Manrope).
- **Camada de polimento:** `assets/orca-theme.css` — refinos sóbrios *dentro* da identidade do DS
  (não troca fontes/cores/cantos): barra de acento no item ativo da sidebar, hierarquia melhor nos
  indicadores (numeral maior, rótulo em versalete, tick), kicker com régua, profundidade discreta
  em cartões/tabelas e elevação leve no hover (respeita `prefers-reduced-motion`).
- **Navegação sem barra superior:** tudo na sidebar — favicon antes da marca, **cartão do usuário no topo**
  e **seletor de tema (claro/auto/escuro) no rodapé**. No mobile, um hambúrguer flutuante abre a gaveta.
- **Modo claro/escuro/automático:** controle de 3 vias no rodapé da sidebar (persiste em `localStorage`).
- **Relatório em modal:** as opções de "o que aparece no relatório" + exportações (PDF, Excel, memorial)
  ficam num modal acessível pelo botão **Relatório** (no detalhe e na barra de ações do formulário) —
  fora da edição do orçamento.
- **Mobile:** sidebar vira gaveta off-canvas (hambúrguer + backdrop); grades empilham; tabelas rolam.

## Como abrir

É HTML puro — abra `index.html` no navegador, ou sirva a pasta:

```bash
cd /var/www/site_stolben/orcamentos-ui-nova
python3 -m http.server 8765   # depois acesse http://localhost:8765/
```

Comece por **`index.html`** (hub que lista todas as telas).

## Telas

| Arquivo | Tela | Destaques |
|---|---|---|
| `login.html` | Login | Split com painel de marca escuro + form |
| `dashboard.html` | Dashboard | Receita de dashboard: stats + gráfico de barras + tabela dos últimos |
| `orcamentos.html` | Orçamentos (lista) | **Tabela** — filtros, status, menu de ações, paginação |
| `orcamento-detalhe.html` | Orçamento (ver) | Detalhe: abas, itens por categoria, timeline, card de totais (sticky) |
| `orcamento-form.html` | Orçamento (criar/editar) | Formulário: seções, evento em accordion, itens via drawer, ajustes, switches |
| `clientes.html` | Clientes | **Tabela** — drawer de edição, modal de criação |
| `itens.html` | Catálogo · Itens | **Grade de cards** — modal novo, importar Excel |
| `categorias.html` | Catálogo · Categorias | **Lista compacta** — cor como identidade, modais |
| `empresa.html` | Empresa | Formulário com abas: identificação (logo), financeiro, textos do PDF |

### Visualização por entidade (uma só, conforme §2.6 do DS)

Cada página tem **um** tipo de visualização, escolhido pela tarefa:

- **Orçamentos → Tabela**: comparar muitos por colunas (total em `tabular-nums`), ordenar, filtrar.
- **Clientes → Tabela**: comparar por colunas (documento, contato, cidade, status).
- **Itens → Grade de cards**: catálogo visual, valor em destaque por card.
- **Categorias → Lista compacta**: poucos registros, cor como identidade, leitura rápida.
- **Dashboard**: composto por natureza (indicadores + gráfico + tabela-resumo).

## Dados

Todos os dados são de exemplo (orçamentos de montagem de estandes/eventos). Modais e
drawers abrem de verdade (JS do DS), mas nada persiste.

## Levar à produção

O app real é Django (`/var/www/sistema_orcamentos/current`), com `templates/base.html`
e `static/css/`. Para promover, converter cada tela estática nos templates Django
correspondentes, reaproveitando o `base.html` (sidebar + topbar) e ligando aos `{% url %}`
e variáveis de contexto existentes. Ver `DEPLOY-EM-APPS.md` do DS para vendoring/quebras.
