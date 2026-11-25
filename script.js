(function () {
  // Lista "no ar agora" da home: lê o status.json gerado pelo cron na VPS
  // (.scripts/check-status.sh, a cada 5 minutos). O HTML traz só os domínios;
  // o estado de cada um vem daqui. Sem o arquivo, a lista diz que não há
  // dado em vez de afirmar que está tudo online.
  var live = document.querySelector('[data-status]');
  if (!live) return;

  var list = live.querySelector('.live-list');
  var when = live.querySelector('[data-status-checked]');

  function semDados() {
    when.textContent = 'status indisponível';
    list.querySelectorAll('.st').forEach(function (st) { st.textContent = 'sem dados'; });
  }

  function rowFor(host) {
    var rows = list.querySelectorAll('li');
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute('data-host') === host) return rows[i];
    }
    // Sistema novo no status.json que ainda não está no HTML: entra no fim.
    var li = document.createElement('li');
    var name = document.createElement('span');
    var st = document.createElement('span');
    li.setAttribute('data-host', host);
    name.textContent = host;
    st.className = 'st';
    li.appendChild(name);
    li.appendChild(st);
    list.appendChild(li);
    return li;
  }

  function idade(checked) {
    var d = new Date(checked);
    if (isNaN(d)) return null;
    var min = Math.floor((Date.now() - d.getTime()) / 60000);
    if (min < 1) return 'verificado agora';
    if (min < 60) return 'verificado há ' + min + ' min';
    var h = Math.floor(min / 60);
    if (h < 48) return 'verificado há ' + h + ' h';
    return 'verificado em ' + d.toLocaleDateString('pt-BR');
  }

  if (!window.fetch) { semDados(); return; }

  fetch('/status.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.services)) { semDados(); return; }
      data.services.forEach(function (s) {
        if (!s || typeof s.host !== 'string') return;
        var st = rowFor(s.host).querySelector('.st');
        var code = Number(s.code) || 0;
        var ok = code >= 200 && code < 400;
        st.textContent = ok ? 'online' : (code ? 'fora do ar · ' + code : 'sem resposta');
        st.classList.toggle('on', ok);
        st.classList.toggle('off', !ok);
      });
      list.querySelectorAll('.st').forEach(function (st) {
        if (!st.classList.contains('on') && !st.classList.contains('off')) st.textContent = 'sem dados';
      });
      when.textContent = idade(data.checked) || 'verificado';
    })
    .catch(semDados);
})();
