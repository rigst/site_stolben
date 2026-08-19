# Telas prontas

Ponto de partida para copiar, não biblioteca para importar. Cada arquivo é uma
tela inteira e funcional: abrir no navegador, ver, copiar o que serve.

| Arquivo | Padrão |
|---|---|
| `01-entrada.html` | Login. Foto de tela cheia, formulário de vidro, acesso visitante. |
| `02-lista.html` | Listagem. Faixa com foto, filtros em chip, grade de objetos, estado vazio, modal de criação. |
| `03-ficha.html` | Ficha de um objeto. Quadro de valores, etapas, lembretes, registro em linha e formulário de edição. |

Falta a que talvez seja a mais importante: o **painel**. Ela é a que mais
depende do domínio de cada app (quais indicadores, qual recorte), e copiar um
painel genérico costuma sair pior que montar o seu com `.ds-faixa` +
`.ds-carimbo` + `.ds-kpi-row` — os três estão em `../index.html`.

Para virar template Django: trocar os caminhos por `{% static %}`, extrair o
casco (`<aside class="ds-side">` … `</aside>`) para o `base.html` e deixar cada
tela com o miolo de `.ds-page`.
