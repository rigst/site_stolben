#!/usr/bin/env bash
# Verifica os sistemas *.stolben.com e grava status.json na raiz do site.
# Rodado pelo cron a cada 5 minutos; o painel "Sistemas no ar" lê esse JSON.
set -u
OUT=/var/www/site_stolben/status.json
TMP=$(mktemp "${OUT}.XXXXXX")
HOSTS=(divisor.stolben.com orcamentos.stolben.com financas.stolben.com trilhas.stolben.com vetorial.stolben.com)

{
  printf '{"checked":"%s","services":[' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  sep=""
  for h in "${HOSTS[@]}"; do
    code=$(curl -skL --max-redirs 5 -o /dev/null -w '%{http_code}' --max-time 10 "https://${h}/" || echo 000)
    printf '%s{"host":"%s","code":%d}' "$sep" "$h" "$((10#$code))"
    sep=","
  done
  printf ']}'
} > "$TMP"

chmod 644 "$TMP"
mv "$TMP" "$OUT"
