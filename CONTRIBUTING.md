# Contribuindo

Este repositório é o portfólio pessoal de Rodrigo Stölben. O **conteúdo** (textos,
fotos, lista de projetos) é pessoal e não recebe contribuição externa.

O que é bem-vindo:

- correção de bug de layout, acessibilidade ou responsividade;
- melhoria de performance (imagem, fonte, carregamento);
- correção de erro de digitação;
- melhoria no `design-system/` e no `stolben-ui/`, que são reaproveitados pelos
  outros projetos.

## Rodar

Não há build:

```bash
python3 -m http.server 8000
```

## O que o CI exige

O pipeline de [rigst/ci](https://github.com/rigst/ci) verifica duas coisas:

1. `gitleaks` sobre todo o histórico — nenhum segredo commitado;
2. todo `href`/`src` local aponta para um arquivo que existe.

O segundo é o que mais pega na prática: renomear uma imagem em `assets/` sem
atualizar o `index.html` reprova o PR.

## Convenções

- Imagens sempre com `width` e `height` explícitos na tag `<img>`, para não
  causar deslocamento de layout durante o carregamento.
- CSS usa os tokens do `design-system/`; evite valor cru onde existe token.
- Mensagens de commit em português.

## Licença das contribuições

Ao enviar um PR você concorda em licenciar sua contribuição sob a
[AGPL-3.0](LICENSE). Isso vale para o código — a identidade visual, o nome e as
fotografias seguem sendo conteúdo pessoal, não cobertos pela licença.
