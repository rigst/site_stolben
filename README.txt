COMO EDITAR ESTE SITE

1. Abra o arquivo script.js
2. Procure a constante `projects`
3. Cada projeto é um objeto com:
   - category
   - title
   - status
   - description
   - tags
   - liveUrl
   - githubUrl

Exemplo:

{
  category: "Python",
  title: "Meu Projeto",
  status: "Publicado",
  description: "Uma descrição curta e clara.",
  tags: ["Python", "Flask"],
  liveUrl: "https://seuprojeto.com",
  githubUrl: "https://github.com/seuusuario/seurepo"
}

COMO PUBLICAR NO GITHUB PAGES

1. Crie um repositório no GitHub
2. Envie os arquivos index.html, style.css e script.js
3. Vá em Settings > Pages
4. Em Build and deployment, escolha:
   - Source: Deploy from a branch
   - Branch: main / root
5. Salve
6. O GitHub vai gerar o link do site

ANTES DE PUBLICAR

- Troque SEUUSUARIO pelo seu usuário do GitHub
- Troque SEUEMAIL@EXEMPLO.COM pelo seu email
- Troque o nome do domínio no topo
- Atualize os textos da seção Sobre
