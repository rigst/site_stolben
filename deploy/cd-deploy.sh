#!/usr/bin/env bash
set -euo pipefail

# Disparado via SSH pelo usuário "deploy" (authorized_keys com command=
# forçado — ver rigst/ci RUNBOOK.md seção 7). Site estático: sem venv, sem
# systemd, sem sudo — o nginx serve os arquivos direto deste diretório, e
# "deploy" já concluiu ao terminar o merge.

APP_DIR=/var/www/site_stolben
FETCH_URL=https://github.com/rigst/site_stolben.git   # HTTPS anônimo — repo público, sem credencial
HEALTH_URL="https://stolben.com/"
LOCK_FILE=/tmp/site_stolben_cd_deploy.lock

main() {
  local sha
  sha="$(printf '%s' "${SSH_ORIGINAL_COMMAND:-}" | awk '{print $2}')"
  [[ "$sha" =~ ^[0-9a-f]{7,40}$ ]] || { echo "SHA inválido: '$sha'"; exit 1; }

  cd "$APP_DIR"
  git fetch "$FETCH_URL" main
  git merge-base --is-ancestor "$sha" FETCH_HEAD \
    || { echo "SHA não é ancestral do main remoto: $sha"; exit 1; }

  local antes; antes="$(git rev-parse HEAD)"
  git merge --ff-only "$sha"

  local codigo
  codigo="$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL")"
  if [[ ! "$codigo" =~ ^[23][0-9][0-9]$ ]]; then
    echo "Smoke-test falhou ($codigo). Rollback manual: git -C $APP_DIR reset --hard $antes"
    exit 1
  fi

  echo "Deploy de $sha concluído (era $antes)."
}

(
  flock -n 9 || { echo "Deploy já em andamento, saindo."; exit 1; }
  main "$@"
) 9>"$LOCK_FILE"
