'use strict';
/* NEXUS TECH 2026: interações (protótipo acadêmico, sem servidor) */
const Validador = {
  nome: v => v.trim() === '' ? 'Informe seu nome completo.' : '',
  email(v) {
    const e = v.trim();
    if (e === '') return 'Informe seu e-mail.';
    return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(e) ? '' : 'Informe um e-mail válido, como nome@dominio.com.';
  },
  aceite: ok => ok ? '' : 'Para continuar, aceite o aviso de privacidade.'
};
/* Envio demonstrativo: não há integração real; apenas uma espera curta. */
function enviarSimulado() { return new Promise(res => setTimeout(res, 1200)); }

function iniciarNavegacao() {
  const topo = document.getElementById('topo'), btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  const fechar = () => { nav.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => btn.setAttribute('aria-expanded', String(nav.classList.toggle('aberto'))));
  nav.addEventListener('click', e => { if (e.target.closest('a')) fechar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('aberto')) { fechar(); btn.focus(); } });
  const sol = () => topo.classList.toggle('sol', window.scrollY > 24);
  sol(); window.addEventListener('scroll', sol, { passive: true });
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.getAttribute('href') === '#' + en.target.id ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) obs.observe(s); });
  }
}

function iniciarFormulario() {
  const f = document.getElementById('form'); if (!f) return;
  const campos = [
    { el: f.nome, err: document.getElementById('e-nome'), val: () => Validador.nome(f.nome.value) },
    { el: f.email, err: document.getElementById('e-email'), val: () => Validador.email(f.email.value) },
    { el: f.aceite, err: document.getElementById('e-aceite'), val: () => Validador.aceite(f.aceite.checked) }
  ];
  const resumo = document.getElementById('resumo'), retorno = document.getElementById('retorno'), btn = document.getElementById('enviar');
  const mostrar = c => {
    const m = c.val(), box = c.el.closest('.campo');
    c.err.textContent = m; c.err.hidden = !m; box.classList.toggle('invalido', !!m);
    m ? c.el.setAttribute('aria-invalid', 'true') : c.el.removeAttribute('aria-invalid');
    return m;
  };
  campos.forEach(c => {
    c.el.addEventListener('blur', () => { if (c.el.type === 'checkbox' || c.el.value !== '') mostrar(c); });
    c.el.addEventListener('input', () => { if (c.el.closest('.campo').classList.contains('invalido')) mostrar(c); });
    c.el.addEventListener('change', () => { if (c.el.closest('.campo').classList.contains('invalido')) mostrar(c); });
  });
  let enviando = false;
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (enviando) return;
    retorno.hidden = true;
    const erros = campos.filter(c => mostrar(c));
    if (erros.length) {
      resumo.textContent = erros.length === 1 ? 'Há 1 campo para corrigir.' : `Há ${erros.length} campos para corrigir.`;
      resumo.hidden = false; erros[0].el.focus(); return;
    }
    resumo.hidden = true; enviando = true; btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      await enviarSimulado();
      f.reset();
      retorno.className = 'retorno';
      retorno.innerHTML = '<strong>Simulação concluída.</strong> Este é um protótipo acadêmico: nenhum dado foi enviado ou armazenado.';
    } catch (_) {
      retorno.className = 'retorno falha';
      retorno.innerHTML = '<strong>O envio não foi concluído.</strong> Seus dados foram mantidos; tente novamente.';
    } finally {
      retorno.hidden = false; enviando = false; btn.disabled = false; btn.textContent = 'Enviar inscrição';
    }
  });
}

/* Contagem regressiva até 10/12/2026, 08h30 (Brasília). Estados: antes, durante e depois. */
function iniciarContagem() {
  const n = document.getElementById('cont-n'), t = document.getElementById('cont-t'); if (!n) return;
  const ini = new Date('2026-12-10T08:30:00-03:00'), fim = new Date('2026-12-10T18:00:00-03:00');
  const v = ['d', 'h', 'm', 's'].map(k => document.getElementById('c-' + k)), p = x => String(x).padStart(2, '0');
  function tick() {
    const agora = new Date();
    if (agora >= fim) { n.hidden = true; t.textContent = 'O evento já aconteceu. Obrigado a quem participou!'; return false; }
    if (agora >= ini) { n.hidden = true; t.textContent = 'O evento está acontecendo agora, em Brasília – DF.'; return true; }
    let s = Math.floor((ini - agora) / 1000);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    [d, h, m, s].forEach((x, i) => v[i].textContent = p(x));
    n.hidden = false; t.textContent = 'Faltam'; return true;
  }
  if (tick()) { const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000); }
}

/* Filtros da programação (o último filtro escolhido é salvo no LocalStorage) */
function iniciarFiltros() {
  const bs = [...document.querySelectorAll('.filtro')], its = [...document.querySelectorAll('.linha li')], info = document.getElementById('filtro-info');
  const aplicar = b => {
    const f = b.dataset.f; let n = 0;
    bs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    its.forEach(li => { const ok = f === 'todas' || li.dataset.cat === f; li.hidden = !ok; if (ok) n++; });
    info.textContent = f === 'todas' ? `Mostrando todas as ${n} atividades.` : `Mostrando ${n} ${n === 1 ? 'atividade' : 'atividades'} em: ${b.textContent}.`;
    Armazenamento.gravar('filtro', f);
  };
  bs.forEach(b => b.addEventListener('click', () => aplicar(b)));
  const salvo = bs.find(x => x.dataset.f === Armazenamento.ler('filtro', 'todas'));
  if (salvo && salvo.dataset.f !== 'todas') aplicar(salvo);
}

/* Agenda pessoal: o visitante marca atividades e a seleção é mantida no LocalStorage */
function iniciarAgenda() {
  const bts = [...document.querySelectorAll('.agenda-btn')], info = document.getElementById('agenda-info'), limpar = document.getElementById('agenda-limpar');
  if (!bts.length || !info || !limpar) return;
  const ids = bts.map(b => b.dataset.id);
  const sel = new Set(Armazenamento.ler('agenda', []).filter(id => ids.includes(id)));
  let salvou = true;
  const atualizar = () => {
    bts.forEach(b => {
      const on = sel.has(b.dataset.id);
      b.setAttribute('aria-pressed', String(on));
      b.firstElementChild.textContent = on ? 'Na agenda' : 'Adicionar à agenda';
    });
    const n = sel.size;
    info.textContent = (n === 0 ? 'Minha agenda: nenhuma atividade marcada.' : `Minha agenda: ${n} ${n === 1 ? 'atividade marcada' : 'atividades marcadas'}.`)
      + (salvou ? '' : ' O armazenamento do navegador está indisponível: a agenda não será mantida ao recarregar a página.');
    limpar.hidden = n === 0;
  };
  const salvar = () => { salvou = Armazenamento.gravar('agenda', [...sel]); atualizar(); };
  bts.forEach(b => b.addEventListener('click', () => { const id = b.dataset.id; sel.has(id) ? sel.delete(id) : sel.add(id); salvar(); }));
  limpar.addEventListener('click', () => { sel.clear(); salvar(); });
  atualizar();
}

/* Botão voltar ao topo */
function iniciarVoltarTopo() {
  const b = document.getElementById('voltar'); if (!b) return;
  const ver = () => { b.hidden = window.scrollY < 600; };
  ver(); window.addEventListener('scroll', ver, { passive: true });
  b.addEventListener('click', () => { window.scrollTo({ top: 0 }); document.querySelector('.logo').focus({ preventScroll: true }); });
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => { iniciarNavegacao(); iniciarFormulario(); iniciarContagem(); iniciarFiltros(); iniciarAgenda(); iniciarVoltarTopo(); });
if (typeof module !== 'undefined') module.exports = { Validador };
