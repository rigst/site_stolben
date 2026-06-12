SITE / PORTFÓLIO - stolben.com

Página única (portfólio) de Rodrigo Stölben. Estática, sem build.

ESTRUTURA
- index.html       Conteúdo e marcação da página.
- style.css        Estilos (tema "Infra Premium": claro/escuro, azul como acento).
- script.js        Comportamento: surgimento ao rolar (reveal), destaque da
                   seção atual no menu (scrollspy) e cabeçalho ao rolar.
- assets/          Imagens (hero, código, servidores e capas dos projetos).
- favicon.png      Ícone da aba.
- design-system/   Sistema de design reaproveitável (tokens e componentes).

COMO EDITAR OS PROJETOS
Os cards ficam direto no index.html, na seção <section id="projects">.
Cada card é um link <a class="card ..."> que aponta para o sistema em produção.
Para adicionar ou editar um projeto, copie um card existente e ajuste:
- o href (URL do sistema em produção)
- o número (<span class="num">), o título (<h3>) e a descrição (<p>)
- a imagem de capa em assets/ (sempre com width e height na tag <img>)

COMO EDITAR OS TEXTOS
- Hero, Sobre, Tecnologias e Infraestrutura: edite os blocos no index.html.
- Contato: e-mail e GitHub ficam no <footer>.

IMAGENS
Use fotos reais e livres (ex.: Unsplash) coerentes com o tema de cada projeto.
Defina sempre width e height na tag <img> (evita "pulo" de layout ao carregar).
Evite render 3D / "cara de IA" e stock clichê.

PUBLICAÇÃO
O site roda em uma VPS Linux, servido pelo Nginx a partir deste diretório.
Para publicar uma alteração:
1. Edite os arquivos.
2. git add, git commit e git push para a branch main.
Como o Nginx serve este diretório, a alteração entra no ar assim que os
arquivos são salvos no servidor.

CONTATO
rodrigo@stolben.com · github.com/rigst
