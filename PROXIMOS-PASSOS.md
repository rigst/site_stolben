# Próximos passos

Documento de trabalho para tocar tarefas longas com a IA em várias sessões.
Ele existe porque a sessão da IA não lembra nada da conversa anterior: o que
não estiver escrito aqui, some.

## Como usar

**No começo de uma sessão**, aponte a IA para este arquivo:

> leia /var/www/site_stolben/PROXIMOS-PASSOS.md e siga de onde parou

**No fim de uma sessão**, peça para ela atualizar:

> atualiza o PROXIMOS-PASSOS.md com o que foi feito

## Como manter

Quatro regras que fazem este arquivo continuar útil depois do terceiro mês:

1. **Item concluído não é apagado, é movido** para o "Registro do que foi
   feito", com a data. Apagar destrói a única resposta para "por que isso está
   assim?" seis meses depois.
2. **Marque `[x]` só quando estiver verificado**, não quando o código foi
   escrito. "Corrigi o mypy" e "o mypy passa" são fatos diferentes.
3. **Escreva o próximo passo com detalhe suficiente para outra pessoa executar**
   — nome de arquivo, comando, valor esperado. "Arrumar o Sonar" não é tarefa;
   "excluir `scripts/**` da análise porque o S2083 é taint sobre conteúdo lido
   de arquivo" é.
4. **Anote o que foi decidido e descartado**, não só o que foi feito. A seção
   "Decisões tomadas" evita reabrir a mesma discussão.

## Contexto permanente

- O código dos projetos Django vive em `/var/www`, **não** no home. As árvores
  de `/var/www` são de produção: para editar, clone do GitHub num diretório de
  trabalho e nunca commite de lá.
- O CI é centralizado em **github.com/rigst/ci**, como reusable workflows.
  Para mexer no pipeline de qualquer projeto, edite aquele repositório — não
  acrescente steps ao `ci.yml` do projeto.
- O `ci.yml` dos projetos dispara em `push` só na `main` e em `pull_request`.
  Push de branch de trabalho não roda nada: **para ver o CI, abra o PR**.
- Reproduzir o lint local exige a config do CI:
  `ruff check --config .ci-shared/configs/ruff.toml .`. Rodar `ruff check .`
  dentro do projeto usa outra configuração e produz ruído que o CI não cobra.

---

# Trabalho em andamento: CI completa em sistema_orcamentos e sistema_financas

**Objetivo:** os dois projetos com as doze etapas do pipeline compartilhado
ligadas, `soft-fail` vazio, e verdes no Codecov e no SonarCloud.

**Estado:** o trabalho de código está feito e verificado localmente. Falta
escrever o `ci.yml`, publicar e fechar o Quality Gate com dados reais.

## Onde está o trabalho não publicado

> **Atenção:** 7 commits que ainda não estão no GitHub.

```
/home/rod/ci-completa-wip/sistema_orcamentos   branch ci-completa   3 commits
/home/rod/ci-completa-wip/sistema_financas     branch ci-completa   4 commits
```

Primeira coisa a fazer numa sessão nova: `git log --oneline main..HEAD` nos
dois, para confirmar que os commits continuam lá.

## O que falta

### 1. Escrever o `ci.yml` completo nos dois projetos

- [ ] Ligar as cinco etapas novas: `run-licencas`, `run-sbom`, `run-lock`,
      `run-e2e`, `run-a11y` — todas em `true`.
- [ ] `soft-fail: ""` (lista vazia = nada tolerado). O ruff e o mypy saem
      porque estão zerados; ver o registro abaixo.
- [ ] `run-sonar: true`, com `sonar-project-key: rigst_sistema_orcamentos` /
      `rigst_sistema_financas` e `sonar-organization: rigst`.
- [ ] `sonar-args` precisa de três coisas:
      - `-Dsonar.qualitygate.wait=true` — sem isso o job termina verde assim que
        envia a análise, e o gate reprovando não aparece no CI;
      - `-Dsonar.exclusions=scripts/**` — resolve o BLOCKER `pythonsecurity:S2083`
        em `legal_css.py`, que é taint sobre o **conteúdo** lido de um arquivo,
        não sobre o caminho. `scripts/` é ferramenta de desenvolvedor, já
        omitida do `.coveragerc` e do `testpaths` do pytest;
      - `-Dsonar.coverage.exclusions=...` repetindo a lista do pipeline
        compartilhado **mais** `scripts/**` — propriedade repetida no scanner é
        substituída, não somada, então sem copiar o resto as migrações e os
        testes voltam a contar.
- [ ] `a11y-paths` com as cinco páginas já medidas: `/login/`, `/termos/`,
      `/privacidade/`, `/legal/aceite/`, `/admin/login/`.
- [ ] `a11y-setup-command: python manage.py importar_documentos_legais --publicar`
      — sem isso `/termos/` e `/privacidade/` levantam Http404 e a auditoria
      mede uma página de erro.
- [ ] `a11y-fail-on: serious` — as cinco páginas passam com zero violações nos
      dois projetos, então não há passivo a tolerar.
- [ ] Fixar o `uses` no SHA em vez da tag, com o comentário `# v1` ao lado para
      o Dependabot ler. Resolve `githubactions:S7637`.
      SHA atual da `v1`: `934b4f046dcedc840ec32b9886d5bf5d99e58812`
- [ ] Trocar `secrets: inherit` pela lista explícita (`CODECOV_TOKEN` e
      `SONAR_TOKEN`). Resolve `githubactions:S7635`.
- [ ] **Atualizar `core/tests.py` nos dois.** Existe um teste que afirma
      `"rigst/ci/.github/workflows/python-django.yml@v1"` no conteúdo do
      `ci.yml`; com o pin em SHA ele quebra. O teste protege o encanamento (que
      o repo continue ligado ao CI compartilhado), então a asserção deve passar
      a aceitar o SHA, não sumir.

Use o `ci.yml` do `sistema_arq` como modelo — ele já tem o pin em SHA, os
secrets explícitos e o `sonar-args` completo:

```bash
gh api repos/rigst/sistema_arq/contents/.github/workflows/ci.yml --jq .content | base64 -d
```

### 2. Publicar e abrir os dois PRs

- [ ] `git push -u origin ci-completa` nos dois.
- [ ] Abrir PR em cada um. É a única forma de ver o pipeline rodar.
- [ ] Conferir que os doze jobs aparecem e que o `resultado` fecha verde.

### 3. Fechar o Quality Gate com dados reais

O gate é o "Sonar way" padrão. Duas condições ainda não foram exercitadas:

- [ ] **`new_coverage < 80`** — hoje inativa por falta de dados; ativa assim que
      o CI enviar o `coverage.xml`. Cobertura total: 80% no orçamentos, 74% no
      finanças. O que conta é a cobertura do **código novo**, não a total, então
      só dá para saber depois da primeira análise. Se reprovar, escrever teste
      para o que a análise apontar — não baixar o limite.
- [ ] **`new_duplicated_lines_density > 3`** — o finanças está em **4,9%**
      contra o limite de 3%. Precisa achar os blocos duplicados e extrair o
      trecho comum. O orçamentos está em 1,3% e passa.
- [ ] Confirmar que o `new_security_rating` voltou para 1 nos dois. Ele estava
      em 3; as correções já foram feitas (ver registro), mas só a análise do CI
      confirma.

Consultar o gate sem abrir o navegador:

```bash
curl -s "https://sonarcloud.io/api/qualitygates/project_status?projectKey=rigst_sistema_financas" \
  | python3 -m json.tool
```

## Decisões tomadas

- **Corrigir no código, não marcar como "won't fix" no Sonar.** Foi o caminho
  do `sistema_arq`, que tem os 52 achados dele como `FIXED`.
- **A exceção é `scripts/**`**, excluído da análise por ser ferramenta de
  desenvolvedor que a aplicação nunca importa — consistente com o `.coveragerc`
  e com o `testpaths`, que já o omitem.
- **Nenhum `# type: ignore`** nas correções de mypy: o objetivo é o portão
  fechar de verdade depois.
- **Não usar `ruff --fix` sem `--select`.** Ele apaga o import de signals dentro
  do `ready()` dos AppConfig (F401), desligando os receivers em silêncio, e o
  build segue verde. Nas correções foi usado `--select I --fix`, só ordenação
  de imports.
- **Os tokens do SonarCloud foram passados em conversa** e gravados como secret
  nos dois repositórios. Vale rotacioná-los depois que o pipeline estabilizar:
  gerar novos em sonarcloud.io/account/security e repetir o `gh secret set`.

## Registro do que foi feito

### 2026-08-19 — código pronto para o portão fechar

**ruff — 9 achados no orçamentos e 11 no finanças, zerados.** DJ012 (ordem do
`save` nos models), B904, B905, B023, B034, E741, F841, RUF005 e um arquivo
fora de formatação. Sai do `soft-fail`.

**mypy — 68 erros no orçamentos e 32 no finanças, zerados.** Não eram 100
problemas distintos: 24 vinham do `PerfilAdminPermissionMixin` declarar as
capabilities como `None`; 13, de navegação por FK anulável guardada pelo `_id`;
12, do `SerieCompetenciaMixin` ler campos que quem declara são a Receita e a
Despesa; 6, de atributo de classe criado só por atribuição dentro do `save`.
Sai do `soft-fail`.

**Segurança (SonarCloud).** O `MD5PasswordHasher` saiu do settings e entrou
`core/hashers.py` com PBKDF2 de uma iteração. 61 literais
`password="senha-forte-123"` viraram `SENHA_TESTE`, sorteada por processo em
`core/testing.py`. 19 views somente-leitura ganharam `@require_safe`. O `|safe`
dos três templates legais virou a property `corpo_seguro`, que põe a afirmação
de confiança ao lado do `publicar()`, que é quem sanitiza com nh3.

**`IS_TEST` passou a reconhecer o pytest.** Detectava só `manage.py test`, então
o bloco `if IS_TEST` nunca valia para a suíte que o CI roda — ela rodava com o
hasher de produção e com o `HEALTHZ_TOKEN` do ambiente. Efeito colateral bom:
os testes caíram de **70s para 8s** no orçamentos e de **53s para 6s** no
finanças.

**Acessibilidade — 0 violações nas cinco páginas públicas dos dois projetos**,
medido com axe-core em WCAG 2.1 AA. Dois defeitos reais corrigidos:

- Links dentro de texto corrido nas telas legais eram distinguidos só pela cor
  (WCAG 1.4.1, impacto `serious`). Ganharam sublinhado, no
  `sistema_financas/scripts/legal_css.py`, que é a fonte do bloco em todos os
  projetos, e no CSS já gerado.
- O `/admin/login/` do finanças reprovava em contraste. O django-unfold usa
  `primary-600` como fundo de botão com texto branco, e o verde escolhido dava
  3,77:1 contra os 4,5:1 exigidos. A rampa foi deslocada um degrau a partir do
  600 (o 700 antigo dá 5,48:1) — mesma família de cor, um tom mais fundo. O
  orçamentos não precisava: o azul dele já dava 5,17:1.

**Infraestrutura.** `requirements.lock` com hashes gerado e conferido nos dois
(resolvido para 3.12, a versão de produção e do CI). Testes e2e em Chromium
escritos e passando nos dois (`core/tests_e2e.py`, 3 testes cada), com o
marcador `e2e` declarado no `pytest.ini`. `SONAR_TOKEN` configurado como secret
nos dois repositórios.

**Suítes:** 181 testes no orçamentos e 99 no finanças, todos passando.

### Achado que não virou tarefa

Os settings dos dois projetos carregam
`/var/www/<projeto>/shared/.env` como fallback quando nenhum `DJANGO_ENV_FILE`
é informado. Rodar a suíte a partir de um clone nesta máquina faz o teste do
`healthz` falhar com 404, porque ele pega o `DJANGO_HEALTHZ_TOKEN` **real** de
produção. No CI o arquivo não existe e passa.

Não é defeito do CI e não bloqueia nada, mas vale decidir se um clone de
trabalho deveria mesmo enxergar o `.env` de produção. Contorno para rodar
local: `DJANGO_ENV_FILE=/caminho/para/arquivo-vazio`.
