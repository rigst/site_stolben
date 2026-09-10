# Segurança

## Reporte

Envie vulnerabilidades de forma privada para **rodrigo@stolben.com**, incluindo
impacto e passos de reprodução. Não abra issue pública antes da correção.

## Escopo

Este repositório é um site estático: HTML, CSS e JavaScript, sem backend, sem
banco de dados, sem autenticação e sem dependências de terceiros em runtime.
A superfície de ataque real é pequena.

Interessa reportar:

- XSS via conteúdo injetado no DOM por `script.js`;
- recurso carregado de origem externa não confiável;
- segredo ou dado pessoal commitado por engano.

Não interessa: ausência de cabeçalhos de segurança na hospedagem (é configuração
do servidor, fora deste repositório) nem relatório automatizado de scanner sem
demonstração de impacto.

## Verificações automáticas

Todo push e PR roda `gitleaks` sobre **todo o histórico** via o pipeline de
[rigst/ci](https://github.com/rigst/ci).
