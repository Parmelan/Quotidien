/* Mon quotidien – outil personnel. Toutes les données restent dans ce navigateur (localStorage). */
'use strict';

/* ============================== Outils ============================== */
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const addMonths = (s, n) => {
  const d = parse(s); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + Number(n));
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return iso(d);
};
const addUnit = (s, n, u) => u === 'days' ? addDays(s, n) : u === 'weeks' ? addDays(s, 7 * n) : addMonths(s, n);
const diff = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const fmt = (s, o) => s ? new Intl.DateTimeFormat('fr-FR', o).format(parse(s)) : '';
const sameYear = s => s && s.slice(0, 4) === today().slice(0, 4);
const fDay = s => s ? fmt(s, sameYear(s) || Math.abs(diff(today(), s)) < 300 ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const fLong = s => fmt(s, { weekday: 'long', day: 'numeric', month: 'long' });
const fMonth = s => s ? fmt(s, sameYear(s) || Math.abs(diff(today(), s)) < 300 ? { month: 'long' } : { month: 'long', year: 'numeric' }) : '';
const fShort = s => {
  if (!s) return '';
  const d = diff(today(), s);
  if (d === 0) return "aujourd'hui";
  if (d === 1) return 'demain';
  if (d > 1 && d < 7) return fmt(s, { weekday: 'short', day: 'numeric' });
  return fDay(s);
};
const ago = days => days < 60 ? `${days} j` : days < 365 ? `${Math.round(days / 30)} mois` : `${Math.floor(days / 365)} an${days >= 730 ? 's' : ''}`;
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ym = s => s.slice(0, 7);
const monthsBetween = (a, b) => { const [y1, m1] = a.split('-').map(Number); const [y2, m2] = b.split('-').map(Number); return (y2 - y1) * 12 + (m2 - m1); };
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;
const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* ============================== Icônes ============================== */
const IC = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  suitcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
  folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h12L22 7H6"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M12 8C10 4 7 4 7 6.5S10 8 12 8zm0 0c2-4 5-4 5-1.5S14 8 12 8z"/>',
  ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  other: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="12" r=".6"/><circle cx="12" cy="12" r=".6"/><circle cx="16" cy="12" r=".6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  chevR: '<path d="M9 6l6 6-6 6"/>',
  chevL: '<path d="M15 6l-6 6 6 6"/>',
  inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13l2.5 8v6H3v-6z"/>',
  review: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2 2.3-2.2M4 18l1.2 1.2 2.3-2.2"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9a4 4 0 0 1 0 9"/><path d="M12 12v8M9 15l3-3 3 3"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  calPlus: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M12 13v4M10 15h4"/>',
  pill: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/>',
  train: '<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M8 20l1.5-4M16 20l-1.5-4"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  bus: '<rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 10h16M8 21v-4M16 21v-4"/>',
  car: '<path d="M5 17h14v-5l-2-5H7l-2 5z"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  clip: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
};
const ico = (n, s = 18) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;

const RUB = {
  sante: { label: 'Santé', icon: 'heart', bg: '#FCE8EF', fg: '#A3214F', href: '#sante' },
  voyages: { label: 'Voyages', icon: 'suitcase', bg: '#E8EAFD', fg: '#3B3FBF', href: '#voyages' },
  projets: { label: 'Projets', icon: 'folder', bg: '#EEE8FB', fg: '#5B34B0', href: '#projets' },
  corvees: { label: 'Corvées', icon: 'home', bg: '#E1F2EF', fg: '#0F6B63', href: '#corvees' },
  achats: { label: 'Achats', icon: 'cart', bg: '#FDF0DC', fg: '#8F5200', href: '#achats' },
  anniversaires: { label: 'Anniversaires', icon: 'gift', bg: '#FBE9E4', fg: '#9A3412', href: '#anniversaires' },
  bons: { label: 'Bons cadeaux', icon: 'ticket', bg: '#FBE9E4', fg: '#9A3412', href: '#bons' },
  problemes: { label: 'Problèmes', icon: 'alert', bg: '#EDEDEA', fg: '#4A4A52', href: '#problemes' },
  papiers: { label: 'Papiers', icon: 'file', bg: '#EDEDEA', fg: '#4A4A52', href: '#papiers' },
  autre: { label: 'Autre', icon: 'other', bg: '#EDEDEA', fg: '#4A4A52', href: '#autre' },
};
const icBox = (rub, icon) => { const r = RUB[rub] || RUB.autre; return `<span class="ic" style="background:${r.bg};color:${r.fg}">${ico(icon || r.icon)}</span>`; };
const MODES = { train: ['Train', 'train'], avion: ['Avion', 'plane'], bus: ['Bus', 'bus'], voiture: ['Voiture', 'car'] };

/* ============================== Données ============================== */
const KEY = 'mon-quotidien-v1';

function seed() {
  const t = today();
  return {
    version: 1,
    settings: { backupEveryDays: 7, lastBackup: null, soonDays: 30, lastReview: null, snooze: {}, ack: {}, createdAt: t },
    inbox: [],
    tasks: [],
    chores: [
      { id: uid(), title: 'Lessive', min: 1, max: 2, unit: 'weeks', weekday: 3, lastDone: null },
      { id: uid(), title: 'Commande de courses', min: 1, max: 1, unit: 'weeks', weekday: 4, lastDone: null },
      { id: uid(), title: 'Courses sur place', min: 1, max: 1, unit: 'weeks', weekday: null, lastDone: null },
      { id: uid(), title: 'Sortir la poubelle', min: 1, max: 1, unit: 'weeks', weekday: 6, lastDone: null },
      { id: uid(), title: 'Arroser les plantes', min: 1, max: 1, unit: 'weeks', weekday: 6, lastDone: null },
      { id: uid(), title: 'Aspirateur', min: 3, max: 3, unit: 'weeks', weekday: null, lastDone: null },
      { id: uid(), title: 'Ménage cuisine et salle de bain', min: 2, max: 2, unit: 'months', weekday: null, lastDone: null },
      { id: uid(), title: 'Lessive des draps', min: 2, max: 2, unit: 'months', weekday: null, lastDone: null },
      { id: uid(), title: 'Imperméabiliser les chaussures', min: 1, max: 1, unit: 'months', weekday: null, lastDone: null },
    ],
    health: {
      pharmacy: { everyMonths: 3, lastDone: null, regular: ['Pilule', 'Vitamine D'], extras: [] },
      prescription: { start: null, count: 12, days: 28, alertMonths: 2 },
      practitioners: [
        { id: uid(), name: 'Mme Nigron', mode: 'planned', minMonths: 4, maxMonths: 6, aheadMin: 2, aheadMax: 3, lastVisit: null, booked: null, bookedTime: '', cap: true },
        { id: uid(), name: 'Ostéopathe', mode: 'asneeded', lastVisit: null, booked: null, bookedTime: '', cap: true },
      ],
      exams: [
        { id: uid(), name: 'Dentiste', everyMonths: 12, lastDone: null, note: '' },
        { id: uid(), name: 'Frottis', everyMonths: 36, lastDone: null, note: 'Tous les 3 ans avant 30 ans, puis test HPV tous les 5 ans' },
        { id: uid(), name: 'Ophtalmologue', everyMonths: 36, lastDone: null, note: '' },
        { id: uid(), name: 'Rappel vaccin diphtérie, tétanos, coqueluche, polio', everyMonths: 240, lastDone: null, note: 'Rappels recommandés à 25, 45 et 65 ans' },
      ],
      claims: [],
      capMax: 3,
    },
    trips: [],
    travelCards: [{ id: uid(), kind: 'card', name: 'Carte Avantage', value: '', expires: null, note: '' }],
    projects: [],
    birthdays: [],
    giftLists: [],
    giftIdeas: [],
    vouchers: [],
    problems: [],
    papers: {
      types: [
        { id: uid(), name: 'Fiche de paie', every: 1, day: 28, since: ym(t), folder: '', source: '' },
        { id: uid(), name: 'Relevé de compte', every: 1, day: 5, since: ym(t), folder: '', source: '' },
      ],
      done: {},
    },
    amazon: [],
  };
}

function migrate(d) {
  const s = seed();
  for (const k of Object.keys(s)) if (d[k] === undefined) d[k] = s[k];
  d.settings = Object.assign({}, s.settings, d.settings);
  d.health = Object.assign({}, s.health, d.health);
  d.papers = Object.assign({}, s.papers, d.papers);
  return d;
}

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return migrate(JSON.parse(raw)); } catch (e) { console.error(e); }
  return seed();
}
let DB = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(DB)); }
  catch (e) { toast("Impossible d'enregistrer : " + e.message); }
}
function commit(msg) { save(); render(); if (msg) toast(msg); }
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

/* ============================== Actions (délégation) ============================== */
let N = 0; const PA = new Map(); const SA = new Map(); let sheetOpen = false;
const A = fn => { const id = 'a' + (++N); (sheetOpen ? SA : PA).set(id, fn); return `data-a="${id}"`; };

let swipeGuard = false;
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  const front = el.closest('.sw .row');
  if (front && el === front) {
    if (swipeGuard) { e.preventDefault(); return; }
    if (front.classList.contains('open')) { front.classList.remove('open'); e.preventDefault(); return; }
  }
  const fn = SA.get(el.dataset.a) || PA.get(el.dataset.a);
  if (fn) { e.preventDefault(); fn(el, e); }
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-a]')) { e.preventDefault(); e.target.click(); }
  if (e.key === 'Escape' && sheetOpen) closeSheet();
});

/* Glisser une ligne vers la gauche */
let SW = null;
document.addEventListener('touchstart', e => {
  const f = e.target.closest('.sw .row'); if (!f) return;
  document.querySelectorAll('.sw .row.open').forEach(o => { if (o !== f) o.classList.remove('open'); });
  SW = { f, x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, base: f.classList.contains('open') ? -224 : 0, lock: null };
}, { passive: true });
document.addEventListener('touchmove', e => {
  if (!SW) return;
  const t = e.touches[0], dx = t.clientX - SW.x, dy = t.clientY - SW.y;
  if (SW.lock === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) SW.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (SW.lock !== 'x') return;
  SW.dx = dx; const v = Math.min(0, Math.max(-224, SW.base + dx));
  SW.f.style.transition = 'none'; SW.f.style.transform = `translateX(${v}px)`;
}, { passive: true });
document.addEventListener('touchend', () => {
  if (!SW) return; const f = SW.f; f.style.transition = ''; f.style.transform = '';
  if (SW.lock === 'x') { f.classList.toggle('open', SW.base + SW.dx < -70); swipeGuard = true; setTimeout(() => { swipeGuard = false; }, 400); }
  SW = null;
});

/* ============================== Feuilles (formulaires) ============================== */
function openSheet(build) {
  sheetOpen = true; SA.clear();
  const html = build();
  const root = document.getElementById('sheet-root');
  root.innerHTML = `<div class="ov" data-ov="1"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
  sheetOpen = false;
  root.querySelector('.ov').addEventListener('click', e => { if (e.target.dataset.ov) closeSheet(); });
  const f = root.querySelector('[autofocus]'); if (f) setTimeout(() => f.focus(), 60);
  return root;
}
function closeSheet() { document.getElementById('sheet-root').innerHTML = ''; SA.clear(); }
function sheetHead(title) { return `<div class="sheet-head"><h3>${esc(title)}</h3><button class="link" ${A(closeSheet)}>Fermer</button></div>`; }

/* fields: {k,label,type,value,options,help,placeholder,min,max,step} ; types: text, textarea, date, month, time, number, select, check, lines, seg */
function fieldHTML(f) {
  const id = 'f_' + f.k;
  const v = f.value ?? '';
  switch (f.type) {
    case 'textarea': return `<div class="field"><label for="${id}">${esc(f.label)}</label><textarea id="${id}" name="${f.k}" placeholder="${esc(f.placeholder || '')}">${esc(v)}</textarea>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
    case 'lines': return `<div class="field"><label for="${id}">${esc(f.label)}</label><textarea id="${id}" name="${f.k}" data-lines="1" placeholder="Un élément par ligne">${esc((v || []).join('\n'))}</textarea>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
    case 'select': return `<div class="field"><label for="${id}">${esc(f.label)}</label><select id="${id}" name="${f.k}">${f.options.map(([ov, ol]) => `<option value="${esc(ov)}"${String(ov) === String(v) ? ' selected' : ''}>${esc(ol)}</option>`).join('')}</select>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
    case 'seg': return `<div class="field"><span class="lbl">${esc(f.label)}</span><div class="seg">${f.options.map(([ov, ol]) => `<label><input type="radio" name="${f.k}" value="${esc(ov)}"${String(ov) === String(v) ? ' checked' : ''}><span>${esc(ol)}</span></label>`).join('')}</div>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
    case 'check': return `<label class="checkline"><input type="checkbox" name="${f.k}"${v ? ' checked' : ''}>${esc(f.label)}</label>`;
    case 'number': return `<div class="field"><label for="${id}">${esc(f.label)}</label><input type="number" inputmode="decimal" id="${id}" name="${f.k}" value="${esc(v)}"${f.min != null ? ` min="${f.min}"` : ''}${f.step ? ` step="${f.step}"` : ''}>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
    default: return `<div class="field"><label for="${id}">${esc(f.label)}</label><input type="${f.type || 'text'}" id="${id}" name="${f.k}" value="${esc(v)}" placeholder="${esc(f.placeholder || '')}"${f.autofocus ? ' autofocus' : ''}>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
  }
}
function readForm(root, fields) {
  const out = {};
  for (const f of fields) {
    if (f.type === 'seg') { const c = root.querySelector(`input[name="${f.k}"]:checked`); out[f.k] = c ? c.value : null; continue; }
    const el = root.querySelector(`[name="${f.k}"]`); if (!el) continue;
    if (f.type === 'check') out[f.k] = el.checked;
    else if (f.type === 'number') out[f.k] = el.value === '' ? null : Number(el.value);
    else if (f.type === 'lines') out[f.k] = el.value.split('\n').map(s => s.trim()).filter(Boolean);
    else out[f.k] = el.value.trim() === '' ? null : el.value.trim();
  }
  return out;
}
function form({ title, fields, submit = 'Enregistrer', onSave, onDelete, deleteLabel = 'Supprimer', extra = '', required = [] }) {
  const root = openSheet(() => `${sheetHead(title)}${fields.map(fieldHTML).join('')}${extra}
    <p class="err" hidden></p>
    <div class="btns">${onDelete ? `<button class="btn danger" ${A(() => { if (confirm('Supprimer définitivement ?')) { onDelete(); closeSheet(); commit('Supprimé'); } })}>${esc(deleteLabel)}</button>` : ''}
    <button class="btn primary" data-submit="1">${esc(submit)}</button></div>`);
  root.querySelector('[data-submit]').addEventListener('click', () => {
    const v = readForm(root, fields);
    const miss = required.find(k => v[k] == null || v[k] === '');
    if (miss) { const er = root.querySelector('.err'); er.hidden = false; er.textContent = `Renseigne « ${fields.find(f => f.k === miss).label} ».`; return; }
    if (onSave(v) === false) return;
    closeSheet(); commit();
  });
  return root;
}
function askDate(title, value, cb, { label = 'Date', help } = {}) {
  form({ title, fields: [{ k: 'd', label, type: 'date', value: value || today(), help }], submit: 'Valider', required: ['d'], onSave: v => cb(v.d) });
}

let toastT;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

/* ============================== Calculs ============================== */
function rhythm(c) {
  const u = c.unit || 'weeks', min = +c.min || 1, max = Math.max(+c.max || min, min);
  const un = { days: ['jour', 'jours'], weeks: ['semaine', 'semaines'], months: ['mois', 'mois'] }[u];
  let s;
  if (min === max) s = min === 1 ? (u === 'weeks' ? 'Chaque semaine' : u === 'months' ? 'Chaque mois' : 'Chaque jour') : `${u === 'weeks' ? 'Toutes les' : 'Tous les'} ${min} ${un[1]}`;
  else s = `${u === 'weeks' ? 'Toutes les' : 'Tous les'} ${min} à ${max} ${un[1]}`;
  if (c.weekday != null && c.weekday !== '') s += `, le ${WEEKDAYS[+c.weekday]}`;
  return s;
}
function choreDue(c) {
  if (!c.lastDone) return null;
  const u = c.unit || 'weeks', min = +c.min || 1, max = Math.max(+c.max || min, min);
  const from = addUnit(c.lastDone, min, u), lateAfter = addUnit(c.lastDone, max, u);
  let due = from;
  if (c.weekday != null && c.weekday !== '') {
    const d = parse(min === max ? addDays(from, -3) : from);
    while (d.getDay() !== +c.weekday) d.setDate(d.getDate() + 1);
    due = iso(d);
    if (min !== max && due > lateAfter) due = lateAfter;
  }
  return { due, late: min === max ? due : lateAfter, from, range: min !== max };
}
function pharmacyDue() { const p = DB.health.pharmacy; return p.lastDone ? addMonths(p.lastDone, p.everyMonths || 3) : null; }
function prescriptionEnd() { const p = DB.health.prescription; return p.start ? addDays(p.start, (p.count || 1) * (p.days || 28) - 1) : null; }
function practWindow(p) {
  if (p.mode !== 'planned' || !p.lastVisit) return null;
  const ws = addMonths(p.lastVisit, p.minMonths || 4), we = addMonths(p.lastVisit, p.maxMonths || p.minMonths || 6);
  return { ws, we, bookFrom: addMonths(ws, -(p.aheadMax || 3)), bookBy: addMonths(we, -(p.aheadMin || 2)) };
}
function examDue(x) { return x.lastDone ? addMonths(x.lastDone, x.everyMonths || 12) : null; }
function capCount() { const y = today().slice(0, 4); return DB.health.claims.filter(c => c.cap && (c.date || '').slice(0, 4) === y).length; }
function nextBirthday(b) {
  const t = today(); const y = +t.slice(0, 4);
  let d = `${y}-${b.md}`; if (d < t) d = `${y + 1}-${b.md}`;
  return d;
}
function paperState(type, month) {
  // retourne null (pas attendu), 'future', 'done', 'todo'
  if (!type.since || month < type.since) return null;
  if (monthsBetween(type.since, month) % (type.every || 1) !== 0) return null;
  const arrival = `${month}-${pad(Math.min(type.day || 1, 28))}`;
  if (DB.papers.done[`${type.id}:${month}`]) return 'done';
  return arrival > today() ? 'future' : 'todo';
}
function paperPending() {
  const out = []; const cur = ym(today());
  for (const t of DB.papers.types) {
    if (!t.since) continue;
    let m = t.since; let guard = 0;
    while (m <= cur && guard++ < 240) {
      if (paperState(t, m) === 'todo') out.push({ type: t, month: m, arrival: `${m}-${pad(Math.min(t.day || 1, 28))}` });
      m = ym(addMonths(`${m}-01`, 1));
    }
  }
  return out.sort((a, b) => a.arrival.localeCompare(b.arrival));
}

/* Tout ce qui a une date et peut apparaître sur l'Accueil */
function entries() {
  const out = []; const t = today(); const S = DB.settings;
  const push = e => {
    if (S.ack[e.key]) return;
    const sn = S.snooze[e.key];
    if (sn) { e.date = sn; e.late = sn; e.snoozed = true; }
    if (!e.late || e.late < e.date) e.late = e.date;
    out.push(e);
  };
  for (const c of DB.chores) {
    const d = choreDue(c); if (!d) continue;
    push({ key: 'chore:' + c.id, rub: 'corvees', title: c.title, sub: rhythm(c), date: d.due, late: d.late, range: d.range, href: '#corvees', done: () => { c.lastDone = today(); } });
  }
  const H = DB.health;
  const pd = pharmacyDue();
  if (pd) push({ key: 'pharma:' + H.pharmacy.lastDone, rub: 'sante', icon: 'pill', title: 'Pharmacie', sub: [H.pharmacy.regular.join(', '), H.pharmacy.extras.length ? `+ ${plural(H.pharmacy.extras.length, 'produit', 'produits')}` : ''].filter(Boolean).join(' '), date: pd, late: addDays(pd, 3), href: '#sante', done: () => { H.pharmacy.lastDone = today(); H.pharmacy.extras = []; } });
  const pe = prescriptionEnd();
  if (pe) push({ key: 'presc:' + H.prescription.start, rub: 'sante', title: "RDV généraliste pour l'ordonnance", sub: `Ordonnance valable jusqu'au ${fDay(pe)}`, date: addMonths(pe, -(H.prescription.alertMonths || 2)), late: addMonths(pe, -1), href: '#sante', done: () => newPrescription() , manual: true });
  for (const p of H.practitioners) {
    if (p.booked) {
      push({ key: `rdv:${p.id}:${p.booked}`, rub: 'sante', title: `RDV ${p.name}`, sub: p.bookedTime ? `à ${p.bookedTime}` : 'Rendez-vous pris', date: p.booked, late: addDays(p.booked, 3), href: '#sante', done: () => sessionDone(p, p.booked) });
    } else {
      const w = practWindow(p);
      if (w) push({ key: `book:${p.id}:${p.lastVisit}`, rub: 'sante', title: `Réserver ${p.name}`, sub: `Pour un RDV entre le ${fDay(w.ws)} et le ${fDay(w.we)}`, date: w.bookFrom, late: w.bookBy, href: '#sante', done: () => bookPract(p), manual: true });
    }
  }
  for (const x of H.exams) {
    const d = examDue(x); if (!d) continue;
    push({ key: `exam:${x.id}:${x.lastDone}`, rub: 'sante', title: x.name, sub: 'Rendez-vous à prendre', date: addMonths(d, -1), late: d, href: '#sante', done: () => { x.lastDone = today(); } });
  }
  for (const c of H.claims) if (c.status === 'todo') push({ key: 'claim:' + c.id, rub: 'sante', title: `Mutuelle : ${c.label}`, sub: `À envoyer · séance du ${fDay(c.date)}`, date: c.date || t, late: addDays(c.date || t, 14), href: '#sante', done: () => { c.status = 'sent'; } });
  for (const tr of DB.trips) {
    const unbooked = !tr.legs.length || tr.legs.some(l => !l.booked);
    if (tr.reminder && unbooked) push({ key: `trip:${tr.id}:${tr.reminder}`, rub: 'voyages', title: `Organiser : ${tr.title}`, sub: tripRange(tr) || 'Dates à fixer', date: tr.reminder, late: addDays(tr.reminder, 3), href: '#voyages', done: () => { tr.reminder = null; } });
    for (const l of tr.legs) if (l.booked && l.date && l.date >= t) push({ key: `leg:${l.id}`, rub: 'voyages', icon: MODES[l.mode || 'train'][1], title: `${l.from || '?'} → ${l.to || '?'}`, sub: `${tr.title}${l.dep ? ' · départ ' + l.dep : ''}`, date: l.date, kind: 'event', href: '#voyages', done: () => {} });
  }
  for (const c of DB.travelCards) if (c.expires && c.kind !== 'points') push({ key: `tcard:${c.id}:${c.expires}`, rub: 'voyages', icon: 'ticket', title: c.name, sub: `Expire le ${fDay(c.expires)}`, date: addMonths(c.expires, -1), late: c.expires, href: '#voyages', done: () => { S.ack[`tcard:${c.id}:${c.expires}`] = 1; } });
  for (const v of DB.vouchers) if (!v.used && v.expires) push({ key: `voucher:${v.id}:${v.expires}`, rub: 'bons', title: `${v.name}${v.value ? ', ' + v.value : ''}`, sub: `Expire le ${fDay(v.expires)}`, date: addMonths(v.expires, -1), late: v.expires, href: '#bons', done: () => { v.used = true; } });
  for (const b of DB.birthdays) {
    const d = nextBirthday(b);
    const gs = { none: '', idea: 'Idée de cadeau notée', tobuy: 'Cadeau à acheter', bought: 'Cadeau acheté', msg: 'Un message suffit' }[b.giftStatus || 'none'];
    push({ key: `bday:${b.id}:${d.slice(0, 4)}`, rub: 'anniversaires', title: `Anniversaire de ${b.name}`, sub: [b.gift, gs].filter(Boolean).join(' · '), date: d, kind: 'event', href: '#anniversaires', done: () => { S.ack[`bday:${b.id}:${d.slice(0, 4)}`] = 1; } });
  }
  for (const g of DB.giftLists) {
    if (!g.date) continue; const left = g.items.filter(i => i.status !== 'bought').length; if (!left) continue;
    push({ key: `glist:${g.id}:${g.date}`, rub: 'anniversaires', title: `${g.title} : ${plural(left, 'cadeau', 'cadeaux')} à prévoir`, sub: `Le ${fDay(g.date)}`, date: addDays(g.date, -30), late: g.date, href: '#anniversaires', done: () => { S.ack[`glist:${g.id}:${g.date}`] = 1; } });
  }
  for (const p of DB.projects) if (p.status === 'active') for (const s of p.steps) if (!s.done && s.due) push({ key: `step:${s.id}:${s.due}`, rub: 'projets', title: s.title, sub: p.title, date: s.due, href: '#projet/' + p.id, done: () => stepDone(p, s) });
  for (const pb of DB.problems) if (pb.state !== 'done' && pb.due) push({ key: `pb:${pb.id}:${pb.due}`, rub: 'problemes', title: pb.title, sub: pb.nextAction || (pb.state === 'wait' ? 'Relancer' : 'À faire'), date: pb.due, href: '#problemes', done: () => { pb.log.push({ date: today(), text: pb.state === 'wait' ? 'Relance faite' : 'Action faite' }); pb.due = null; } });
  const pp = paperPending();
  if (pp.length) push({ key: 'papers', rub: 'papiers', title: `Extraire ${plural(pp.length, 'document', 'documents')}`, sub: [...new Set(pp.map(x => x.type.name))].join(', '), date: pp[0].arrival, late: addDays(pp[0].arrival, 7), href: '#papiers', done: () => go('#papiers'), nav: true });
  for (const x of DB.tasks) if (!x.done && x.due) push({ key: `task:${x.id}:${x.due}`, rub: x.rub || 'autre', title: x.title, sub: RUB[x.rub || 'autre'].label + (x.note ? ' · ' + x.note : ''), date: x.due, href: RUB[x.rub || 'autre'].href, done: () => { x.done = true; x.doneAt = today(); } });
  return out;
}
function agenda() {
  const t = today(), soon = +DB.settings.soonDays || 30;
  const g = { late: [], today: [], week: [], month: [] };
  for (const e of entries()) {
    if (e.kind === 'event') { if (e.date < t) continue; if (e.date === t) { g.today.push(e); continue; } }
    else if (t > e.late) { g.late.push(e); continue; }
    else if (e.date <= t) { g.today.push(e); continue; }
    const d = diff(t, e.date);
    if (d <= 7) g.week.push(e); else if (d <= soon) g.month.push(e);
  }
  g.late.sort((a, b) => a.late.localeCompare(b.late));
  for (const k of ['today', 'week', 'month']) g[k].sort((a, b) => a.date.localeCompare(b.date));
  return g;
}
function pillFor(e, group) {
  const t = today();
  if (group === 'late') return `<span class="pill late">${ago(diff(e.late, t))}</span>`;
  if (group === 'today') return e.kind === 'event' ? `<span class="pill ok">auj.</span>` : e.late > t ? `<span class="pill soon">d'ici ${fShort(e.late)}</span>` : `<span class="pill soon">auj.</span>`;
  const cls = e.kind === 'event' && e.rub === 'voyages' ? 'ok' : '';
  return `<span class="pill ${cls}">${e.range && e.late > e.date ? "d'ici " + fShort(e.late) : fShort(e.date)}</span>`;
}

/* actions sur une entrée */
function doEntry(e) {
  if (e.nav) { e.done(); return; }
  e.done();
  delete DB.settings.snooze[e.key];
  if (e.kind === 'event') DB.settings.ack[e.key] = 1;
  if (!e.manual) commit('Fait');
}
function snooze(e, d) { DB.settings.snooze[e.key] = d; commit(`Reporté au ${fDay(d)}`); }
function entrySheet(e) {
  openSheet(() => `${sheetHead(e.title)}
    <p class="meta" style="margin:-8px 0 0">${esc(e.sub || '')}${e.date ? ` · ${e.kind === 'event' ? 'le' : 'prévu le'} ${fDay(e.date)}` : ''}</p>
    <div class="btns">
      <button class="btn ok" ${A(() => { closeSheet(); doEntry(e); })}>${ico('check')}${e.nav ? 'Ouvrir' : e.kind === 'event' ? 'Masquer' : 'Fait'}</button>
      <a class="btn" href="${e.href}" ${A(() => { closeSheet(); go(e.href); })}>Ouvrir la rubrique</a>
    </div>
    <div class="field"><span class="lbl">Reporter</span>
    <div class="btns">
      <button class="btn sm" ${A(() => { closeSheet(); snooze(e, addDays(today(), 1)); })}>Demain</button>
      <button class="btn sm" ${A(() => { closeSheet(); snooze(e, addDays(today(), 7)); })}>+1 semaine</button>
      <button class="btn sm" ${A(() => { closeSheet(); askDate('Reporter au…', addDays(today(), 1), d => snooze(e, d)); })}>Date…</button>
    </div></div>`);
}
function agendaRow(e, group) {
  return `<div class="sw"><div class="sw-back" aria-hidden="true">
    <button tabindex="-1" ${A(() => snooze(e, addDays(today(), 1)))}>${ico('clock')}Demain</button>
    <button tabindex="-1" ${A(() => snooze(e, addDays(today(), 7)))}>${ico('cal')}+1 sem.</button>
    <button tabindex="-1" ${A(() => askDate('Reporter au…', addDays(today(), 1), d => snooze(e, d)))}>${ico('calPlus')}Date…</button>
    <button tabindex="-1" class="ok" ${A(() => doEntry(e))}>${ico('check')}${e.kind === 'event' ? 'Masquer' : 'Fait'}</button>
  </div><div class="row" role="button" tabindex="0" ${A(() => entrySheet(e))}>
    ${icBox(e.rub, e.icon)}<span class="txt"><b>${esc(e.title)}</b><small>${esc(e.sub || '')}</small></span>${pillFor(e, group)}
  </div></div>`;
}

/* ============================== Éléments communs ============================== */
const back = (href, label) => `<a class="back" href="${href}">${ico('chevL', 20)}${esc(label)}</a>`;
function head(title, { color, add, sub, addLabel = 'Ajouter' } = {}) {
  return `<div class="head"><div><h1${color ? ` style="color:${color}"` : ''}>${esc(title)}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>${add ? `<button class="round" aria-label="${esc(addLabel)}" ${A(add)}>${ico('plus', 22)}</button>` : ''}</div>`;
}
const sec = (title, inner, cls = '') => `<section><h2 class="${cls}">${title}</h2>${inner}</section>`;
const list = rows => `<div class="card list">${rows}</div>`;
const pill = (txt, cls = '') => `<span class="pill ${cls}">${esc(txt)}</span>`;
function row({ title, sub, right = '', act, icon, rub, check, checkCls = '', done = false, chev = false }) {
  const left = check ? `<button class="chk ${checkCls}${done ? ' on' : ''}" aria-label="${esc(title)} : fait" ${A(check)}><span></span></button>` : icon || rub ? icBox(rub, icon) : '';
  return `<div class="row${done ? ' done' : ''}"${act ? ` role="button" tabindex="0" ${A(act)}` : ''}>${left}<span class="txt"><b>${esc(title)}</b>${sub ? `<small>${sub}</small>` : ''}</span>${right}${chev ? `<span class="chev">${ico('chevR', 16)}</span>` : ''}</div>`;
}
const bar = (pct, color) => `<div class="bar"><span style="width:${Math.max(0, Math.min(100, pct))}%;${color ? `background:${color}` : ''}"></span></div>`;
function progress(from, to) { const t = today(); const total = diff(from, to); if (total <= 0) return 100; return Math.round(diff(from, t) / total * 100); }

/* ============================== Création rapide ============================== */
const RUB_CHOICES = ['sante', 'voyages', 'projets', 'corvees', 'achats', 'anniversaires', 'bons', 'problemes', 'papiers', 'autre'];
function createIn(rub, title, date, opts = {}) {
  const t = today();
  switch (rub) {
    case 'voyages': DB.trips.push({ id: uid(), title, reminder: date, note: '', legs: [] }); break;
    case 'projets': DB.projects.push({ id: uid(), title, status: 'active', goal: '', target: date, budget: null, spent: null, notes: '', steps: [], log: [{ date: t, text: 'Projet créé' }] }); break;
    case 'corvees': DB.chores.push({ id: uid(), title, min: 1, max: 1, unit: 'weeks', weekday: null, lastDone: addDays(date || t, -7) }); break;
    case 'achats': if (opts.amazon) DB.amazon.push({ id: uid(), title }); else DB.tasks.push({ id: uid(), rub, title, due: date, note: '', done: false, createdAt: t }); break;
    case 'anniversaires':
      if (date) DB.birthdays.push({ id: uid(), name: title, md: date.slice(5), year: null, gift: '', giftStatus: 'none' });
      else DB.giftIdeas.push({ id: uid(), person: '', text: title });
      break;
    case 'bons': DB.vouchers.push({ id: uid(), name: title, value: '', code: '', expires: date, note: '', used: false }); break;
    case 'problemes': DB.problems.push({ id: uid(), title, state: 'me', nextAction: '', due: date, log: [{ date: t, text: 'Noté' }] }); break;
    default: DB.tasks.push({ id: uid(), rub, title, due: date, note: '', done: false, createdAt: t });
  }
}
function quickAdd(prefill = '', inboxItem = null) {
  const root = openSheet(() => `${sheetHead(inboxItem ? 'Ranger' : 'Ajouter')}
    <div class="field"><label for="qa_t">Quoi ?</label><input type="text" id="qa_t" value="${esc(prefill)}" ${inboxItem ? '' : 'autofocus'} placeholder="Ex. rappeler la banque"></div>
    ${inboxItem ? '' : `<button class="btn primary block" data-inbox="1">${ico('inbox')}Ranger dans « À trier »</button>
    <div class="divider">ou préciser tout de suite</div>`}
    <div class="field"><span class="lbl">Rubrique</span><div class="chips">${RUB_CHOICES.map(r => `<label><input type="radio" name="qa_r" value="${r}"><span>${RUB[r].label}</span></label>`).join('')}</div></div>
    <label class="checkline" data-amz hidden><input type="checkbox" id="qa_amz" checked>Dans la liste de la commande Amazon</label>
    <div class="field"><label for="qa_d">Date (facultatif)</label><input type="date" id="qa_d"><span class="help" data-dhelp>Le jour où ça doit apparaître sur l'Accueil.</span></div>
    <p class="err" hidden></p>
    <button class="btn ${inboxItem ? 'primary' : ''} block" data-go="1">Ajouter à la rubrique</button>
    ${inboxItem ? `<button class="btn danger block" data-del="1">Supprimer</button>` : ''}`);
  const $ = s => root.querySelector(s);
  const upd = () => {
    const r = (root.querySelector('input[name=qa_r]:checked') || {}).value;
    $('[data-amz]').hidden = r !== 'achats';
    $('[data-go]').textContent = r ? `Ajouter à ${RUB[r].label}` : 'Ajouter à la rubrique';
    $('[data-dhelp]').textContent = r === 'anniversaires' ? "Date d'anniversaire (sans date : idée de cadeau)." : r === 'bons' ? "Date d'expiration." : r === 'voyages' ? "Le jour où le voyage doit apparaître sur l'Accueil pour l'organiser." : "Le jour où ça doit apparaître sur l'Accueil.";
  };
  root.querySelectorAll('input[name=qa_r]').forEach(i => i.addEventListener('change', upd));
  const title = () => $('#qa_t').value.trim();
  const err = m => { const e = $('.err'); e.hidden = false; e.textContent = m; };
  if (!inboxItem) $('[data-inbox]').addEventListener('click', () => {
    if (!title()) return err('Écris quelque chose.');
    DB.inbox.push({ id: uid(), title: title(), createdAt: today() }); closeSheet(); commit('Rangé dans « À trier »');
  });
  $('[data-go]').addEventListener('click', () => {
    const r = (root.querySelector('input[name=qa_r]:checked') || {}).value;
    if (!title()) return err('Écris quelque chose.');
    if (!r) return err('Choisis une rubrique.');
    createIn(r, title(), $('#qa_d').value || null, { amazon: $('#qa_amz').checked });
    if (inboxItem) DB.inbox = DB.inbox.filter(i => i !== inboxItem);
    closeSheet(); commit(`Ajouté à ${RUB[r].label}`);
  });
  if (inboxItem) $('[data-del]').addEventListener('click', () => { DB.inbox = DB.inbox.filter(i => i !== inboxItem); closeSheet(); commit('Supprimé'); });
}

/* ============================== Accueil ============================== */
function needsBackup() {
  const s = DB.settings; if (!s.lastBackup) return diff(s.createdAt || today(), today()) >= 1 || hasData();
  return diff(s.lastBackup, today()) >= (s.backupEveryDays || 7);
}
function hasData() { return DB.inbox.length || DB.tasks.length || DB.trips.length || DB.projects.length || DB.chores.some(c => c.lastDone); }
function setupItems() {
  const out = []; const H = DB.health;
  for (const c of DB.chores) if (!c.lastDone) out.push({ key: 'c' + c.id, rub: 'corvees', title: c.title, sub: 'Dernière fois ?', set: d => { c.lastDone = d; } });
  if (!H.pharmacy.lastDone) out.push({ key: 'ph', rub: 'sante', icon: 'pill', title: 'Pharmacie', sub: 'Dernier passage ?', set: d => { H.pharmacy.lastDone = d; } });
  if (!H.prescription.start) out.push({ key: 'pr', rub: 'sante', title: 'Ordonnance', sub: 'Date de l’ordonnance ?', set: d => { H.prescription.start = d; } });
  for (const p of H.practitioners) if (p.mode === 'planned' && !p.lastVisit && !p.booked) out.push({ key: 'p' + p.id, rub: 'sante', title: p.name, sub: 'Dernière séance ?', set: d => { p.lastVisit = d; } });
  for (const x of H.exams) if (!x.lastDone) out.push({ key: 'x' + x.id, rub: 'sante', title: x.name, sub: 'Dernière fois ?', set: d => { x.lastDone = d; } });
  return out;
}
function pageAccueil() {
  const g = agenda(); const S = DB.settings; const setup = setupItems();
  let h = `<div class="head"><div><p class="date-line">${esc(fLong(today()).replace(/^./, c => c.toUpperCase()))}</p><h1>À anticiper</h1></div>
    <button class="round primary" aria-label="Ajouter" ${A(() => quickAdd())}>${ico('plus', 22)}</button></div>`;
  if (needsBackup()) h += `<button class="banner" ${A(() => go('#plus'))}>${ico('cloud')}<span>${S.lastBackup ? `Dernière sauvegarde il y a ${diff(S.lastBackup, today())} jours` : 'Aucune sauvegarde pour l’instant'}</span><b>Sauvegarder</b></button>`;
  if (setup.length) h += `<button class="banner" style="background:var(--accent-bg);color:var(--accent)" ${A(() => go('#completer'))}>${ico('gear')}<span>${plural(setup.length, 'date à renseigner', 'dates à renseigner')} pour démarrer</span><b>Compléter</b></button>`;
  h += `<div class="tiles">
    <button class="tile" ${A(() => go('#trier'))}><span class="between" style="align-items:center">${icBox('autre', 'inbox').replace('#EDEDEA', 'var(--accent-bg)').replace('#4A4A52', 'var(--accent)')}${DB.inbox.length ? `<span class="pill accent">${DB.inbox.length}</span>` : ''}</span><b>À trier</b><small>${DB.inbox.length ? plural(DB.inbox.length, 'élément', 'éléments') : 'Rien à trier'}</small></button>
    <button class="tile" ${A(() => go('#revue/0'))}>${icBox('autre', 'review').replace('#EDEDEA', 'var(--accent-bg)').replace('#4A4A52', 'var(--accent)')}<b>Faire le point</b><small>${S.lastReview ? 'Dernière fois le ' + fDay(S.lastReview) : 'Jamais fait'}</small></button>
  </div>`;
  const block = (title, items, group, cls) => items.length ? sec(title, list(items.map(e => agendaRow(e, group)).join('')), cls) : '';
  h += block('En retard', g.late, 'late', 'late');
  h += block("Aujourd'hui", g.today, 'today');
  h += block('Les 7 prochains jours', g.week, 'week');
  h += block(`Dans les ${S.soonDays || 30} jours`, g.month, 'month');
  if (!g.late.length && !g.today.length && !g.week.length && !g.month.length) h += `<div class="card"><p class="empty">Rien de prévu pour l’instant. Ajoute quelque chose avec « + » ou complète tes rubriques.</p></div>`;
  h += `<p class="hint">Touche une ligne pour la marquer comme faite ou la reporter. Tu peux aussi la glisser vers la gauche.</p>`;
  return h;
}
function pageCompleter() {
  const items = setupItems();
  let h = back('#accueil', 'Accueil') + head('Pour démarrer', { sub: 'Indique la dernière fois pour chaque élément. Les prochaines dates seront calculées.' });
  if (!items.length) return h + `<div class="card"><p class="empty">Tout est renseigné.</p></div>`;
  h += list(items.map(it => row({ rub: it.rub, icon: it.icon, title: it.title, sub: esc(it.sub), right: `<span class="pill soon">Renseigner</span>`, act: () => askDate(it.title, today(), d => { it.set(d); commit(); }, { label: 'Dernière fois', help: 'Une date approximative suffit.' }) })).join(''));
  return h;
}

/* ============================== À trier ============================== */
function pageTrier() {
  let h = back('#accueil', 'Accueil') + head('À trier', { sub: 'Ce que tu as noté sans choisir de rubrique.' });
  h += `<div class="flex"><input id="trier_in" type="text" aria-label="Noter quelque chose" placeholder="Noter quelque chose…" style="flex:1;min-width:0;min-height:46px;border-radius:12px;border:1px solid var(--line);padding:0 14px;background:#fff">
    <button class="round primary" aria-label="Ajouter à « À trier »" ${A(() => { const i = document.getElementById('trier_in'); if (!i.value.trim()) return; DB.inbox.push({ id: uid(), title: i.value.trim(), createdAt: today() }); commit(); setTimeout(() => document.getElementById('trier_in')?.focus(), 50); })}>${ico('plus', 20)}</button></div>`;
  if (!DB.inbox.length) return h + `<div class="card"><p class="empty">Rien à trier.</p></div>`;
  const items = [...DB.inbox].reverse();
  h += list(items.map(it => { const age = diff(it.createdAt, today()); return row({ title: it.title, sub: `<span style="color:${age > 7 ? 'var(--late)' : 'inherit'}">${age === 0 ? "Noté aujourd'hui" : age === 1 ? 'Noté hier' : `Noté il y a ${ago(age)}`}</span>`, right: `<span class="btn sm">Ranger</span>`, act: () => quickAdd(it.title, it) }); }).join(''));
  h += `<p class="hint">Un élément noté depuis plus d’une semaine passe en orange.</p>`;
  return h;
}

/* ============================== Faire le point ============================== */
const kept = new Set();
function undated() {
  const out = [];
  if (DB.amazon.length) out.push({ key: 'amazon', rub: 'achats', title: `Commande Amazon · ${plural(DB.amazon.length, 'article', 'articles')}`, sub: 'Commander maintenant ?', open: '#achats' });
  for (const x of DB.tasks) if (!x.done && !x.due) out.push({ key: 't' + x.id, rub: x.rub || 'autre', title: x.title, sub: RUB[x.rub || 'autre'].label + (x.createdAt ? ` · noté le ${fDay(x.createdAt)}` : ''), date: d => { x.due = d; }, del: () => { DB.tasks = DB.tasks.filter(y => y !== x); } });
  for (const p of DB.problems) if (p.state === 'me' && !p.due) out.push({ key: 'p' + p.id, rub: 'problemes', title: p.title, sub: 'Problème à régler · sans date', date: d => { p.due = d; } });
  for (const p of DB.projects) if (p.status === 'active') { const s = p.steps.find(s => !s.done); if (s && !s.due) out.push({ key: 's' + s.id, rub: 'projets', title: s.title, sub: `${p.title} · prochaine étape sans date`, date: d => { s.due = d; } }); }
  for (const t of DB.trips) if (!t.reminder && (!t.legs.length || t.legs.some(l => !l.booked))) out.push({ key: 'v' + t.id, rub: 'voyages', title: t.title, sub: 'Voyage à organiser · pas de rappel', date: d => { t.reminder = d; } });
  for (const g of DB.giftIdeas) out.push({ key: 'g' + g.id, rub: 'anniversaires', title: g.text, sub: `Idée de cadeau${g.person ? ' pour ' + g.person : ''}`, del: () => { DB.giftIdeas = DB.giftIdeas.filter(y => y !== g); } });
  return out;
}
function pageRevue(step) {
  step = Math.max(0, Math.min(3, +step || 0));
  const names = ['À trier', 'En retard', '7 jours', 'Sans date'];
  let h = `<div class="between" style="align-items:center"><a class="back" href="#accueil" style="margin:0">Fermer</a><span class="tag">Environ 5 min</span></div>${head('Faire le point')}
    <ol class="steps">${names.map((n, i) => `<li class="${i <= step ? 'on' : ''} ${i === step ? 'cur' : ''}"${i === step ? ' aria-current="step"' : ''}>${n}</li>`).join('')}</ol>`;
  const g = agenda();
  if (step === 0) {
    h += `<div><h2 style="margin:0;font-size:20px">À trier · ${DB.inbox.length}</h2><p class="sub">Range chaque élément dans sa rubrique, avec ou sans date.</p></div>`;
    h += DB.inbox.length ? list(DB.inbox.map(it => row({ title: it.title, sub: `Noté le ${fDay(it.createdAt)}`, right: `<span class="btn sm">Ranger</span>`, act: () => quickAdd(it.title, it) })).join('')) : `<div class="card"><p class="empty">Rien à trier.</p></div>`;
  } else if (step === 1) {
    h += `<div><h2 style="margin:0;font-size:20px">En retard · ${g.late.length}</h2><p class="sub">Fais-le, reporte-le à une date réaliste, ou ouvre la rubrique pour le modifier.</p></div>`;
    h += g.late.length ? list(g.late.map(e => agendaRow(e, 'late')).join('')) : `<div class="card"><p class="empty">Rien en retard.</p></div>`;
  } else if (step === 2) {
    const items = [...g.today, ...g.week];
    h += `<div><h2 style="margin:0;font-size:20px">Les 7 prochains jours · ${items.length}</h2><p class="sub">Vérifie que la semaine est faisable. Reporte ce qui ne l’est pas.</p></div>`;
    h += items.length ? list(items.map(e => agendaRow(e, g.today.includes(e) ? 'today' : 'week')).join('')) : `<div class="card"><p class="empty">Rien de prévu.</p></div>`;
  } else {
    const items = undated().filter(x => !kept.has(x.key));
    const setup = setupItems();
    h += `<div><h2 style="margin:0;font-size:20px">Sans date · ${items.length}</h2><p class="sub">Pour chacun : lui donner une date, le garder tel quel ou le supprimer.</p></div>`;
    h += items.length ? `<div class="card list">${items.map(x => `<div class="row" style="flex-wrap:wrap">${icBox(x.rub)}<span class="txt"><b>${esc(x.title)}</b><small>${esc(x.sub)}</small></span>
      <span class="btns" style="width:100%;padding-left:46px">
        ${x.open ? `<button class="btn sm" ${A(() => go(x.open))}>Voir</button>` : ''}
        ${x.date ? `<button class="btn sm" ${A(() => askDate('Date', addDays(today(), 7), d => { x.date(d); commit('Daté'); }))}>Dater</button>` : ''}
        <button class="btn sm" ${A(() => { kept.add(x.key); render(); })}>Garder</button>
        ${x.del ? `<button class="btn sm danger" ${A(() => { if (confirm('Supprimer ?')) { x.del(); commit('Supprimé'); } })}>Supprimer</button>` : ''}
      </span></div>`).join('')}</div>` : `<div class="card"><p class="empty">Rien sans date à revoir.</p></div>`;
    if (setup.length) h += `<button class="banner" style="background:var(--accent-bg);color:var(--accent)" ${A(() => go('#completer'))}>${ico('gear')}<span>${plural(setup.length, 'date à renseigner', 'dates à renseigner')}</span><b>Compléter</b></button>`;
  }
  h += `<div class="btns" style="margin-top:8px">${step > 0 ? `<button class="btn" ${A(() => go('#revue/' + (step - 1)))}>Précédent</button>` : ''}
    ${step < 3 ? `<button class="btn primary" ${A(() => go('#revue/' + (step + 1)))}>Étape suivante</button>` : `<button class="btn primary" ${A(() => { DB.settings.lastReview = today(); kept.clear(); save(); go('#accueil'); toast('Point terminé'); })}>Terminer le point</button>`}</div>`;
  return h;
}

/* ============================== Santé ============================== */
function newPrescription() {
  const P = DB.health.prescription;
  form({ title: 'Nouvelle ordonnance', fields: [
    { k: 'start', label: "Date de l'ordonnance", type: 'date', value: today() },
    { k: 'count', label: 'Nombre de boîtes ou renouvellements', type: 'number', value: P.count, min: 1 },
    { k: 'days', label: 'Jours par boîte', type: 'number', value: P.days, min: 1 },
    { k: 'alertMonths', label: 'Me prévenir combien de mois avant la fin', type: 'number', value: P.alertMonths, min: 0 },
  ], required: ['start'], onSave: v => { Object.assign(P, v); } });
}
function bookPract(p) {
  form({ title: `RDV ${p.name}`, fields: [{ k: 'd', label: 'Date du rendez-vous', type: 'date', value: today() }, { k: 'tm', label: 'Heure (facultatif)', type: 'time', value: '' }],
    submit: 'Enregistrer le RDV', required: ['d'], onSave: v => { p.booked = v.d; p.bookedTime = v.tm || ''; } });
}
function sessionDone(p, d) {
  p.lastVisit = d || today(); p.booked = null; p.bookedTime = '';
  if (p.cap) DB.health.claims.push({ id: uid(), label: p.name, amount: '', date: p.lastVisit, status: 'todo', cap: true });
}
function editPract(p) {
  const isNew = !p;
  p = p || { id: uid(), name: '', mode: 'planned', minMonths: 4, maxMonths: 6, aheadMin: 2, aheadMax: 3, lastVisit: null, booked: null, bookedTime: '', cap: true };
  form({ title: isNew ? 'Nouveau praticien' : p.name, fields: [
    { k: 'name', label: 'Nom', type: 'text', value: p.name },
    { k: 'mode', label: 'Type', type: 'seg', value: p.mode, options: [['planned', 'À intervalle régulier'], ['asneeded', 'Si besoin']] },
    { k: 'minMonths', label: 'Revoir au plus tôt après (mois)', type: 'number', value: p.minMonths, min: 0, help: 'Seulement pour « à intervalle régulier »' },
    { k: 'maxMonths', label: 'Revoir au plus tard après (mois)', type: 'number', value: p.maxMonths, min: 0 },
    { k: 'aheadMin', label: 'Réserver au minimum combien de mois avant', type: 'number', value: p.aheadMin, min: 0 },
    { k: 'aheadMax', label: 'Réserver au maximum combien de mois avant', type: 'number', value: p.aheadMax, min: 0 },
    { k: 'lastVisit', label: 'Dernière séance', type: 'date', value: p.lastVisit },
    { k: 'cap', label: 'Compte dans le plafond de la mutuelle', type: 'check', value: p.cap },
  ], required: ['name'], onSave: v => { Object.assign(p, v); if (isNew) DB.health.practitioners.push(p); },
  onDelete: isNew ? null : () => { DB.health.practitioners = DB.health.practitioners.filter(x => x !== p); } });
}
function editExam(x) {
  const isNew = !x; x = x || { id: uid(), name: '', everyMonths: 12, lastDone: null, note: '' };
  form({ title: isNew ? 'Nouvel examen régulier' : x.name, fields: [
    { k: 'name', label: 'Nom', type: 'text', value: x.name },
    { k: 'everyMonths', label: 'Tous les combien de mois', type: 'number', value: x.everyMonths, min: 1 },
    { k: 'lastDone', label: 'Dernière fois', type: 'date', value: x.lastDone },
    { k: 'note', label: 'Note', type: 'text', value: x.note },
  ], required: ['name', 'everyMonths'], onSave: v => { Object.assign(x, v); if (isNew) DB.health.exams.push(x); },
  onDelete: isNew ? null : () => { DB.health.exams = DB.health.exams.filter(y => y !== x); },
  extra: isNew ? '' : `<button class="btn ok block" ${A(() => { x.lastDone = today(); closeSheet(); commit('Noté comme fait aujourd’hui'); })}>${ico('check')}Fait aujourd'hui</button>` });
}
function editClaim(c) {
  const isNew = !c; c = c || { id: uid(), label: '', amount: '', date: today(), status: 'todo', cap: false };
  form({ title: isNew ? 'Dépense à envoyer à la mutuelle' : c.label, fields: [
    { k: 'label', label: 'Quoi', type: 'text', value: c.label, placeholder: 'Ex. séance ostéo' },
    { k: 'amount', label: 'Montant (facultatif)', type: 'text', value: c.amount },
    { k: 'date', label: 'Date', type: 'date', value: c.date },
    { k: 'status', label: 'État', type: 'seg', value: c.status, options: [['todo', 'À envoyer'], ['sent', 'Envoyé']] },
    { k: 'cap', label: 'Compte dans le plafond annuel', type: 'check', value: c.cap },
  ], required: ['label'], onSave: v => { Object.assign(c, v); if (isNew) DB.health.claims.push(c); },
  onDelete: isNew ? null : () => { DB.health.claims = DB.health.claims.filter(y => y !== c); } });
}
function pageSante() {
  const H = DB.health, t = today();
  let h = head('Santé', { color: RUB.sante.fg, add: () => editTask(null, 'sante'), addLabel: 'Ajouter une tâche santé' });
  // Pharmacie
  const P = H.pharmacy, pd = pharmacyDue(), pe = prescriptionEnd();
  let ph = `<div class="card pad"><div class="flex">${icBox('sante', 'pill')}<div style="flex:1"><div class="title">Pharmacie</div><div class="meta">${P.lastDone ? `Tous les ${P.everyMonths} mois · dernier passage le ${fDay(P.lastDone)}` : 'Dernier passage à renseigner'}</div></div>${pd ? pill(fShort(pd), pd < t ? 'late' : diff(t, pd) <= 7 ? 'soon' : '') : ''}</div>
    ${pd ? bar(progress(P.lastDone, pd), RUB.sante.fg) : ''}
    <div class="two"><div class="kv">À chaque fois<b style="font-weight:500">${P.regular.map(esc).join('<br>') || '—'}</b></div>
    <div class="kv">En plus cette fois<b style="font-weight:500">${P.extras.map(esc).join('<br>') || '—'}</b></div></div>
    <div class="btns"><button class="btn sm" ${A(() => form({ title: 'Pharmacie', fields: [
      { k: 'regular', label: 'À chaque fois', type: 'lines', value: P.regular },
      { k: 'extras', label: 'En plus cette fois', type: 'lines', value: P.extras, help: 'Vidé automatiquement après chaque passage.' },
      { k: 'everyMonths', label: 'Tous les combien de mois', type: 'number', value: P.everyMonths, min: 1 },
      { k: 'lastDone', label: 'Dernier passage', type: 'date', value: P.lastDone }], onSave: v => { Object.assign(P, v); } }))}>Modifier</button>
    <button class="btn sm ok" ${A(() => { P.lastDone = t; P.extras = []; commit('Passage noté'); })}>C'est fait</button></div>`;
  if (pe && pd) {
    const next2 = addMonths(pd, P.everyMonths);
    if (pd > pe) ph += `<div class="warn late">${ico('alert', 16)}<span>L'ordonnance expire le ${fDay(pe)}, avant le prochain passage. Il faut la renouveler.</span></div>`;
    else if (next2 > pe) ph += `<div class="warn">${ico('alert', 16)}<span>L'ordonnance couvre le passage du ${fDay(pd)}, pas le suivant.</span></div>`;
  }
  ph += `</div>`;
  const P2 = H.prescription;
  ph += `<div class="card pad"><div class="flex">${icBox('sante', 'file')}<div style="flex:1"><div class="title">Ordonnance</div><div class="meta">${P2.start ? `Du ${fDay(P2.start)} · ${P2.count} × ${P2.days} jours` : 'Date à renseigner'}</div></div>${pe ? pill('fin ' + fDay(pe), pe < t ? 'late' : '') : ''}</div>
    ${pe ? bar(progress(P2.start, pe), RUB.sante.fg) + `<div class="meta">Rappel pour prendre RDV chez le généraliste le ${fDay(addMonths(pe, -(P2.alertMonths || 2)))} (${P2.alertMonths} mois avant la fin).</div>` : ''}
    <button class="btn sm" ${A(newPrescription)}>Nouvelle ordonnance reçue</button></div>`;
  h += sec('Pharmacie et ordonnance', ph);
  // Praticiens réguliers
  const planned = H.practitioners.filter(p => p.mode === 'planned'), asn = H.practitioners.filter(p => p.mode !== 'planned');
  const practCard = p => {
    const w = practWindow(p);
    let st = '', body = '';
    if (p.booked) { st = pill('RDV pris', 'ok'); body = `<div class="note">${esc(fLong(p.booked))}${p.bookedTime ? ' à ' + esc(p.bookedTime) : ''}</div><div class="btns"><button class="btn sm" ${A(() => bookPract(p))}>Modifier</button><button class="btn sm ok" ${A(() => { sessionDone(p, p.booked); commit('Séance notée'); })}>Séance faite</button></div>`; }
    else if (w) {
      const open = t >= w.bookFrom, late = t > w.bookBy;
      st = late ? pill('à réserver', 'late') : open ? pill('à réserver', 'soon') : pill('plus tard');
      body = `<div class="two"><div class="kv" ${open ? 'style="background:var(--soon-bg);color:var(--soon)"' : ''}>Réserver entre le<b>${fDay(w.bookFrom)} et le ${fDay(w.bookBy)}</b></div><div class="kv">Pour un RDV entre le<b>${fDay(w.ws)} et le ${fDay(w.we)}</b></div></div>
        <button class="btn sm" ${A(() => bookPract(p))}>J'ai pris RDV</button>`;
    } else body = `<button class="btn sm" ${A(() => askDate(p.name, today(), d => { p.lastVisit = d; commit(); }, { label: 'Dernière séance' }))}>Indiquer la dernière séance</button>`;
    return `<div class="card pad"><div class="between"><div><div class="title" role="button" tabindex="0" ${A(() => editPract(p))}>${esc(p.name)}</div><div class="meta">Tous les ${p.minMonths} à ${p.maxMonths} mois${p.lastVisit ? ' · dernière séance le ' + fDay(p.lastVisit) : ''}</div></div>${st}</div>${body}</div>`;
  };
  h += sec('Rendez-vous à réserver à l’avance', planned.map(practCard).join('') + `<button class="link" ${A(() => editPract(null))}>+ Ajouter un praticien</button>`);
  if (asn.length) h += sec('Si besoin', list(asn.map(p => row({ title: p.name, sub: esc(p.lastVisit ? 'Dernière séance le ' + fDay(p.lastVisit) : 'Aucune séance notée'), act: () => editPract(p), right: `<button class="btn sm" ${A(() => askDate(`Séance ${p.name}`, today(), d => { sessionDone(p, d); commit('Séance notée'); }, { label: 'Date de la séance' }))}>Noter une séance</button>` })).join('')));
  // Examens
  h += sec('Examens réguliers', list(H.exams.map(x => {
    const d = examDue(x);
    const right = d ? pill(d < t ? 'RDV à prendre' : fMonth(d), d < t ? 'late' : diff(t, d) < 31 ? 'soon' : '') : pill('à renseigner', 'soon');
    return row({ title: x.name, sub: esc(`Tous les ${x.everyMonths >= 24 && x.everyMonths % 12 === 0 ? x.everyMonths / 12 + ' ans' : x.everyMonths + ' mois'}${x.lastDone ? ' · dernière fois en ' + fMonth(x.lastDone) : ''}`), right, act: () => editExam(x) });
  }).join('')) + `<button class="link" ${A(() => editExam(null))}>+ Ajouter un examen</button>`);
  // Tâches santé
  const tasks = DB.tasks.filter(x => x.rub === 'sante' && !x.done);
  if (tasks.length) h += sec('Autres choses santé', list(tasks.map(taskRow).join('')));
  // Mutuelle
  const claims = [...H.claims].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const todo = claims.filter(c => c.status === 'todo'), sent = claims.filter(c => c.status !== 'todo').slice(0, 5);
  const cc = capCount();
  h += sec('Mutuelle', `<div class="card list">${[...todo, ...sent].map(c => row({ title: c.label + (c.amount ? ' · ' + c.amount : ''), sub: esc('Le ' + fDay(c.date)), act: () => editClaim(c),
    right: c.status === 'todo' ? `<button class="btn sm soon" ${A(() => { c.status = 'sent'; commit('Marqué comme envoyé'); })}>À envoyer</button>` : pill('envoyé', 'ok') })).join('') || '<p class="empty">Rien à envoyer.</p>'}
    <div style="padding:12px 14px;background:#FAF9F7;display:flex;flex-direction:column;gap:6px" role="button" tabindex="0" ${A(() => form({ title: 'Plafond annuel', fields: [{ k: 'capMax', label: 'Nombre de séances remboursées par an', type: 'number', value: H.capMax, min: 0 }], onSave: v => { H.capMax = v.capMax || 0; } }))}>
      <div class="between" style="font-size:13px"><span>Plafond ${today().slice(0, 4)} (${H.practitioners.filter(p => p.cap).map(p => p.name).join(', ') || '—'})</span><span class="meta">${cc} sur ${H.capMax}</span></div>
      ${bar(H.capMax ? cc / H.capMax * 100 : 0, cc >= H.capMax ? 'var(--late-line)' : RUB.sante.fg)}
      <span class="meta">${cc >= H.capMax ? 'Plafond atteint pour cette année' : `Il reste ${plural(H.capMax - cc, 'séance remboursée', 'séances remboursées')}`} · remis à zéro le 1er janvier</span></div></div>
    <button class="link" ${A(() => editClaim(null))}>+ Ajouter une dépense à envoyer</button>`);
  return h;
}

/* ============================== Tâches génériques ============================== */
function editTask(x, rub) {
  const isNew = !x; x = x || { id: uid(), rub: rub || 'autre', title: '', due: null, note: '', done: false, createdAt: today() };
  form({ title: isNew ? `Ajouter (${RUB[x.rub].label})` : x.title, fields: [
    { k: 'title', label: 'Quoi', type: 'text', value: x.title, autofocus: isNew },
    { k: 'due', label: 'Date (facultatif)', type: 'date', value: x.due, help: "Le jour où ça apparaît sur l'Accueil." },
    { k: 'note', label: 'Note', type: 'text', value: x.note },
    { k: 'rub', label: 'Rubrique', type: 'select', value: x.rub, options: ['sante', 'achats', 'papiers', 'autre'].map(r => [r, RUB[r].label]) },
  ], required: ['title'], onSave: v => { Object.assign(x, v); if (isNew) DB.tasks.push(x); },
  onDelete: isNew ? null : () => { DB.tasks = DB.tasks.filter(y => y !== x); } });
}
function taskRow(x) {
  const t = today();
  return row({ title: x.title, sub: esc(x.note || ''), check: () => { x.done = true; x.doneAt = t; commit('Fait'); }, checkCls: x.due && x.due < t ? 'late' : '',
    right: x.due ? pill(fShort(x.due), x.due < t ? 'late' : diff(t, x.due) <= 7 ? 'soon' : '') : '', act: () => editTask(x) });
}

/* ============================== Voyages ============================== */
function tripRange(tr) {
  const ds = tr.legs.map(l => l.date).filter(Boolean).sort();
  if (!ds.length) return '';
  return ds[0] === ds[ds.length - 1] ? fDay(ds[0]) : `${fDay(ds[0])} → ${fDay(ds[ds.length - 1])}`;
}
function editTrip(tr) {
  const isNew = !tr; tr = tr || { id: uid(), title: '', reminder: null, note: '', legs: [] };
  form({ title: isNew ? 'Nouveau voyage' : tr.title, fields: [
    { k: 'title', label: 'Nom du voyage', type: 'text', value: tr.title, placeholder: 'Ex. Lyon, Noël', autofocus: isNew },
    { k: 'reminder', label: "Faire apparaître sur l'Accueil le", type: 'date', value: tr.reminder, help: 'Pour penser à fixer les dates ou acheter les billets.' },
    { k: 'note', label: 'Note', type: 'textarea', value: tr.note },
  ], required: ['title'], onSave: v => { Object.assign(tr, v); if (isNew) DB.trips.push(tr); },
  onDelete: isNew ? null : () => { DB.trips = DB.trips.filter(y => y !== tr); } });
}
function editLeg(tr, l) {
  const isNew = !l; l = l || { id: uid(), mode: 'train', date: null, from: '', to: '', dep: '', arr: '', booked: false, info: '' };
  form({ title: isNew ? 'Nouveau trajet' : 'Trajet', fields: [
    { k: 'mode', label: 'Moyen', type: 'seg', value: l.mode, options: Object.entries(MODES).map(([k, v]) => [k, v[0]]) },
    { k: 'date', label: 'Date', type: 'date', value: l.date },
    { k: 'from', label: 'Départ', type: 'text', value: l.from },
    { k: 'to', label: 'Arrivée', type: 'text', value: l.to },
    { k: 'dep', label: 'Heure de départ', type: 'time', value: l.dep },
    { k: 'arr', label: "Heure d'arrivée", type: 'time', value: l.arr },
    { k: 'info', label: 'Infos (voiture, place, référence…)', type: 'text', value: l.info },
    { k: 'booked', label: 'Billet pris', type: 'check', value: l.booked },
  ], onSave: v => { Object.assign(l, v); if (isNew) tr.legs.push(l); tr.legs.sort((a, b) => (a.date || '').localeCompare(b.date || '')); },
  onDelete: isNew ? null : () => { tr.legs = tr.legs.filter(y => y !== l); } });
}
function editTravelCard(c) {
  const isNew = !c; c = c || { id: uid(), kind: 'card', name: '', value: '', expires: null, note: '' };
  form({ title: isNew ? 'Carte, bon ou points' : c.name, fields: [
    { k: 'kind', label: 'Type', type: 'seg', value: c.kind, options: [['card', 'Carte'], ['voucher', 'Bon'], ['points', 'Points']] },
    { k: 'name', label: 'Nom', type: 'text', value: c.name },
    { k: 'value', label: 'Montant ou solde', type: 'text', value: c.value },
    { k: 'expires', label: 'Expire le', type: 'date', value: c.expires, help: "Apparaît sur l'Accueil 1 mois avant." },
    { k: 'note', label: 'Note', type: 'text', value: c.note },
  ], required: ['name'], onSave: v => { Object.assign(c, v); c.updated = today(); if (isNew) DB.travelCards.push(c); },
  onDelete: isNew ? null : () => { DB.travelCards = DB.travelCards.filter(y => y !== c); } });
}
function tripCard(tr) {
  const t = today(); const unbooked = !tr.legs.length || tr.legs.some(l => !l.booked);
  const legs = tr.legs.map(l => {
    const m = MODES[l.mode || 'train'];
    return `<button class="leg" ${A(() => editLeg(tr, l))}><span class="ic" style="background:${l.booked ? 'var(--ok-bg)' : RUB.voyages.bg};color:${l.booked ? 'var(--ok)' : RUB.voyages.fg}">${ico(m[1], 16)}</span>
      <span class="txt"><small>${esc(m[0])}${l.date ? ' · ' + esc(fmt(l.date, { weekday: 'short', day: 'numeric', month: 'short' })) : ' · date à fixer'}</small>
      <span>${l.dep ? `<b>${esc(l.dep)}</b> ` : ''}${esc(l.from || '?')}</span><span>${l.arr ? `<b>${esc(l.arr)}</b> ` : ''}${esc(l.to || '?')}</span>${l.info ? `<small>${esc(l.info)}</small>` : ''}</span>
      ${l.booked ? '' : pill('à acheter', 'late')}</button>`;
  }).join('');
  return `<div class="card pad${unbooked && !tr.legs.length ? ' dashed' : ''}">
    <div class="between"><span class="title" role="button" tabindex="0" ${A(() => editTrip(tr))}>${esc(tr.title)}</span><span class="tag">${esc(tripRange(tr) || 'dates à fixer')}</span></div>
    ${tr.note ? `<div class="meta">${esc(tr.note)}</div>` : ''}
    ${legs}
    <div class="btns auto">
      ${unbooked ? `<button class="btn sm ${tr.reminder ? 'soon' : ''}" ${A(() => askDate("Sur l'Accueil le…", tr.reminder || addDays(t, 7), d => { tr.reminder = d; commit(); }))}>${ico('bell', 16)}${tr.reminder ? 'Sur l’accueil le ' + fDay(tr.reminder) : 'Choisir une date de rappel'}</button>` : ''}
      <button class="btn sm" ${A(() => editLeg(tr, null))}>+ Trajet</button>
      ${unbooked && tr.legs.length ? `<button class="btn sm ok" ${A(() => { tr.legs.forEach(l => { l.booked = true; }); tr.reminder = null; commit('Billets pris'); })}>Billets pris</button>` : ''}
    </div></div>`;
}
function pageVoyages() {
  const t = today();
  let h = head('Voyages', { color: RUB.voyages.fg, add: () => editTrip(null), addLabel: 'Nouveau voyage' });
  h += `<button class="banner" style="background:${RUB.voyages.bg};color:#2A2E9E" ${A(() => go('#import'))}>${ico('clip', 20)}<span><b style="display:block;font-size:15px">Coller un e-mail de confirmation</b>Les trajets sont détectés automatiquement</span>${ico('chevR', 16)}</button>`;
  const active = DB.trips.filter(tr => !tr.legs.length || tr.legs.some(l => !l.date || l.date >= t) || tr.legs.some(l => !l.booked));
  const toOrg = active.filter(tr => !tr.legs.length || tr.legs.some(l => !l.booked));
  const booked = active.filter(tr => !toOrg.includes(tr)).sort((a, b) => (a.legs[0]?.date || '').localeCompare(b.legs[0]?.date || ''));
  h += sec('À organiser', toOrg.length ? toOrg.map(tripCard).join('') : `<div class="card"><p class="empty">Aucun voyage à organiser.</p></div>`);
  if (booked.length) h += sec('Billets pris', booked.map(tripCard).join(''));
  const cards = DB.travelCards;
  h += sec('Cartes, bons et points', list(cards.map(c => row({ title: c.name + (c.kind === 'voucher' && c.value ? ' · ' + c.value : ''), sub: esc(c.note || (c.kind === 'points' ? (c.updated ? 'Mis à jour le ' + fDay(c.updated) : '') : '')), act: () => editTravelCard(c),
    right: c.kind === 'points' ? `<b>${esc(c.value || '—')}</b>` : c.expires ? pill('exp. ' + fDay(c.expires), c.expires < t ? 'late' : diff(t, c.expires) < 120 ? 'soon' : '') : pill('date ?', 'soon') })).join('') || '<p class="empty">Rien pour l’instant.</p>') + `<button class="link" ${A(() => editTravelCard(null))}>+ Ajouter une carte, un bon ou des points</button>`);
  return h;
}

/* ---- Import d'e-mail ---- */
const MONTH_RE = '(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[ée]cembre)';
const monthIndex = s => { const n = s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); return ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'].indexOf(n); };
const normT = s => { const m = s.match(/(\d{1,2})\s*[h:]\s*(\d{2})/); return m ? `${pad(+m[1])}:${m[2]}` : ''; };
const cleanPlace = s => (s || '').replace(/\s+/g, ' ').replace(/^[\s\-–—:,>→]+|[\s\-–—:,]+$/g, '').replace(/\s*\(.*?\)\s*$/, '').trim();
function parseMail(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const dateRe = new RegExp(`(\\d{1,2})(?:er)?\\s+${MONTH_RE}(?:\\s+(\\d{4}))?`, 'i');
  const numDateRe = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/;
  const T = '(\\d{1,2}\\s*[h:]\\s*\\d{2})';
  const legRe = new RegExp(`${T}\\s+(.+?)\\s*(?:→|->|➜|>|–|—|\\s-\\s)\\s*${T}\\s+(.+)`);
  const y0 = new Date().getFullYear();
  let cur = null, pending = null; const legs = [];
  const mkDate = (d, mi, y) => { let s = `${y || y0}-${pad(mi + 1)}-${pad(d)}`; if (!y && s < addDays(today(), -30)) s = `${y0 + 1}-${pad(mi + 1)}-${pad(d)}`; return s; };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const dm = l.match(dateRe); if (dm) cur = mkDate(+dm[1], monthIndex(dm[2]), dm[3] ? +dm[3] : null);
    else { const nd = l.match(numDateRe); if (nd) cur = `${nd[3]}-${pad(+nd[2])}-${pad(+nd[1])}`; }
    const lm = l.match(legRe);
    if (lm) { legs.push({ date: cur, dep: normT(lm[1]), from: cleanPlace(lm[2]), arr: normT(lm[3]), to: cleanPlace(lm[4]) }); continue; }
    const dep = l.match(new RegExp(`^d[ée]part\\s*:?\\s*(?:à\\s*)?${T}\\s*[-–,:]?\\s*(.*)$`, 'i'));
    if (dep) { pending = { date: cur, dep: normT(dep[1]), from: cleanPlace(dep[2]) || cleanPlace(lines[i + 1] && !/\d{1,2}\s*[h:]\s*\d{2}/.test(lines[i + 1]) ? lines[i + 1] : '') }; continue; }
    const arr = l.match(new RegExp(`^arriv[ée]e\\s*:?\\s*(?:à\\s*)?${T}\\s*[-–,:]?\\s*(.*)$`, 'i'));
    if (arr && pending) { pending.arr = normT(arr[1]); pending.to = cleanPlace(arr[2]) || cleanPlace(lines[i + 1] && !/\d{1,2}\s*[h:]\s*\d{2}/.test(lines[i + 1]) ? lines[i + 1] : ''); legs.push(pending); pending = null; continue; }
    const seat = l.match(/voiture\s*(\d+).{0,8}?place\s*(\d+)/i);
    if (seat && legs.length) legs[legs.length - 1].info = `Voiture ${seat[1]} · place ${seat[2]}`;
  }
  if (!legs.length) {
    const pairs = []; let curD = null;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const dm = l.match(dateRe); if (dm) curD = mkDate(+dm[1], monthIndex(dm[2]), dm[3] ? +dm[3] : null);
      const tm = l.match(/^(\d{1,2}\s*[h:]\s*\d{2})\s*(.*)$/);
      if (tm) { let place = cleanPlace(tm[2]); if (!place && lines[i + 1] && !/^\d{1,2}\s*[h:]\s*\d{2}/.test(lines[i + 1])) { place = cleanPlace(lines[i + 1]); i++; } pairs.push({ date: curD, time: normT(tm[1]), place }); }
    }
    for (let i = 0; i + 1 < pairs.length; i += 2) legs.push({ date: pairs[i].date, dep: pairs[i].time, from: pairs[i].place, arr: pairs[i + 1].time, to: pairs[i + 1].place });
  }
  const low = text.toLowerCase();
  const mode = /\bvol\b|a[ée]roport|embarquement|terminal/.test(low) ? 'avion' : /\bbus\b|\bautocar\b|\bcar\b/.test(low) ? 'bus' : 'train';
  return legs.map(l => ({ id: uid(), mode, booked: true, info: '', ...l }));
}
let importState = { text: '', legs: null, target: 'new', title: '' };
function pageImport() {
  const S = importState;
  let h = `<a class="back" href="#voyages">${ico('chevL', 20)}Voyages</a>` + head('Coller une confirmation', { sub: "Copie le texte de l'e-mail (SNCF, compagnie aérienne, bus) et colle-le ici. L'analyse se fait sur ton téléphone, rien n'est envoyé." });
  h += `<div class="field"><label for="imp_t">Texte de l'e-mail</label><textarea id="imp_t" style="min-height:150px;width:100%;border-radius:12px;border:1px solid var(--line);padding:12px" placeholder="Colle ici le texte de l'e-mail">${esc(S.text)}</textarea></div>
    <button class="btn primary" ${A(() => { S.text = document.getElementById('imp_t').value; S.legs = parseMail(S.text); render(); if (!S.legs.length) toast('Aucun trajet détecté : ajoute-le à la main'); })}>Analyser</button>`;
  if (S.legs) {
    h += sec(`Trajets détectés · ${S.legs.length}`, S.legs.length ? `<div class="card pad">${S.legs.map((l, i) => `<div class="field" style="border-bottom:1px solid var(--line2);padding-bottom:12px">
      <span class="lbl">Trajet ${i + 1}</span>
      <div class="two"><input type="date" data-leg="${i}" data-k="date" value="${esc(l.date || '')}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"><select data-leg="${i}" data-k="mode" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px">${Object.entries(MODES).map(([k, v]) => `<option value="${k}"${k === l.mode ? ' selected' : ''}>${v[0]}</option>`).join('')}</select></div>
      <div class="two"><input type="time" data-leg="${i}" data-k="dep" value="${esc(l.dep || '')}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"><input type="text" data-leg="${i}" data-k="from" value="${esc(l.from || '')}" placeholder="Départ" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"></div>
      <div class="two"><input type="time" data-leg="${i}" data-k="arr" value="${esc(l.arr || '')}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"><input type="text" data-leg="${i}" data-k="to" value="${esc(l.to || '')}" placeholder="Arrivée" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"></div>
      <input type="text" data-leg="${i}" data-k="info" value="${esc(l.info || '')}" placeholder="Infos (voiture, place…)" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px">
      <label class="checkline"><input type="checkbox" data-leg="${i}" data-k="keep" checked>Ajouter ce trajet</label></div>`).join('')}</div>` : `<div class="card"><p class="empty">Rien détecté. Tu peux ajouter le trajet à la main depuis Voyages.</p></div>`);
    if (S.legs.length) {
      const opts = [['new', 'Nouveau voyage'], ...DB.trips.map(t => [t.id, t.title])];
      h += `<div class="field"><label for="imp_target">Ajouter au voyage</label><select id="imp_target">${opts.map(([v, l]) => `<option value="${esc(v)}"${v === S.target ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
        <div class="field"><label for="imp_title">Nom du nouveau voyage</label><input type="text" id="imp_title" value="${esc(S.title || (S.legs[0] ? S.legs[S.legs.length > 1 ? 0 : 0].to : ''))}"></div>
        <button class="btn primary" style="background:${RUB.voyages.fg};border-color:${RUB.voyages.fg}" ${A(importLegs)}>Ajouter les trajets · billets pris</button>`;
    }
  }
  return h;
}
function importLegs() {
  const S = importState;
  document.querySelectorAll('[data-leg]').forEach(el => { const l = S.legs[+el.dataset.leg]; l[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
  const legs = S.legs.filter(l => l.keep !== false).map(({ keep, ...l }) => ({ ...l, date: l.date || null, booked: true }));
  if (!legs.length) return toast('Aucun trajet sélectionné');
  const target = document.getElementById('imp_target').value;
  let tr = DB.trips.find(t => t.id === target);
  if (!tr) { tr = { id: uid(), title: document.getElementById('imp_title').value.trim() || legs[0].to || 'Voyage', reminder: null, note: '', legs: [] }; DB.trips.push(tr); }
  tr.legs.push(...legs); tr.legs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  importState = { text: '', legs: null, target: 'new', title: '' };
  save(); go('#voyages'); toast(`${plural(legs.length, 'trajet ajouté', 'trajets ajoutés')}`);
}

/* ============================== Projets ============================== */
function stepDone(p, s) { s.done = true; s.doneAt = today(); p.log.push({ date: today(), text: s.title }); }
function editProject(p) {
  const isNew = !p; p = p || { id: uid(), title: '', status: 'active', goal: '', target: null, budget: null, spent: null, notes: '', steps: [], log: [{ date: today(), text: 'Projet créé' }] };
  form({ title: isNew ? 'Nouveau projet' : p.title, fields: [
    { k: 'title', label: 'Nom', type: 'text', value: p.title, autofocus: isNew },
    { k: 'goal', label: 'Objectif', type: 'textarea', value: p.goal },
    { k: 'target', label: 'Date cible (facultatif)', type: 'date', value: p.target },
    { k: 'status', label: 'État', type: 'seg', value: p.status, options: [['active', 'En cours'], ['paused', 'En pause'], ['done', 'Terminé']] },
    { k: 'budget', label: 'Budget (€, facultatif)', type: 'number', value: p.budget, min: 0 },
    { k: 'spent', label: 'Dépensé (€)', type: 'number', value: p.spent, min: 0 },
  ], required: ['title'], onSave: v => { if (!isNew && v.status !== p.status) p.log.push({ date: today(), text: { active: 'Repris', paused: 'Mis en pause', done: 'Terminé' }[v.status] }); Object.assign(p, v); if (isNew) { DB.projects.push(p); setTimeout(() => go('#projet/' + p.id), 0); } },
  onDelete: isNew ? null : () => { DB.projects = DB.projects.filter(y => y !== p); go('#projets'); } });
}
function pageProjets() {
  let h = head('Projets', { color: RUB.projets.fg, add: () => editProject(null), addLabel: 'Nouveau projet' });
  const card = p => {
    const n = p.steps.length, d = p.steps.filter(s => s.done).length, next = p.steps.find(s => !s.done);
    return `<button class="card pad" style="text-align:left;width:100%" ${A(() => go('#projet/' + p.id))}>
      <span class="between" style="align-items:center"><span class="title">${esc(p.title)}</span><span class="chev">${ico('chevR', 16)}</span></span>
      ${n ? bar(d / n * 100, RUB.projets.fg) : ''}
      <span class="between meta"><span>${n ? `${d} / ${n} étapes` : 'Aucune étape'}</span><span>${p.target ? 'Objectif : ' + fDay(p.target) : ''}</span></span>
      ${next ? `<span class="note" style="background:#F6F3FD;color:#4A2A93">Prochaine étape : ${esc(next.title)}${next.due ? ' · ' + fShort(next.due) : ''}</span>` : ''}</button>`;
  };
  const act = DB.projects.filter(p => p.status === 'active'), pau = DB.projects.filter(p => p.status === 'paused'), don = DB.projects.filter(p => p.status === 'done');
  h += sec('En cours', act.length ? act.map(card).join('') : `<div class="card"><p class="empty">Aucun projet en cours. Crée-en un avec « + ».</p></div>`);
  if (pau.length) h += sec('En pause', list(pau.map(p => row({ title: p.title, sub: esc(`${p.steps.filter(s => s.done).length} / ${p.steps.length} étapes`), right: pill('en pause'), act: () => go('#projet/' + p.id) })).join('')));
  if (don.length) h += sec('Terminés', list(don.map(p => row({ title: p.title, right: pill('terminé', 'ok'), act: () => go('#projet/' + p.id) })).join('')));
  return h;
}
function editStep(p, s) {
  const isNew = !s; s = s || { id: uid(), title: '', due: null, done: false };
  form({ title: isNew ? 'Nouvelle étape' : 'Étape', fields: [{ k: 'title', label: 'Étape', type: 'text', value: s.title, autofocus: isNew }, { k: 'due', label: 'Date (facultatif)', type: 'date', value: s.due, help: "Avec une date, l'étape apparaît sur l'Accueil." }],
    required: ['title'], onSave: v => { Object.assign(s, v); if (isNew) p.steps.push(s); }, onDelete: isNew ? null : () => { p.steps = p.steps.filter(y => y !== s); } });
}
function pageProjet(id) {
  const p = DB.projects.find(x => x.id === id);
  if (!p) return back('#projets', 'Projets') + `<div class="card"><p class="empty">Projet introuvable.</p></div>`;
  const t = today(), n = p.steps.length, d = p.steps.filter(s => s.done).length;
  let h = back('#projets', 'Projets');
  h += `<div style="display:flex;flex-direction:column;gap:6px"><span>${pill({ active: 'En cours', paused: 'En pause', done: 'Terminé' }[p.status], p.status === 'done' ? 'ok' : '')}</span>
    <div class="head"><h1 style="font-size:26px">${esc(p.title)}</h1><button class="round" aria-label="Modifier le projet" ${A(() => editProject(p))}>${ico('edit')}</button></div>
    ${p.goal ? `<p class="sub" style="font-size:14px;line-height:1.5">${esc(p.goal)}</p>` : ''}</div>`;
  h += `<div class="two"><div class="card pad"><span class="meta">Avancement</span><span class="title" style="font-size:22px">${d} / ${n}</span>${bar(n ? d / n * 100 : 0, RUB.projets.fg)}</div>
    <div class="card pad" role="button" tabindex="0" ${A(() => editProject(p))}><span class="meta">${p.budget ? 'Budget' : 'Date cible'}</span><span class="title" style="font-size:${p.budget ? 22 : 16}px">${p.budget ? `${p.spent || 0} € <span class="meta">/ ${p.budget} €</span>` : p.target ? esc(fDay(p.target)) : '—'}</span>${p.budget ? bar((p.spent || 0) / p.budget * 100, RUB.projets.fg) : ''}</div></div>`;
  const todo = p.steps.filter(s => !s.done);
  h += sec('Reste à faire', (todo.length ? list(todo.map((s, i) => row({ title: s.title, check: () => { stepDone(p, s); commit('Étape terminée'); }, checkCls: s.due && s.due < t ? 'late' : '', act: () => editStep(p, s),
    right: s.due ? pill(fShort(s.due), s.due < t ? 'late' : diff(t, s.due) <= 7 ? 'soon' : '') : i === 0 ? pill('prochaine', 'soon') : '' })).join('')) : `<div class="card"><p class="empty">Aucune étape restante.</p></div>`) + `<button class="link" ${A(() => editStep(p, null))}>+ Ajouter une étape</button>`);
  const log = [...p.log].reverse();
  h += sec("Ce que j'ai fait", `<div class="card pad">${log.map(e => `<div class="flex" style="align-items:flex-start"><span class="meta" style="width:56px;flex:none;padding-top:2px">${esc(fDay(e.date))}</span><span style="font-size:14px">${esc(e.text)}</span></div>`).join('') || '<p class="empty">Rien encore.</p>'}</div>
    <button class="link" ${A(() => form({ title: 'Ajouter au journal', fields: [{ k: 'text', label: "Qu'as-tu fait ?", type: 'text', autofocus: true }, { k: 'date', label: 'Date', type: 'date', value: t }], required: ['text'], onSave: v => { p.log.push({ date: v.date || t, text: v.text }); p.log.sort((a, b) => a.date.localeCompare(b.date)); } }))}>+ Ajouter au journal</button>`);
  h += sec('Notes', `<textarea id="pnotes" style="width:100%;min-height:120px;border-radius:16px;border:1px solid var(--line);padding:14px;line-height:1.5" placeholder="Liens, contacts, idées…">${esc(p.notes)}</textarea>`);
  setTimeout(() => { const ta = document.getElementById('pnotes'); if (ta) ta.addEventListener('change', () => { p.notes = ta.value; save(); toast('Notes enregistrées'); }); }, 0);
  return h;
}

/* ============================== Plus ============================== */
function pagePlus() {
  const S = DB.settings, t = today();
  const lateChores = DB.chores.filter(c => { const d = choreDue(c); return d && t > d.late; }).length;
  const nb = [...DB.birthdays].map(b => ({ b, d: nextBirthday(b) })).sort((a, b) => a.d.localeCompare(b.d))[0];
  const vouch = DB.vouchers.filter(v => !v.used);
  const pp = paperPending().length;
  const R = (rub, href, right) => `<a class="row" href="${href}">${icBox(rub)}<span class="txt"><b>${RUB[rub].label === 'Anniversaires' ? 'Anniversaires et cadeaux' : RUB[rub].label === 'Problèmes' ? 'Problèmes à régler' : RUB[rub].label === 'Papiers' ? 'Papiers à extraire' : RUB[rub].label}</b></span>${right}<span class="chev">${ico('chevR', 16)}</span></a>`;
  let h = head('Plus');
  h += sec('Rubriques', `<div class="card list">
    ${R('corvees', '#corvees', lateChores ? pill(`${lateChores} en retard`, 'late') : `<span class="tag">${DB.chores.length}</span>`)}
    ${R('achats', '#achats', `<span class="tag">${DB.amazon.length + DB.tasks.filter(x => x.rub === 'achats' && !x.done).length || ''}</span>`)}
    ${R('anniversaires', '#anniversaires', nb ? `<span class="tag">${esc(nb.b.name)} ${diff(t, nb.d) === 0 ? "aujourd'hui" : 'dans ' + diff(t, nb.d) + ' j'}</span>` : '')}
    ${R('bons', '#bons', vouch.length ? `<span class="tag">${vouch.length}</span>` : '')}
    ${R('problemes', '#problemes', `<span class="tag">${DB.problems.filter(p => p.state !== 'done').length || ''}</span>`)}
    ${R('papiers', '#papiers', pp ? pill(String(pp), 'late') : '')}
    ${R('autre', '#autre', `<span class="tag">${DB.tasks.filter(x => x.rub === 'autre' && !x.done).length || ''}</span>`)}
  </div>`);
  h += sec('Mes données', `<div class="card pad">
    <div class="flex" style="align-items:flex-start">${`<span class="ic" style="background:var(--soon-bg);color:var(--soon)">${ico('cloud')}</span>`}<div style="flex:1"><div style="font-weight:500">${S.lastBackup ? 'Dernière sauvegarde : ' + fDay(S.lastBackup) : 'Aucune sauvegarde'}</div>
    <div class="meta" style="font-size:13px;line-height:1.5">Tes données restent uniquement sur cet iPhone, dans cette app. Enregistre une copie dans Proton Drive ou Fichiers au moins une fois par semaine.</div></div></div>
    <button class="btn primary" ${A(backup)}>${ico('cloud')}Sauvegarder maintenant</button>
    <button class="btn" ${A(() => document.getElementById('restore-file').click())}>${ico('restore')}Restaurer une sauvegarde</button></div>`);
  h += sec('Réglages', list(
    row({ title: '« Dans les X jours » sur l’Accueil', right: `<span class="tag">${S.soonDays} jours</span>`, act: () => form({ title: 'Horizon de l’Accueil', fields: [{ k: 'soonDays', label: 'Afficher ce qui arrive dans les', type: 'seg', value: String(S.soonDays), options: [['14', '14 j'], ['30', '30 j'], ['45', '45 j'], ['60', '60 j']] }], onSave: v => { S.soonDays = +v.soonDays || 30; } }) }) +
    row({ title: 'Rappel de sauvegarde', right: `<span class="tag">tous les ${S.backupEveryDays} jours</span>`, act: () => form({ title: 'Rappel de sauvegarde', fields: [{ k: 'backupEveryDays', label: 'Me le rappeler tous les', type: 'seg', value: String(S.backupEveryDays), options: [['7', '7 j'], ['14', '14 j'], ['30', '30 j']] }], onSave: v => { S.backupEveryDays = +v.backupEveryDays || 7; } }) }) +
    row({ title: 'Effacer toutes les données', sub: 'Pour repartir de zéro', act: () => { if (confirm('Effacer toutes les données de cet iPhone ? Fais une sauvegarde avant.') && confirm('Vraiment tout effacer ?')) { DB = seed(); commit('Données effacées'); go('#accueil'); } } })
  ));
  h += `<p class="hint">Mon quotidien · version 1.0</p>`;
  return h;
}
async function backup() {
  const name = `mon-quotidien-${today()}.json`;
  const data = JSON.stringify(DB, null, 1);
  const file = new File([data], name, { type: 'application/json' });
  const done = () => { DB.settings.lastBackup = today(); commit('Sauvegarde faite'); };
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); done(); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); done();
}
document.getElementById('restore-file').addEventListener('change', e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d || !d.settings || !d.chores) throw new Error('format');
      if (!confirm('Remplacer toutes les données de cet iPhone par cette sauvegarde ?')) return;
      DB = migrate(d); commit('Sauvegarde restaurée'); go('#accueil');
    } catch (err) { toast("Ce fichier n'est pas une sauvegarde valide"); }
  };
  r.readAsText(f);
});

/* ============================== Corvées ============================== */
function editChore(c) {
  const isNew = !c; c = c || { id: uid(), title: '', min: 1, max: 1, unit: 'weeks', weekday: null, lastDone: today() };
  form({ title: isNew ? 'Nouvelle corvée' : c.title, fields: [
    { k: 'title', label: 'Nom', type: 'text', value: c.title, autofocus: isNew },
    { k: 'min', label: 'Tous les… (au plus tôt)', type: 'number', value: c.min, min: 1 },
    { k: 'max', label: '…ou au plus tard (laisser pareil si fixe)', type: 'number', value: c.max, min: 1, help: 'Ex. lessive : 1 et 2 → entre 1 et 2 semaines.' },
    { k: 'unit', label: 'Unité', type: 'seg', value: c.unit, options: [['days', 'jours'], ['weeks', 'semaines'], ['months', 'mois']] },
    { k: 'weekday', label: 'Jour habituel', type: 'select', value: c.weekday ?? '', options: [['', 'Aucun'], ['1', 'lundi'], ['2', 'mardi'], ['3', 'mercredi'], ['4', 'jeudi'], ['5', 'vendredi'], ['6', 'samedi'], ['0', 'dimanche']] },
    { k: 'lastDone', label: 'Dernière fois', type: 'date', value: c.lastDone },
  ], required: ['title', 'min'], onSave: v => { v.max = Math.max(v.max || v.min, v.min); v.weekday = v.weekday === null || v.weekday === '' ? null : +v.weekday; Object.assign(c, v); if (isNew) DB.chores.push(c); },
  onDelete: isNew ? null : () => { DB.chores = DB.chores.filter(y => y !== c); },
  extra: isNew ? '' : `<button class="btn ok block" ${A(() => { c.lastDone = today(); closeSheet(); commit('Fait'); })}>${ico('check')}Fait aujourd'hui</button>` });
}
function pageCorvees() {
  const t = today();
  const rows = DB.chores.map(c => ({ c, d: choreDue(c) }));
  const late = rows.filter(r => r.d && t > r.d.late).sort((a, b) => a.d.late.localeCompare(b.d.late));
  const week = rows.filter(r => r.d && t <= r.d.late && diff(t, r.d.due) <= 7).sort((a, b) => a.d.due.localeCompare(b.d.due));
  const later = rows.filter(r => r.d && t <= r.d.late && diff(t, r.d.due) > 7).sort((a, b) => a.d.due.localeCompare(b.d.due));
  const nodate = rows.filter(r => !r.d);
  const R = ({ c, d }, grp) => row({ title: c.title, sub: esc(`${rhythm(c)}${c.lastDone ? ' · fait le ' + fDay(c.lastDone) : ''}`), check: () => { c.lastDone = t; commit('Fait'); }, checkCls: grp === 'late' ? 'late' : '', act: () => editChore(c),
    right: !d ? pill('à renseigner', 'soon') : grp === 'late' ? pill(ago(diff(d.late, t)), 'late') : d.due <= t ? pill(d.late > t ? "d'ici " + fShort(d.late) : 'auj.', 'soon') : pill(d.range && d.late > d.due ? "d'ici " + fShort(d.late) : fShort(d.due)) });
  let h = back('#plus', 'Plus') + head('Corvées', { color: RUB.corvees.fg, add: () => editChore(null), addLabel: 'Ajouter une corvée', sub: `${plural(DB.chores.length, 'corvée', 'corvées')} · touche une corvée pour changer son rythme` });
  if (late.length) h += sec('En retard', list(late.map(r => R(r, 'late')).join('')), 'late');
  if (week.length) h += sec('Les 7 prochains jours', list(week.map(r => R(r, 'week')).join('')));
  if (later.length) h += sec('Plus tard', list(later.map(r => R(r, 'later')).join('')));
  if (nodate.length) h += sec('Dernière fois à renseigner', list(nodate.map(r => R(r, 'none')).join('')));
  h += `<p class="hint">La date suivante se calcule à partir du jour où tu coches. Une corvée non faite passe dans « En retard », ici et sur l'Accueil.</p>`;
  return h;
}

/* ============================== Achats ============================== */
function pageAchats() {
  let h = back('#plus', 'Plus') + head('Achats', { color: RUB.achats.fg, add: () => editTask(null, 'achats'), addLabel: 'Ajouter un achat à prévoir' });
  h += `<section class="card list"><div class="row" style="justify-content:space-between"><h2 style="margin:0;font-size:17px">Commande Amazon</h2><span class="tag">${plural(DB.amazon.length, 'article', 'articles')}</span></div>
    ${DB.amazon.map(it => row({ title: it.title, check: () => { DB.amazon = DB.amazon.filter(y => y !== it); commit('Retiré de la liste'); }, act: () => form({ title: 'Article', fields: [{ k: 'title', label: 'Nom', type: 'text', value: it.title }], required: ['title'], onSave: v => { it.title = v.title; }, onDelete: () => { DB.amazon = DB.amazon.filter(y => y !== it); } }) })).join('')}
    <div class="row" style="gap:8px"><input id="amz_in" type="text" aria-label="Ajouter un article" placeholder="Ajouter un article…" style="flex:1;min-width:0;min-height:44px;border-radius:10px;border:1px solid var(--line);padding:0 12px">
    <button class="round" aria-label="Ajouter l'article" ${A(() => { const i = document.getElementById('amz_in'); if (!i.value.trim()) return; DB.amazon.push({ id: uid(), title: i.value.trim() }); commit(); setTimeout(() => document.getElementById('amz_in')?.focus(), 50); })}>${ico('plus', 20)}</button></div>
    ${DB.amazon.length ? `<div style="padding:12px 14px;display:flex;flex-direction:column;gap:8px"><button class="btn block" style="background:${RUB.achats.fg};border-color:${RUB.achats.fg};color:#fff" ${A(() => { if (confirm('Vider la liste ? (commande passée)')) { DB.amazon = []; commit('Commande passée'); } })}>Commande passée</button>
    <span class="hint" style="text-align:center">Coche un article pour le retirer, ou vide toute la liste après la commande. Cette liste revient dans « Faire le point ».</span></div>` : ''}</section>`;
  const other = DB.tasks.filter(x => x.rub === 'achats' && !x.done).sort((a, b) => (a.due || '9').localeCompare(b.due || '9'));
  h += sec('Autres achats à prévoir', other.length ? list(other.map(taskRow).join('')) : `<div class="card"><p class="empty">Rien à prévoir.</p></div>`);
  return h;
}

/* ============================== Anniversaires et cadeaux ============================== */
const GIFT_ST = [['none', 'Pas d’idée'], ['idea', 'Idée'], ['tobuy', 'À acheter'], ['bought', 'Acheté'], ['msg', 'Un message suffit']];
const giftPill = s => ({ none: pill("pas d'idée", 'late'), idea: pill('idée', 'soon'), tobuy: pill('à acheter', 'late'), bought: pill('acheté', 'ok'), msg: pill('message') }[s || 'none']);
function editBirthday(b) {
  const isNew = !b; b = b || { id: uid(), name: '', md: null, year: null, gift: '', giftStatus: 'none' };
  const y = today().slice(0, 4);
  form({ title: isNew ? 'Nouvel anniversaire' : b.name, fields: [
    { k: 'name', label: 'Prénom', type: 'text', value: b.name, autofocus: isNew },
    { k: 'date', label: 'Date de naissance', type: 'date', value: b.md ? `${b.year || y}-${b.md}` : null, help: "L'année sert seulement à afficher l'âge." },
    { k: 'knowYear', label: "Je connais l'année de naissance", type: 'check', value: !!b.year },
    { k: 'gift', label: 'Cadeau', type: 'text', value: b.gift },
    { k: 'giftStatus', label: 'Où en est le cadeau', type: 'select', value: b.giftStatus, options: GIFT_ST },
  ], required: ['name', 'date'], onSave: v => { b.name = v.name; b.md = v.date.slice(5); b.year = v.knowYear ? +v.date.slice(0, 4) : null; b.gift = v.gift || ''; b.giftStatus = v.giftStatus; if (isNew) DB.birthdays.push(b); },
  onDelete: isNew ? null : () => { DB.birthdays = DB.birthdays.filter(x => x !== b); } });
}
function editGiftList(g) {
  const isNew = !g; g = g || { id: uid(), title: 'Noël ' + today().slice(0, 4), date: `${today().slice(0, 4)}-12-25`, items: [] };
  form({ title: isNew ? 'Nouvelle liste de cadeaux' : g.title, fields: [{ k: 'title', label: 'Nom', type: 'text', value: g.title }, { k: 'date', label: 'Date', type: 'date', value: g.date, help: "Les cadeaux manquants apparaissent sur l'Accueil 30 jours avant." }],
    required: ['title'], onSave: v => { Object.assign(g, v); if (isNew) DB.giftLists.push(g); }, onDelete: isNew ? null : () => { DB.giftLists = DB.giftLists.filter(x => x !== g); } });
}
function editGiftItem(g, it) {
  const isNew = !it; it = it || { id: uid(), person: '', gift: '', status: 'none' };
  form({ title: isNew ? 'Ajouter une personne' : it.person, fields: [{ k: 'person', label: 'Pour qui', type: 'text', value: it.person, autofocus: isNew }, { k: 'gift', label: 'Cadeau', type: 'text', value: it.gift }, { k: 'status', label: 'État', type: 'select', value: it.status, options: GIFT_ST }],
    required: ['person'], onSave: v => { Object.assign(it, v); if (isNew) g.items.push(it); }, onDelete: isNew ? null : () => { g.items = g.items.filter(x => x !== it); } });
}
function pageAnniversaires() {
  const t = today();
  let h = back('#plus', 'Plus') + head('Anniversaires et cadeaux', { color: RUB.anniversaires.fg, add: () => editBirthday(null), addLabel: 'Ajouter un anniversaire' });
  const bs = DB.birthdays.map(b => ({ b, d: nextBirthday(b) })).sort((a, b) => a.d.localeCompare(b.d));
  h += sec('Anniversaires', bs.length ? list(bs.map(({ b, d }) => {
    const n = diff(t, d);
    return `<div class="row" role="button" tabindex="0" ${A(() => editBirthday(b))}><span style="width:42px;text-align:center;flex:none"><b style="display:block;font-size:20px">${+d.slice(8)}</b><small class="meta">${esc(fmt(d, { month: 'short' }))}</small></span>
      <span class="txt"><b>${esc(b.name)}${b.year ? ` · ${+d.slice(0, 4) - b.year} ans` : ''}</b><small>${esc(b.gift || '')}${b.gift ? ' · ' : ''}${giftPill(b.giftStatus).replace(/<[^>]+>/g, '')}</small></span>
      ${n <= 30 ? pill(n === 0 ? "aujourd'hui" : `dans ${n} j`, n <= 7 ? 'soon' : '') : ''}</div>`;
  }).join('')) : `<div class="card"><p class="empty">Aucun anniversaire. Ajoute-en avec « + ».</p></div>`);
  for (const g of DB.giftLists) {
    const bought = g.items.filter(i => i.status === 'bought').length;
    h += sec(`<span role="button" tabindex="0" ${A(() => editGiftList(g))}>${esc(g.title)}</span><span style="font-weight:500">${bought} sur ${g.items.length} achetés</span>`,
      list(g.items.map(it => row({ title: it.person, sub: esc(it.gift || ''), right: giftPill(it.status), act: () => editGiftItem(g, it) })).join('') || '<p class="empty">Ajoute les personnes à qui offrir.</p>') + `<button class="link" ${A(() => editGiftItem(g, null))}>+ Ajouter une personne</button>`);
  }
  h += `<button class="link" ${A(() => editGiftList(null))}>+ Nouvelle liste de cadeaux (Noël…)</button>`;
  h += sec('Idées en réserve', list(DB.giftIdeas.map(g => row({ title: g.text, sub: esc(g.person ? 'Pour ' + g.person : ''), act: () => form({ title: 'Idée de cadeau', fields: [{ k: 'text', label: 'Idée', type: 'text', value: g.text }, { k: 'person', label: 'Pour qui (facultatif)', type: 'text', value: g.person }], required: ['text'], onSave: v => { Object.assign(g, v); }, onDelete: () => { DB.giftIdeas = DB.giftIdeas.filter(x => x !== g); } }) })).join('') || '<p class="empty">Aucune idée notée.</p>')
    + `<button class="link" ${A(() => form({ title: 'Idée de cadeau', fields: [{ k: 'text', label: 'Idée', type: 'text', autofocus: true }, { k: 'person', label: 'Pour qui (facultatif)', type: 'text' }], required: ['text'], onSave: v => { DB.giftIdeas.push({ id: uid(), text: v.text, person: v.person || '' }); } }))}>+ Ajouter une idée</button>`);
  return h;
}

/* ============================== Bons cadeaux ============================== */
const shownCodes = new Set(); let showUsedVouchers = false;
function editVoucher(v) {
  const isNew = !v; v = v || { id: uid(), name: '', value: '', code: '', expires: null, note: '', used: false };
  form({ title: isNew ? 'Nouveau bon cadeau' : v.name, fields: [
    { k: 'name', label: 'Où / quoi', type: 'text', value: v.name, autofocus: isNew },
    { k: 'value', label: 'Valeur restante', type: 'text', value: v.value, placeholder: 'Ex. 40 €' },
    { k: 'code', label: 'Code (facultatif)', type: 'text', value: v.code },
    { k: 'expires', label: "Date d'expiration", type: 'date', value: v.expires, help: "Apparaît sur l'Accueil 1 mois avant." },
    { k: 'note', label: 'Note', type: 'text', value: v.note, placeholder: 'Offert par…, en boutique uniquement…' },
    { k: 'used', label: 'Entièrement utilisé', type: 'check', value: v.used },
  ], required: ['name'], onSave: x => { Object.assign(v, x); if (isNew) DB.vouchers.push(v); }, onDelete: isNew ? null : () => { DB.vouchers = DB.vouchers.filter(y => y !== v); } });
}
function pageBons() {
  const t = today();
  const act = DB.vouchers.filter(v => !v.used).sort((a, b) => (a.expires || '9').localeCompare(b.expires || '9'));
  const used = DB.vouchers.filter(v => v.used);
  const total = act.reduce((s, v) => s + (parseFloat(String(v.value).replace(',', '.')) || 0), 0);
  let h = back('#plus', 'Plus') + head('Bons cadeaux', { color: RUB.bons.fg, add: () => editVoucher(null), addLabel: 'Ajouter un bon', sub: `${total ? Math.round(total) + ' € à utiliser · ' : ''}triés par date d'expiration` });
  h += act.length ? act.map(v => {
    const soon = v.expires && diff(t, v.expires) <= 45;
    return `<div class="card pad${soon ? ' late' : ''}"><div class="between"><div role="button" tabindex="0" ${A(() => editVoucher(v))}><div class="title">${esc(v.name)}</div>${v.note ? `<div class="meta">${esc(v.note)}</div>` : ''}</div><span class="title" style="font-size:19px">${esc(v.value || '')}</span></div>
      ${v.expires ? `<div class="warn ${soon ? 'late' : ''}" style="${soon ? '' : 'background:#FAF9F7;color:var(--ink2)'}">${ico('clock', 16)}<span>Expire le ${fDay(v.expires)}${v.expires >= t ? `, dans ${ago(diff(t, v.expires))}` : ' (expiré)'}</span></div>` : ''}
      ${v.code ? `<div class="note between" style="align-items:center"><span class="meta">Code</span><span style="font-family:ui-monospace,monospace;letter-spacing:.06em">${shownCodes.has(v.id) ? esc(v.code) : '•••• ' + esc(v.code.slice(-4))}</span><button class="btn sm" ${A(() => { shownCodes.has(v.id) ? shownCodes.delete(v.id) : shownCodes.add(v.id); render(); })}>${shownCodes.has(v.id) ? 'Masquer' : 'Afficher'}</button></div>` : ''}
      <div class="btns"><button class="btn sm" ${A(() => form({ title: 'Utilisé en partie', fields: [{ k: 'value', label: 'Valeur restante', type: 'text', value: v.value }], onSave: x => { v.value = x.value || ''; } }))}>Utilisé en partie</button>
      <button class="btn sm ok" ${A(() => { v.used = true; commit('Bon utilisé'); })}>Entièrement utilisé</button></div></div>`;
  }).join('') : `<div class="card"><p class="empty">Aucun bon à utiliser.</p></div>`;
  h += `<p class="hint">Chaque bon apparaît sur l'Accueil 1 mois avant son expiration. Les bons de voyage sont dans Voyages.</p>`;
  if (used.length) h += `<button class="link" style="align-self:center" ${A(() => { showUsedVouchers = !showUsedVouchers; render(); })}>${showUsedVouchers ? 'Masquer' : 'Voir'} les ${used.length} bons déjà utilisés</button>` + (showUsedVouchers ? list(used.map(v => row({ title: v.name, done: true, act: () => editVoucher(v) })).join('')) : '');
  return h;
}

/* ============================== Problèmes ============================== */
let showDonePb = false;
function editProblem(p) {
  const isNew = !p; p = p || { id: uid(), title: '', state: 'me', nextAction: '', due: null, log: [{ date: today(), text: 'Noté' }] };
  form({ title: isNew ? 'Nouveau problème' : p.title, fields: [
    { k: 'title', label: 'Problème', type: 'text', value: p.title, autofocus: isNew },
    { k: 'nextAction', label: 'Prochaine action', type: 'text', value: p.nextAction, placeholder: 'Ex. appeler le plombier' },
    { k: 'due', label: 'À faire / relancer le (facultatif)', type: 'date', value: p.due },
    { k: 'state', label: 'État', type: 'seg', value: p.state, options: [['me', 'À moi d’agir'], ['wait', 'En attente'], ['done', 'Réglé']] },
  ], required: ['title'], onSave: v => { if (!isNew && v.state !== p.state) p.log.push({ date: today(), text: { me: 'À moi d’agir', wait: 'En attente d’une réponse', done: 'Réglé' }[v.state] }); Object.assign(p, v); if (isNew) DB.problems.push(p); },
  onDelete: isNew ? null : () => { DB.problems = DB.problems.filter(y => y !== p); } });
}
function pbCard(p) {
  const t = today();
  return `<div class="card pad"><div class="between"><span class="title" role="button" tabindex="0" ${A(() => editProblem(p))}>${esc(p.title)}</span>${p.due ? pill((p.state === 'wait' ? 'relancer ' : '') + fShort(p.due), p.due < t ? 'late' : diff(t, p.due) <= 7 ? 'soon' : '') : ''}</div>
    ${p.nextAction ? `<div class="note"><span class="meta">Prochaine action :</span> ${esc(p.nextAction)}</div>` : ''}
    ${p.log.length > 1 ? `<div style="display:flex;flex-direction:column;gap:6px;border-left:2px solid var(--line);padding-left:12px;font-size:13px">${p.log.slice(-4).map(e => `<div><span class="meta">${esc(fDay(e.date))}</span> · ${esc(e.text)}</div>`).join('')}</div>` : ''}
    <div class="btns"><button class="btn sm" ${A(() => form({ title: 'Ajouter une étape', fields: [{ k: 'text', label: "Qu'est-ce qui s'est passé ?", type: 'text', autofocus: true }, { k: 'next', label: 'Prochaine action (facultatif)', type: 'text', value: p.nextAction }, { k: 'due', label: 'Relancer / agir le (facultatif)', type: 'date', value: p.due }, { k: 'state', label: 'État', type: 'seg', value: p.state, options: [['me', 'À moi d’agir'], ['wait', 'En attente']] }],
      required: ['text'], onSave: v => { p.log.push({ date: today(), text: v.text }); p.nextAction = v.next || ''; p.due = v.due; p.state = v.state || p.state; } }))}>Ajouter une étape</button>
    ${p.state === 'done' ? '' : `<button class="btn sm ok" ${A(() => { p.state = 'done'; p.due = null; p.log.push({ date: today(), text: 'Réglé' }); commit('Problème réglé'); })}>Réglé</button>`}</div></div>`;
}
function pageProblemes() {
  const me = DB.problems.filter(p => p.state === 'me'), wait = DB.problems.filter(p => p.state === 'wait'), done = DB.problems.filter(p => p.state === 'done');
  let h = back('#plus', 'Plus') + head('Problèmes à régler', { add: () => editProblem(null), addLabel: 'Ajouter un problème' });
  h += sec('À moi d’agir', me.length ? me.map(pbCard).join('') : `<div class="card"><p class="empty">Rien.</p></div>`);
  if (wait.length) h += sec('En attente d’une réponse', wait.map(pbCard).join(''));
  if (done.length) h += `<button class="link" style="align-self:center" ${A(() => { showDonePb = !showDonePb; render(); })}>${showDonePb ? 'Masquer' : 'Voir'} les ${done.length} problèmes réglés</button>` + (showDonePb ? done.map(pbCard).join('') : '');
  return h;
}

/* ============================== Papiers ============================== */
function pagePapiers() {
  const cur = ym(today());
  const months = []; for (let i = 5; i >= 0; i--) months.push(ym(addMonths(`${cur}-01`, -i)));
  const pp = paperPending();
  let h = back('#plus', 'Plus') + head('Papiers à extraire', { sub: 'Coche quand le document est téléchargé et rangé.' });
  if (pp.length) h += `<div class="warn late">${ico('file', 16)}<span><b>${plural(pp.length, 'document en attente', 'documents en attente')}</b></span></div>`;
  if (!DB.papers.types.length) h += `<div class="card"><p class="empty">Aucun type de document. Ajoute-en dans les réglages.</p></div>`;
  else {
    h += `<div class="card pad"><div class="pgrid"><span></span>${months.map(m => `<span class="h">${esc(fmt(m + '-01', { month: 'short' }))}</span>`).join('')}
    ${DB.papers.types.map(ty => `<span class="name">${esc(ty.name)}${ty.every > 1 ? `<small>${ty.every === 12 ? 'chaque année' : `tous les ${ty.every} mois`}</small>` : ''}</span>${months.map(m => {
      const st = paperState(ty, m), k = `${ty.id}:${m}`;
      if (st === 'done') return `<button class="cell done" aria-label="${esc(ty.name)} ${m} : extrait (annuler)" ${A(() => { delete DB.papers.done[k]; commit(); })}>${ico('check', 16)}</button>`;
      if (st === 'todo') return `<button class="cell todo" aria-label="${esc(ty.name)} ${m} : à extraire" ${A(() => { DB.papers.done[k] = today(); commit('Extrait'); })}></button>`;
      if (st === 'future') return `<span class="cell" aria-label="pas encore arrivé">–</span>`;
      return `<span class="cell" aria-label="pas attendu">·</span>`;
    }).join('')}`).join('')}</div>
    <div class="flex" style="flex-wrap:wrap;gap:14px;border-top:1px solid var(--line2);padding-top:10px;font-size:12px;color:var(--ink2)">
      <span class="flex" style="gap:6px"><span class="cell done" style="width:14px;height:14px"></span>Extrait</span>
      <span class="flex" style="gap:6px"><span class="cell todo" style="width:14px;height:14px"></span>À extraire (touche pour cocher)</span>
      <span>– pas encore arrivé · pas attendu</span></div></div>`;
  }
  const tasks = DB.tasks.filter(x => x.rub === 'papiers' && !x.done);
  if (tasks.length) h += sec('Autres papiers', list(tasks.map(taskRow).join('')));
  h += `<a class="btn" href="#papiers-types">${ico('gear')}Gérer les types de documents</a>`;
  return h;
}
function editPaperType(ty) {
  const isNew = !ty; ty = ty || { id: uid(), name: '', every: 1, day: 1, since: ym(today()), folder: '', source: '' };
  form({ title: isNew ? 'Nouveau type de document' : ty.name, fields: [
    { k: 'name', label: 'Nom', type: 'text', value: ty.name, autofocus: isNew },
    { k: 'every', label: 'Arrive', type: 'seg', value: String(ty.every), options: [['1', 'Chaque mois'], ['2', 'Tous les 2 mois'], ['3', 'Tous les 3 mois'], ['12', 'Chaque année']] },
    { k: 'day', label: 'Vers le combien du mois', type: 'number', value: ty.day, min: 1 },
    { k: 'since', label: 'Premier mois à suivre', type: 'month', value: ty.since, help: 'Pour un rythme de 2, 3 ou 12 mois : un mois où le document arrive.' },
    { k: 'folder', label: 'Où le ranger (facultatif)', type: 'text', value: ty.folder },
    { k: 'source', label: 'Où le télécharger (facultatif)', type: 'text', value: ty.source },
  ], required: ['name'], onSave: v => { v.every = +v.every || 1; v.day = Math.min(Math.max(+v.day || 1, 1), 31); v.since = v.since || ym(today()); Object.assign(ty, v); if (isNew) DB.papers.types.push(ty); },
  onDelete: isNew ? null : () => { DB.papers.types = DB.papers.types.filter(x => x !== ty); } });
}
function pagePapiersTypes() {
  let h = back('#papiers', 'Papiers') + head('Types de documents', { add: () => editPaperType(null), addLabel: 'Nouveau type de document', sub: 'Pour chaque type, une case « à extraire » apparaît automatiquement à partir de son jour d’arrivée.' });
  h += DB.papers.types.length ? list(DB.papers.types.map(ty => row({ title: ty.name, sub: esc([ty.every === 1 ? 'Tous les mois' : ty.every === 12 ? 'Chaque année' : `Tous les ${ty.every} mois`, `vers le ${ty.day}`, ty.folder].filter(Boolean).join(' · ')), act: () => editPaperType(ty), chev: true })).join('')) : `<div class="card"><p class="empty">Aucun type pour l’instant.</p></div>`;
  h += `<button class="btn ghost" ${A(() => editPaperType(null))}>+ Nouveau type de document</button>`;
  return h;
}

/* ============================== Autre ============================== */
function pageAutre() {
  const xs = DB.tasks.filter(x => x.rub === 'autre' && !x.done);
  const dated = xs.filter(x => x.due).sort((a, b) => a.due.localeCompare(b.due)), und = xs.filter(x => !x.due);
  let h = back('#plus', 'Plus') + head('Autre', { add: () => editTask(null, 'autre'), sub: "Tout ce qui n'entre dans aucune rubrique" });
  h += sec('Avec une date', dated.length ? list(dated.map(taskRow).join('')) : `<div class="card"><p class="empty">Rien.</p></div>`);
  h += sec('Sans date', und.length ? list(und.map(taskRow).join('')) : `<div class="card"><p class="empty">Rien.</p></div>`);
  return h;
}

/* ============================== Routage ============================== */
const ROUTES = {
  accueil: [pageAccueil, 'accueil'], completer: [pageCompleter, 'accueil'], trier: [pageTrier, 'accueil'], revue: [pageRevue, 'accueil'],
  sante: [pageSante, 'sante'], voyages: [pageVoyages, 'voyages'], import: [pageImport, 'voyages'],
  projets: [pageProjets, 'projets'], projet: [pageProjet, 'projets'],
  plus: [pagePlus, 'plus'], corvees: [pageCorvees, 'plus'], achats: [pageAchats, 'plus'], anniversaires: [pageAnniversaires, 'plus'],
  bons: [pageBons, 'plus'], problemes: [pageProblemes, 'plus'], papiers: [pagePapiers, 'plus'], 'papiers-types': [pagePapiersTypes, 'plus'], autre: [pageAutre, 'plus'],
};
const TABS = [['accueil', 'Accueil', 'sun'], ['sante', 'Santé', 'heart'], ['voyages', 'Voyages', 'suitcase'], ['projets', 'Projets', 'folder'], ['plus', 'Plus', 'dots']];
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
let lastRoute = '';
function render() {
  const [r, arg] = (location.hash.slice(1) || 'accueil').split('/');
  const [fn, tab] = ROUTES[r] || ROUTES.accueil;
  const same = lastRoute === location.hash; const y = window.scrollY;
  PA.clear();
  const app = document.getElementById('app');
  try { app.innerHTML = fn(arg); }
  catch (e) { console.error(e); app.innerHTML = `<div class="card pad"><b>Oups, un problème d'affichage.</b><span class="meta">${esc(e.message)}</span><a class="btn" href="#accueil">Revenir à l'accueil</a></div>`; }
  document.getElementById('tabs').innerHTML = TABS.map(([k, l, i]) => `<a href="#${k}"${k === tab ? ' aria-current="page"' : ''}>${ico(i, 24)}${l}</a>`).join('');
  if (same) window.scrollTo(0, y); else window.scrollTo(0, 0);
  lastRoute = location.hash;
}
window.addEventListener('hashchange', () => { closeSheet(); render(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && !sheetOpen && !document.querySelector('.ov')) render(); });
render();
