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
  brush: '<path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L13 13.6 10.4 11z"/><path d="M10.4 11c-2 0-3.4 1.4-3.4 3.4 0 1.6-.9 2.8-2.5 3.6 4 .9 8.3-.7 8.5-4.4z"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  leaf: '<path d="M5 21c0-9 5-15 15-16-1 10-7 15-15 16z"/><path d="M5 21 13 13"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  camera: '<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/>',
  star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
  wrench: '<path d="M15 4a5 5 0 0 0-4.5 7.2L3 18.7 5.3 21l7.5-7.5A5 5 0 0 0 20 9l-3 3-3-3 3-3a5 5 0 0 0-2-2z"/>',
  grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  pulse: '<path d="M3 12h4l2.5-6 5 12 2.5-6h4"/>',
  party: '<path d="M4 20l5-14 9 9z"/><path d="M14 4v2M19 9h2M17 6l1.5-1.5"/>',
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
  activite: { label: 'Activité', icon: 'pulse', bg: '#FDECEA', fg: '#B4372F', href: '#activite' },
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
    settings: { backupEveryDays: 7, lastBackup: null, soonDays: 30, lastReview: null, snooze: {}, ack: {}, createdAt: t,
      notify: {}, notifTime: '09:00', bdayBefore: 0, autoSend: true, shortcutName: 'Quotidien vers Rappels', notifSig: null, notifSent: null },
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
    fetes: [],
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
    activity: { weeks: {}, view: 'week' },
  };
}

function migrate(d) {
  const s = seed();
  for (const k of Object.keys(s)) if (d[k] === undefined) d[k] = s[k];
  d.settings = Object.assign({}, s.settings, d.settings);
  d.health = Object.assign({}, s.health, d.health);
  d.papers = Object.assign({}, s.papers, d.papers);
  d.activity = Object.assign({}, s.activity, d.activity); if (!d.activity.weeks || typeof d.activity.weeks !== 'object') d.activity.weeks = {};
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
  const h = fieldHTML0(f);
  return f.when ? `<div data-when="${esc(f.when)}">${h}</div>` : h;
}
function fieldHTML0(f) {
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
function form({ title, fields, submit = 'Enregistrer', onSave = () => {}, onDelete, deleteLabel = 'Supprimer', extra = '', required = [], notify = null, autoSend = false }) {
  if (notify) fields = [...fields, ...notifyFields(notify)];
  const root = openSheet(() => `${sheetHead(title)}${fields.map(fieldHTML).join('')}${extra}
    <p class="err" hidden></p>
    <div class="btns">${onDelete ? `<button class="btn danger" ${A(() => { if (confirm('Supprimer définitivement ?')) { onDelete(); closeSheet(); commit('Supprimé'); if (autoSend) autoSendNow(); } })}>${esc(deleteLabel)}</button>` : ''}
    <button class="btn primary" data-submit="1">${esc(submit)}</button></div>`);
  const valOf = k => { const r = root.querySelector(`input[name="${k}"]:checked`); if (r) return r.value; const e = root.querySelector(`[name="${k}"]`); return e ? e.value : ''; };
  const updWhen = () => root.querySelectorAll('[data-when]').forEach(w => { w.hidden = !w.dataset.when.split('&').every(c => { const [k, vals] = c.split('='); return vals.split('|').includes(valOf(k)); }); });
  root.addEventListener('change', updWhen); updWhen();
  root.querySelector('[data-submit]').addEventListener('click', () => {
    const v = readForm(root, fields);
    const meta = {}; for (const k of Object.keys(v)) if (k.startsWith('_')) { meta[k] = v[k]; delete v[k]; }
    const miss = required.find(k => v[k] == null || v[k] === '');
    if (miss) { const er = root.querySelector('.err'); er.hidden = false; er.textContent = `Renseigne « ${fields.find(f => f.k === miss).label} ».`; return; }
    const before = notify ? DB.settings.notify[notify] : undefined;
    if (onSave(v) === false) return;
    if (notify) applyNotify(notify, meta);
    const changed = autoSend || (notify && (before || null) !== (DB.settings.notify[notify] || null));
    closeSheet(); commit();
    if (changed) autoSendNow();
  });
  return root;
}
/* ---- notifications (via l'app Rappels) ---- */
const NDEF = () => DB.settings.notifTime || '09:00';
function notifyFields(sid) {
  const cur = DB.settings.notify[sid];
  return [{ k: '_notify', label: "Me notifier (via l'app Rappels)", type: 'check', value: !!cur },
    { k: '_ntime', label: 'Heure de la notification', type: 'time', value: cur || NDEF(), help: 'La notification arrive le jour où l’élément est prévu.' }];
}
function autoSendNow() {
  const S = DB.settings;
  if (S.autoSend === false || !S.notifSent || !notifDirty()) return;
  sendToReminders();
}
function applyNotify(sid, m) { if (m._notify) DB.settings.notify[sid] = m._ntime || NDEF(); else delete DB.settings.notify[sid]; }
function sidOf(key) {
  const [a, b] = key.split(':');
  if (a === 'pharma' || a === 'presc' || a === 'papers') return a;
  if (a === 'rdv' || a === 'book') return 'pract:' + b;
  return a + ':' + b;
}
function askDate(title, value, cb, { label = 'Date', help } = {}) {
  form({ title, fields: [{ k: 'd', label, type: 'date', value: value || today(), help }], submit: 'Valider', required: ['d'], onSave: v => cb(v.d) });
}

let toastT;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.remove('act'); t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }
function toastUndo(msg, undo) {
  const t = document.getElementById('toast'); t.innerHTML = `<span>${esc(msg)}</span><button type="button">Annuler</button>`; t.classList.add('on', 'act');
  t.querySelector('button').addEventListener('click', () => { clearTimeout(toastT); t.classList.remove('on', 'act'); undo(); });
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on', 'act'), 4500);
}

/* ============================== Calculs ============================== */
const ORD = n => n === 1 ? '1er' : String(n);
function fixedRhythm(c) {
  const n = +c.every || 1;
  if (c.freq === 'week') return `${n === 1 ? 'Chaque' : n === 2 ? 'Un' : `Toutes les ${n} semaines, le`} ${WEEKDAYS[+(c.fweekday ?? 1)]}${n === 2 ? ' sur deux' : ''}`;
  if (c.freq === 'year') return `Chaque année le ${c.md ? fmt(`2000-${c.md}`, { day: 'numeric', month: 'long' }).replace(/^1 /, '1er ') : '?'}`;
  const day = +c.dom >= 31 ? 'le dernier jour' : `le ${ORD(+c.dom || 1)}`;
  return `${day.charAt(0).toUpperCase() + day.slice(1)} ${n === 1 ? 'de chaque mois' : `tous les ${n} mois`}`;
}
/* Prochaine occurrence d'une corvée à date fixe, à partir de « from » (inclus) */
function nextFixed(c, from) {
  const n = Math.max(1, +c.every || 1), anchor = c.anchor || c.createdAt || today();
  if (c.freq === 'week') {
    const d = parse(anchor); while (d.getDay() !== +(c.fweekday ?? 1)) d.setDate(d.getDate() + 1);
    let x = iso(d); let guard = 0;
    while (x < from && guard++ < 2000) x = addDays(x, 7 * n);
    return x;
  }
  if (c.freq === 'year') {
    if (!c.md) return null;
    const y = +from.slice(0, 4); const fix = yy => { const last = new Date(yy, +c.md.slice(0, 2), 0).getDate(); return `${yy}-${c.md.slice(0, 2)}-${pad(Math.min(+c.md.slice(3), last))}`; };
    return fix(y) >= from ? fix(y) : fix(y + 1);
  }
  const [ay, am] = anchor.split('-').map(Number); let k = 0; let x;
  do {
    const tot = (am - 1) + k * n, yy = ay + Math.floor(tot / 12), mm = tot % 12 + 1;
    const last = new Date(yy, mm, 0).getDate();
    x = `${yy}-${pad(mm)}-${pad(Math.min(+c.dom >= 31 ? 31 : (+c.dom || 1), last))}`; k++;
  } while (x < from && k < 1200);
  return x;
}
function fixedTolerance(c) { return c.freq === 'week' ? Math.min(3, 2 * (+c.every || 1)) : c.freq === 'year' ? 30 : 7; }
function rhythm(c) {
  if (c.mode === 'fixed') return fixedRhythm(c);
  const u = c.unit || 'weeks', min = +c.min || 1, max = Math.max(+c.max || min, min);
  const un = { days: ['jour', 'jours'], weeks: ['semaine', 'semaines'], months: ['mois', 'mois'] }[u];
  let s;
  if (min === max) s = min === 1 ? (u === 'weeks' ? 'Chaque semaine' : u === 'months' ? 'Chaque mois' : 'Chaque jour') : `${u === 'weeks' ? 'Toutes les' : 'Tous les'} ${min} ${un[1]}`;
  else s = `${u === 'weeks' ? 'Toutes les' : 'Tous les'} ${min} à ${max} ${un[1]}`;
  if (c.weekday != null && c.weekday !== '') s += `, le ${WEEKDAYS[+c.weekday]}`;
  return s;
}
function choreDue(c) {
  if (c.mode === 'fixed') {
    let due;
    if (!c.lastDone) due = nextFixed(c, c.anchor || c.createdAt || today());
    else {
      due = nextFixed(c, addDays(c.lastDone, 1));
      if (due && diff(c.lastDone, due) <= fixedTolerance(c)) due = nextFixed(c, addDays(due, 1));   // fait un peu en avance : compte pour cette fois
    }
    return due ? { due, late: due, from: due, range: false } : null;
  }
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
  for (const c of DB.travelCards) if (c.expires && c.kind !== 'points') push({ key: `tcard:${c.id}:${c.expires}`, rub: 'voyages', icon: 'ticket', title: c.name, sub: `Expire le ${fDay(c.expires)}`, date: addMonths(c.expires, c.kind === 'voucher' ? -3 : -1), late: c.expires, href: '#voyages', done: () => { S.ack[`tcard:${c.id}:${c.expires}`] = 1; } });
  for (const v of DB.vouchers) if (!v.used && v.expires) push({ key: `voucher:${v.id}:${v.expires}`, rub: 'bons', title: `${v.name}${v.value ? ', ' + v.value : ''}`, sub: `Expire le ${fDay(v.expires)}`, date: addMonths(v.expires, -3), late: v.expires, href: '#bons', done: () => { v.used = true; } });
  for (const b of DB.birthdays) {
    const d = nextBirthday(b);
    const gs = { none: '', idea: 'Idée de cadeau notée', tobuy: 'Cadeau à acheter', bought: 'Cadeau acheté', msg: 'Un message suffit' }[b.giftStatus || 'none'];
    push({ key: `bday:${b.id}:${d.slice(0, 4)}`, rub: 'anniversaires', title: `Anniversaire de ${b.name}`, sub: [b.gift, gs].filter(Boolean).join(' · '), date: d, kind: 'event', href: '#anniversaires', done: () => { S.ack[`bday:${b.id}:${d.slice(0, 4)}`] = 1; } });
  }
  for (const f of DB.fetes) {
    const d = nextFete(f); if (!d) continue;
    const gs = { none: '', idea: 'Idée de cadeau notée', tobuy: 'Cadeau à acheter', bought: 'Cadeau acheté', msg: 'Un message suffit' }[f.giftStatus || 'none'];
    push({ key: `fete:${f.id}:${d.slice(0, 4)}`, rub: 'anniversaires', icon: 'party', title: feteTitle(f), sub: [f.gift, gs].filter(Boolean).join(' · '), date: d, kind: 'event', href: '#anniversaires', done: () => { S.ack[`fete:${f.id}:${d.slice(0, 4)}`] = 1; } });
  }
  for (const g of DB.giftLists) {
    if (!g.date) continue; const left = g.items.filter(i => i.status !== 'bought').length; if (!left) continue;
    push({ key: `glist:${g.id}:${g.date}`, rub: 'anniversaires', title: `${g.title} : ${plural(left, 'cadeau', 'cadeaux')} à prévoir`, sub: `Le ${fDay(g.date)}`, date: addDays(g.date, -30), late: g.date, href: '#anniversaires', done: () => { S.ack[`glist:${g.id}:${g.date}`] = 1; } });
  }
  for (const p of DB.projects) if (p.status === 'active') for (const s of p.steps) if (!s.done && s.due) push({ key: `step:${s.id}:${s.due}`, rub: 'projets', title: s.title, sub: p.title, date: s.due, href: '#projet/' + p.id, done: () => stepDone(p, s) });
  for (const pb of DB.problems) if (pb.state !== 'done' && pb.due) push({ key: `pb:${pb.id}:${pb.due}`, rub: 'problemes', title: pb.title, sub: pb.nextAction || (pb.state === 'wait' ? 'Relancer' : 'À faire'), date: pb.due, href: '#problemes', done: () => { pb.log.push({ date: today(), text: pb.state === 'wait' ? 'Relance faite' : 'Action faite' }); pb.due = null; } });
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
    <div class="field"><span class="lbl">Notification</span>${/^(bday|fete):/.test(sidOf(e.key)) ? '<span class="meta">Les anniversaires et les fêtes sont toujours notifiés.</span>' : `<div class="btns"><button class="btn sm ${DB.settings.notify[sidOf(e.key)] ? 'soon' : ''}" ${A(() => { closeSheet(); form({ title: 'Notification', fields: [], notify: sidOf(e.key), submit: 'Enregistrer' }); })}>${ico('bell', 16)}${DB.settings.notify[sidOf(e.key)] ? 'Notifié à ' + DB.settings.notify[sidOf(e.key)] : 'Me notifier'}</button></div>`}</div>
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
  const t = today(); const id = uid();
  switch (rub) {
    case 'voyages': DB.trips.push({ id, title, reminder: date, note: '', legs: [] }); return 'trip:' + id;
    case 'projets': DB.projects.push({ id, title, status: 'active', goal: '', target: date, color: PCOLORS[DB.projects.length % PCOLORS.length][0], icon: 'folder', photo: null, notes: '', steps: [], log: [{ date: t, text: 'Projet créé' }] }); return null;
    case 'corvees': DB.chores.push({ id, title, min: 1, max: 1, unit: 'weeks', weekday: null, lastDone: addDays(date || t, -7) }); return 'chore:' + id;
    case 'achats': if (opts.amazon) { DB.amazon.push({ id, title }); return null; } DB.tasks.push({ id, rub, title, due: date, note: '', done: false, createdAt: t }); return 'task:' + id;
    case 'anniversaires':
      if (date) DB.birthdays.push({ id, name: title, md: date.slice(5), year: null, gift: '', giftStatus: 'none' });
      else DB.giftIdeas.push({ id, person: '', text: title });
      return null;
    case 'bons': DB.vouchers.push({ id, name: title, value: '', code: '', expires: date, note: '', used: false }); return 'voucher:' + id;
    case 'problemes': DB.problems.push({ id, title, state: 'me', nextAction: '', due: date, log: [{ date: t, text: 'Noté' }] }); return 'pb:' + id;
    default: DB.tasks.push({ id, rub, title, due: date, note: '', done: false, createdAt: t }); return 'task:' + id;
  }
}
function quickAdd(prefill = '', inboxItem = null) {
  const root = openSheet(() => `${sheetHead(inboxItem ? 'Ranger' : 'Ajouter')}
    <div class="field"><label for="qa_t">Quoi ?</label><input type="text" id="qa_t" value="${esc(prefill)}" ${inboxItem ? '' : 'autofocus'} placeholder="Ex. rappeler la banque"></div>
    ${inboxItem ? '' : `<button class="btn primary block" data-inbox="1">${ico('inbox')}Ranger dans « À trier »</button>
    <div class="divider">ou préciser tout de suite</div>`}
    <div class="field"><span class="lbl">Rubrique</span><div class="chips">${RUB_CHOICES.map(r => `<label><input type="radio" name="qa_r" value="${r}"><span>${RUB[r].label}</span></label>`).join('')}</div></div>
    <label class="checkline" data-amz hidden><input type="checkbox" id="qa_amz">Dans la liste de la commande Amazon</label>
    <div class="field"><label for="qa_d">Date (facultatif)</label><input type="date" id="qa_d"><span class="help" data-dhelp>Le jour où ça doit apparaître sur l'Accueil.</span></div>
    <div class="flex" data-notif><label class="checkline" style="flex:1"><input type="checkbox" id="qa_n">Me notifier ce jour-là à</label><input type="time" id="qa_nt" aria-label="Heure de la notification" value="${NDEF()}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"></div>
    <p class="err" hidden></p>
    <button class="btn ${inboxItem ? 'primary' : ''} block" data-go="1">Ajouter à la rubrique</button>
    ${inboxItem ? `<button class="btn danger block" data-del="1">Supprimer</button>` : ''}`);
  const $ = s => root.querySelector(s);
  const upd = () => {
    const r = (root.querySelector('input[name=qa_r]:checked') || {}).value;
    $('[data-amz]').hidden = r !== 'achats';
    $('[data-notif]').hidden = r === 'anniversaires' || r === 'projets';
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
    const wantN = $('#qa_n').checked;
    if (wantN && !$('#qa_d').value && r !== 'voyages') return err('Choisis une date pour la notification.');
    const sid = createIn(r, title(), $('#qa_d').value || null, { amazon: $('#qa_amz').checked });
    if (wantN && sid) DB.settings.notify[sid] = $('#qa_nt').value || NDEF();
    const auto = (wantN && sid) || (r === 'anniversaires' && $('#qa_d').value);
    if (inboxItem) DB.inbox = DB.inbox.filter(i => i !== inboxItem);
    closeSheet(); commit(`Ajouté à ${RUB[r].label}`);
    if (auto) autoSendNow();
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
  for (const c of DB.chores) if (!c.lastDone && c.mode !== 'fixed') out.push({ key: 'c' + c.id, rub: 'corvees', title: c.title, sub: 'Dernière fois ?', set: d => { c.lastDone = d; } });
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
  if (notifDirty()) h += `<button class="banner" style="background:var(--accent-bg);color:var(--accent)" ${A(sendToReminders)}>${ico('bell')}<span>Notifications à mettre à jour dans Rappels</span><b>Envoyer</b></button>`;
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
  const pp = paperPending();
  if (pp.length) out.push({ key: 'papers', rub: 'papiers', title: `Papiers à extraire · ${plural(pp.length, 'document', 'documents')}`, sub: [...new Set(pp.map(x => x.type.name))].join(', '), open: '#papiers' });
  if (DB.amazon.length) out.push({ key: 'amazon', rub: 'achats', title: `Commande Amazon · ${plural(DB.amazon.length, 'article', 'articles')}`, sub: 'Commander maintenant ?', open: '#achats' });
  for (const x of DB.tasks) if (!x.done && !x.due) out.push({ key: 't' + x.id, rub: x.rub || 'autre', title: x.title, sub: RUB[x.rub || 'autre'].label + (x.createdAt ? ` · noté le ${fDay(x.createdAt)}` : ''), date: d => { x.due = d; }, del: () => { DB.tasks = DB.tasks.filter(y => y !== x); } });
  for (const p of DB.problems) if (p.state === 'me' && !p.due) out.push({ key: 'p' + p.id, rub: 'problemes', title: p.title, sub: 'Problème à régler · sans date', date: d => { p.due = d; } });
  for (const p of DB.projects) if (p.status === 'active') { const s = p.steps.find(s => !s.done); if (s && !s.due) out.push({ key: 's' + s.id, rub: 'projets', title: s.title, sub: `${p.title} · prochaine étape sans date`, date: d => { s.due = d; } }); }
  for (const t of DB.trips) if (!t.reminder && (!t.legs.length || t.legs.some(l => !l.booked))) out.push({ key: 'v' + t.id, rub: 'voyages', title: t.title, sub: 'Voyage à organiser · pas de rappel', date: d => { t.reminder = d; } });
  for (const g of DB.giftIdeas) out.push({ key: 'g' + g.id, rub: 'anniversaires', title: g.text, sub: `Idée de cadeau${g.person ? ' pour ' + g.person : ''}`, del: () => { DB.giftIdeas = DB.giftIdeas.filter(y => y !== g); } });
  return out;
}
function pageRevue(step) {
  step = Math.max(0, Math.min(1, +step || 0));
  const names = ['À trier', 'Sans date'];
  let h = `<div class="between" style="align-items:center"><a class="back" href="#accueil" style="margin:0">Fermer</a><span class="tag">Environ 5 min</span></div>${head('Faire le point')}
    <ol class="steps">${names.map((n, i) => `<li class="${i <= step ? 'on' : ''} ${i === step ? 'cur' : ''}"${i === step ? ' aria-current="step"' : ''}>${n}</li>`).join('')}</ol>`;
  if (step === 0) {
    h += `<div><h2 style="margin:0;font-size:20px">À trier · ${DB.inbox.length}</h2><p class="sub">Range chaque élément dans sa rubrique, avec ou sans date.</p></div>`;
    h += DB.inbox.length ? list(DB.inbox.map(it => row({ title: it.title, sub: `Noté le ${fDay(it.createdAt)}`, right: `<span class="btn sm">Ranger</span>`, act: () => quickAdd(it.title, it) })).join('')) : `<div class="card"><p class="empty">Rien à trier.</p></div>`;
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
    if (notifDirty()) h += `<button class="banner" style="background:var(--accent-bg);color:var(--accent)" ${A(sendToReminders)}>${ico('bell')}<span>Mettre à jour les notifications</span><b>Envoyer vers Rappels</b></button>`;
  }
  h += `<div class="btns" style="margin-top:8px">${step > 0 ? `<button class="btn" ${A(() => go('#revue/' + (step - 1)))}>Précédent</button>` : ''}
    ${step < 1 ? `<button class="btn primary" ${A(() => go('#revue/' + (step + 1)))}>Étape suivante</button>` : `<button class="btn primary" ${A(() => { DB.settings.lastReview = today(); kept.clear(); save(); go('#accueil'); toast('Point terminé'); })}>Terminer le point</button>`}</div>`;
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
  ], required: ['start'], notify: 'presc', onSave: v => { Object.assign(P, v); } });
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
  ], required: ['name'], notify: 'pract:' + p.id, onSave: v => { Object.assign(p, v); if (isNew) DB.health.practitioners.push(p); },
  onDelete: isNew ? null : () => { DB.health.practitioners = DB.health.practitioners.filter(x => x !== p); } });
}
function editExam(x) {
  const isNew = !x; x = x || { id: uid(), name: '', everyMonths: 12, lastDone: null, note: '' };
  form({ title: isNew ? 'Nouvel examen régulier' : x.name, fields: [
    { k: 'name', label: 'Nom', type: 'text', value: x.name },
    { k: 'everyMonths', label: 'Tous les combien de mois', type: 'number', value: x.everyMonths, min: 1 },
    { k: 'lastDone', label: 'Dernière fois', type: 'date', value: x.lastDone },
    { k: 'note', label: 'Note', type: 'text', value: x.note },
  ], required: ['name', 'everyMonths'], notify: 'exam:' + x.id, onSave: v => { Object.assign(x, v); if (isNew) DB.health.exams.push(x); },
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
  ], required: ['label'], notify: 'claim:' + c.id, onSave: v => { Object.assign(c, v); if (isNew) DB.health.claims.push(c); },
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
      { k: 'lastDone', label: 'Dernier passage', type: 'date', value: P.lastDone }], notify: 'pharma', onSave: v => { Object.assign(P, v); } }))}>Modifier</button>
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
  ], required: ['title'], notify: 'task:' + x.id, onSave: v => { Object.assign(x, v); if (isNew) DB.tasks.push(x); },
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
  ], required: ['title'], notify: 'trip:' + tr.id, onSave: v => { Object.assign(tr, v); if (isNew) DB.trips.push(tr); },
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
  ], notify: 'leg:' + l.id, onSave: v => { Object.assign(l, v); if (isNew) tr.legs.push(l); tr.legs.sort((a, b) => (a.date || '').localeCompare(b.date || '')); },
  onDelete: isNew ? null : () => { tr.legs = tr.legs.filter(y => y !== l); } });
}
function editTravelCard(c) {
  const isNew = !c; c = c || { id: uid(), kind: 'card', name: '', value: '', expires: null, note: '' };
  form({ title: isNew ? 'Carte, bon ou points' : c.name, fields: [
    { k: 'kind', label: 'Type', type: 'seg', value: c.kind, options: [['card', 'Carte'], ['voucher', 'Bon'], ['points', 'Points']] },
    { k: 'name', label: 'Nom', type: 'text', value: c.name },
    { k: 'value', label: 'Montant ou solde', type: 'text', value: c.value },
    { k: 'expires', label: 'Expire le', type: 'date', value: c.expires, help: "Apparaît sur l'Accueil 1 mois avant (3 mois avant pour un bon)." },
    { k: 'note', label: 'Note', type: 'text', value: c.note },
  ], required: ['name'], notify: 'tcard:' + c.id, onSave: v => { Object.assign(c, v); c.updated = today(); if (isNew) DB.travelCards.push(c); },
  onDelete: isNew ? null : () => { DB.travelCards = DB.travelCards.filter(y => y !== c); } });
}
function reminderSheet(tr) {
  const root = openSheet(() => `${sheetHead("Rappel sur l'Accueil")}
    <p class="meta" style="margin:-6px 0 0">Le voyage « ${esc(tr.title)} » apparaîtra sur l'Accueil ce jour-là, pour penser à fixer les dates ou acheter les billets.</p>
    <div class="field"><label for="rm_d">Date</label><input type="date" id="rm_d" value="${esc(tr.reminder || addDays(today(), 7))}"></div>
    <div class="btns">${tr.reminder ? `<button class="btn danger" ${A(() => { tr.reminder = null; Object.keys(DB.settings.snooze).filter(k => k.startsWith('trip:' + tr.id)).forEach(k => delete DB.settings.snooze[k]); closeSheet(); commit('Rappel retiré'); })}>Retirer le rappel</button>` : ''}
    <button class="btn primary" ${A(() => { const d = document.getElementById('rm_d').value; if (!d) return; tr.reminder = d; closeSheet(); commit('Rappel enregistré'); })}>Enregistrer</button></div>`);
  return root;
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
      ${unbooked ? `<button class="btn sm ${tr.reminder ? 'soon' : ''}" ${A(() => reminderSheet(tr))}>${ico('bell', 16)}${tr.reminder ? 'Sur l’accueil le ' + fDay(tr.reminder) : 'Choisir une date de rappel'}</button>` : ''}
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
/* Format en phrases (e-mails SNCF Connect) :
   « Départ de Lyon Part-Dieu le 22/11 à 18:30. Arrivée à Massy TGV (…) à 20:33 à bord du TGV INOUI 5358. » */
const MONTH_ALT = MONTH_RE.slice(1, -1);
const DATE_RE = `(\\d{1,2}\\/\\d{1,2}(?:\\/\\d{2,4})?|(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\\s+)?\\d{1,2}(?:er)?\\s+(?:${MONTH_ALT})(?:\\s+\\d{4})?)`;
function frDate(str) {
  if (!str) return null;
  const y0 = new Date().getFullYear(); let d, mi, y = null;
  let m = str.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (m) { d = +m[1]; mi = +m[2] - 1; if (m[3]) y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; }
  else {
    m = str.match(new RegExp(`(\\d{1,2})(?:er)?\\s+(${MONTH_ALT})(?:\\s+(\\d{4}))?`, 'i')); if (!m) return null;
    d = +m[1]; mi = monthIndex(m[2]); if (m[3]) y = +m[3];
  }
  if (mi < 0 || mi > 11 || d < 1 || d > 31) return null;
  let s = `${y || y0}-${pad(mi + 1)}-${pad(d)}`;
  if (!y && s < addDays(today(), -30)) s = `${y0 + 1}-${pad(mi + 1)}-${pad(d)}`;
  return s;
}
function modeOf(s) {
  const l = (s || '').toLowerCase();
  if (/\bvol\b|avion|air ?france|easyjet|transavia|ryanair|vueling|a[ée]roport/.test(l)) return 'avion';
  if (/\bbus\b|\bcar\b|autocar|flixbus|blablacar/.test(l)) return 'bus';
  return 'train';
}
function parseSentences(text) {
  const flat = text.replace(/\s+/g, ' ');
  const A_ = '[àa]', T2 = '(\\d{1,2}\\s*[h:]\\s*\\d{2})';
  const re = new RegExp(
    `d[ée]part\\s+(?:de\\s+|depuis\\s+|:\\s*)?(.+?)\\s+le\\s+${DATE_RE}\\s+${A_}\\s+${T2}[\\s.,;]*` +
    `arriv[ée]e\\s+(?:${A_}\\s+|en gare de\\s+|:\\s*)?(.+?)(?:\\s+le\\s+${DATE_RE})?\\s+${A_}\\s+${T2}` +
    `(?:\\s+${A_}\\s+bord\\s+d(?:u|e la|es|e l'|e l’)\\s*([^.]+?))?\\s*(?=\\.|$|d[ée]part\\s)`, 'gi');
  const legs = []; let m; const found = [];
  while ((m = re.exec(flat))) found.push({ m, end: re.lastIndex });
  found.forEach(({ m, end }, i) => {
    const date = frDate(m[2]), arrDate = frDate(m[5]);
    const vehicle = (m[7] || '').trim();
    const rest = flat.slice(end, i + 1 < found.length ? found[i + 1].m.index : end + 200);
    const seat = rest.match(/voiture\s*(\d+)\D{0,12}?place\s*(\d+)/i);
    const info = [vehicle, arrDate && arrDate !== date ? `arrivée le ${fDay(arrDate)}` : '', seat ? `voiture ${seat[1]} · place ${seat[2]}` : ''].filter(Boolean).join(' · ');
    legs.push({ id: uid(), mode: modeOf(vehicle || flat), booked: true, date, dep: normT(m[3]), from: cleanPlace(m[1]), arr: normT(m[6]), to: cleanPlace(m[4]), info });
  });
  return legs;
}
function parseMail(text) {
  const sentenceLegs = parseSentences(text);
  if (sentenceLegs.length) return sentenceLegs;
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
    <button class="btn primary" ${A(() => { S.text = document.getElementById('imp_t').value; S.legs = parseMail(S.text); const g = guessTrip(S.legs); S.target = g ? g.id : 'new'; S.title = ''; render(); if (!S.legs.length) toast('Aucun trajet détecté : ajoute-le à la main'); })}>Analyser</button>`;
  const tgt = DB.trips.find(t => t.id === S.target);
  const plan = S.legs && tgt ? importPlan(tgt, S.legs) : null;
  const planLine = i => { if (!S.legs || !S.legs.length) return ''; if (!plan) return `<span class="meta">Sera ajouté au nouveau voyage.</span>`; const p = plan[i];
    if (p.action === 'replace') return `<span class="warn" style="background:var(--ok-bg);color:var(--ok)">Complète le trajet prévu « ${esc(legLabel(p.target))} » : pas de doublon.</span>`;
    if (p.action === 'skip') return `<span class="warn">Déjà enregistré dans ce voyage : ne sera pas ajouté une deuxième fois.</span>`;
    return `<span class="meta">Sera ajouté au voyage « ${esc(tgt.title)} ».</span>`; };
  if (S.legs) {
    h += sec(`Trajets détectés · ${S.legs.length}`, S.legs.length ? `<div class="card pad">${S.legs.map((l, i) => `<div class="field" style="border-bottom:1px solid var(--line2);padding-bottom:12px">
      <span class="lbl">Trajet ${i + 1}</span>
      <div class="two"><input type="date" data-leg="${i}" data-k="date" value="${esc(l.date || '')}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"><select data-leg="${i}" data-k="mode" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px">${Object.entries(MODES).map(([k, v]) => `<option value="${k}"${k === l.mode ? ' selected' : ''}>${v[0]}</option>`).join('')}</select></div>
      <div class="two"><input type="time" data-leg="${i}" data-k="dep" value="${esc(l.dep || '')}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"><input type="text" data-leg="${i}" data-k="from" value="${esc(l.from || '')}" placeholder="Départ" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"></div>
      <div class="two"><input type="time" data-leg="${i}" data-k="arr" value="${esc(l.arr || '')}" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"><input type="text" data-leg="${i}" data-k="to" value="${esc(l.to || '')}" placeholder="Arrivée" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px"></div>
      <input type="text" data-leg="${i}" data-k="info" value="${esc(l.info || '')}" placeholder="Infos (voiture, place…)" style="min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 8px">
      <label class="checkline"><input type="checkbox" data-leg="${i}" data-k="keep"${l.keep === false ? '' : ' checked'}>Ajouter ce trajet</label>${planLine(i)}</div>`).join('')}</div>` : `<div class="card"><p class="empty">Rien détecté. Tu peux ajouter le trajet à la main depuis Voyages.</p></div>`);
    if (S.legs.length) {
      const opts = [['new', 'Nouveau voyage'], ...DB.trips.map(t => [t.id, t.title])];
      h += `<div class="field"><label for="imp_target">Ajouter au voyage</label><select id="imp_target">${opts.map(([v, l]) => `<option value="${esc(v)}"${v === S.target ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>${tgt ? `<span class="help">Voyage existant reconnu automatiquement. Change-le si ce n'est pas le bon.</span>` : ''}</div>
        ${tgt ? '' : `<div class="field"><label for="imp_title">Nom du nouveau voyage</label><input type="text" id="imp_title" value="${esc(S.title || (S.legs[0] ? S.legs[0].to : ''))}"></div>`}`;
      setTimeout(() => { const sel = document.getElementById('imp_target'); if (sel) sel.addEventListener('change', () => { readImportFields(); const ti = document.getElementById('imp_title'); if (ti) S.title = ti.value; S.target = sel.value; render(); }); }, 0);
      h += `
        <button class="btn primary" style="background:${RUB.voyages.fg};border-color:${RUB.voyages.fg}" ${A(importLegs)}>Ajouter les trajets · billets pris</button>`;
    }
  }
  return h;
}
const normS = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const firstWord = s => normS(s).split(' ').filter(w => !['gare', 'de', 'la', 'le', 'les', 'st', 'saint', 'a'].includes(w))[0] || '';
const sameStation = (a, b) => { const x = normS(a), y = normS(b); if (!x || !y) return false; return x.includes(y) || y.includes(x) || firstWord(x) === firstWord(y); };
const legLabel = l => `${l.from || '?'} → ${l.to || '?'}${l.date ? ' · ' + fDay(l.date) : ''}`;
function guessTrip(legs) {
  let best = null, score = 0;
  for (const tr of DB.trips) {
    const open = !tr.legs.length || tr.legs.some(x => !x.booked);
    const words = normS(tr.title).split(' ');
    let s = 0;
    for (const l of legs) {
      if (tr.legs.some(x => x.date && x.date === l.date)) s += 3;
      if (tr.legs.some(x => sameStation(x.from, l.from) && sameStation(x.to, l.to))) s += 2;
      if (open && (words.includes(firstWord(l.to)) || words.includes(firstWord(l.from)))) s += 2;
    }
    if (!open && !tr.legs.some(x => legs.some(l => l.date && l.date === x.date))) s = 0;
    if (s > score) { score = s; best = tr; }
  }
  return score >= 2 ? best : null;
}
function importPlan(tr, legs) {
  const used = new Set();
  return legs.map(l => {
    const dup = tr.legs.find(x => x.booked && x.date === l.date && (x.dep || '') === (l.dep || '') && sameStation(x.from, l.from));
    if (dup) return { action: 'skip', target: dup };
    const cand = tr.legs.find(x => !x.booked && !used.has(x) && ((x.date && x.date === l.date) || (!x.date && sameStation(x.from, l.from) && sameStation(x.to, l.to))))
      || tr.legs.find(x => !x.booked && !used.has(x) && sameStation(x.from, l.from) && sameStation(x.to, l.to))
      || tr.legs.find(x => !x.booked && !used.has(x) && !x.date && !x.from && !x.to);
    if (cand) { used.add(cand); return { action: 'replace', target: cand }; }
    return { action: 'add' };
  });
}
function readImportFields() {
  const S = importState;
  document.querySelectorAll('[data-leg]').forEach(el => { const l = S.legs[+el.dataset.leg]; l[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
}
function importLegs() {
  const S = importState;
  readImportFields();
  const chosen = S.legs.map((l, i) => ({ l, i })).filter(x => x.l.keep !== false);
  if (!chosen.length) return toast('Aucun trajet sélectionné');
  const target = document.getElementById('imp_target').value;
  let tr = DB.trips.find(t => t.id === target);
  if (!tr) { const ti = document.getElementById('imp_title'); tr = { id: uid(), title: (ti && ti.value.trim()) || chosen[0].l.to || 'Voyage', reminder: null, note: '', legs: [] }; DB.trips.push(tr); }
  const plan = importPlan(tr, S.legs);
  let added = 0, updated = 0, skipped = 0;
  for (const { l, i } of chosen) {
    const { keep, id, ...data } = l; const leg = { ...data, date: l.date || null, booked: true };
    const p = plan[i];
    if (p.action === 'skip') { skipped++; continue; }
    if (p.action === 'replace') { Object.assign(p.target, leg); updated++; }
    else { tr.legs.push({ id: uid(), ...leg }); added++; }
  }
  tr.legs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  if (tr.legs.length && tr.legs.every(x => x.booked)) tr.reminder = null;
  importState = { text: '', legs: null, target: 'new', title: '' };
  save(); go('#voyages');
  toast([added ? plural(added, 'trajet ajouté', 'trajets ajoutés') : '', updated ? plural(updated, 'trajet complété', 'trajets complétés') : '', skipped ? plural(skipped, 'déjà présent', 'déjà présents') : ''].filter(Boolean).join(' · ') || 'Rien à ajouter');
}

/* ============================== Projets ============================== */
function stepDone(p, s) { s.done = true; s.doneAt = today(); p.log.push({ date: today(), text: s.title }); }
function editProject(p) {
  const isNew = !p; p = p || { id: uid(), title: '', status: 'active', goal: '', target: null, color: PCOLORS[DB.projects.length % PCOLORS.length][0], icon: 'folder', photo: null, notes: '', steps: [], log: [{ date: today(), text: 'Projet créé' }] };
  form({ title: isNew ? 'Nouveau projet' : p.title, fields: [
    { k: 'title', label: 'Nom', type: 'text', value: p.title, autofocus: isNew },
    { k: 'goal', label: 'Objectif', type: 'textarea', value: p.goal },
    { k: 'target', label: 'Date cible (facultatif)', type: 'date', value: p.target },
    { k: 'status', label: 'État', type: 'seg', value: p.status, options: [['active', 'En cours'], ['paused', 'En pause'], ['done', 'Terminé']] },
  ], required: ['title'], onSave: v => { if (!isNew && v.status !== p.status) p.log.push({ date: today(), text: { active: 'Repris', paused: 'Mis en pause', done: 'Terminé' }[v.status] }); Object.assign(p, v); if (isNew) { DB.projects.push(p); setTimeout(() => go('#projet/' + p.id), 0); } },
  onDelete: isNew ? null : () => { DB.projects = DB.projects.filter(y => y !== p); go('#projets'); } });
}
/* ---- apparence des projets : couleur, icône ou photo ---- */
const PCOLORS = [['#5B34B0', 'Violet'], ['#2B50D6', 'Bleu'], ['#0F6B63', 'Sarcelle'], ['#3B7D23', 'Vert'], ['#A15C07', 'Ambre'], ['#C2410C', 'Corail'], ['#B4235A', 'Rose'], ['#4A4A52', 'Ardoise']];
const PICONS = ['folder', 'home', 'plane', 'suitcase', 'brush', 'wrench', 'book', 'grad', 'heart', 'leaf', 'music', 'camera', 'star', 'gift', 'cart', 'party'];
const pColor = p => p.color || RUB.projets.fg;
function projVisual(p, size = 44) {
  const r = Math.round(size * 0.27);
  if (p.photo) return `<img src="${p.photo}" alt="" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:${r}px;flex:none">`;
  return `<span style="width:${size}px;height:${size}px;border-radius:${r}px;background:${pColor(p)}1F;color:${pColor(p)};display:flex;align-items:center;justify-content:center;flex:none">${ico(p.icon || 'folder', Math.round(size * 0.5))}</span>`;
}
function resizeImage(file, max = 480) {
  return new Promise((ok, ko) => {
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.75));
    }; img.onerror = ko; img.src = fr.result; };
    fr.onerror = ko; fr.readAsDataURL(file);
  });
}
function appearanceSheet(p) {
  const root = openSheet(() => `${sheetHead('Apparence du projet')}
    <div class="flex" style="gap:14px">${projVisual(p, 64)}<div><b>${esc(p.title)}</b><div class="meta">Aperçu</div></div></div>
    <div class="field"><span class="lbl">Couleur</span><div class="chips">${PCOLORS.map(([c, n]) => `<label><input type="radio" name="pc" value="${c}"${pColor(p) === c ? ' checked' : ''}><span style="gap:6px"><i style="width:14px;height:14px;border-radius:7px;background:${c};display:inline-block"></i>${n}</span></label>`).join('')}</div></div>
    <div class="field"><span class="lbl">Icône</span><div class="chips">${PICONS.map(i => `<label><input type="radio" name="pi" value="${i}"${(p.icon || 'folder') === i ? ' checked' : ''}><span style="padding:0 10px" aria-label="${i}">${ico(i, 20)}</span></label>`).join('')}</div></div>
    <div class="field"><span class="lbl">Photo (remplace l'icône)</span>
      <div class="btns"><label class="btn sm" style="cursor:pointer">${ico('image', 16)}${p.photo ? 'Changer la photo' : 'Choisir une photo'}<input type="file" accept="image/*" id="pp_file" hidden></label>
      ${p.photo ? `<button class="btn sm danger" data-rmphoto="1">Retirer la photo</button>` : ''}</div>
      <span class="help">La photo est réduite et gardée sur ton téléphone avec le reste.</span></div>
    <button class="btn primary" data-ok="1">Enregistrer</button>`);
  const apply = () => { const c = root.querySelector('input[name=pc]:checked'), i = root.querySelector('input[name=pi]:checked'); if (c) p.color = c.value; if (i) p.icon = i.value; };
  root.querySelector('[data-ok]').addEventListener('click', () => { apply(); closeSheet(); commit('Apparence enregistrée'); });
  const rm = root.querySelector('[data-rmphoto]'); if (rm) rm.addEventListener('click', () => { apply(); p.photo = null; save(); appearanceSheet(p); });
  root.querySelector('#pp_file').addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try { apply(); p.photo = await resizeImage(f); save(); appearanceSheet(p); } catch (err) { toast("Impossible de lire cette image"); }
  });
}
let reorderProjects = false;
function moveProject(p, dir) {
  const a = DB.projects, i = a.indexOf(p);
  let j = i + dir; while (j >= 0 && j < a.length && a[j].status !== p.status) j += dir;
  if (j < 0 || j >= a.length) return;
  [a[i], a[j]] = [a[j], a[i]]; save(); render();
}
function pageProjets() {
  let h = head('Projets', { color: RUB.projets.fg, add: () => editProject(null), addLabel: 'Nouveau projet' });
  if (DB.projects.filter(p => p.status !== 'done').length > 1) h += `<button class="link" style="align-self:flex-end;margin:-12px 0 -6px" ${A(() => { reorderProjects = !reorderProjects; render(); })}>${reorderProjects ? 'Terminer' : 'Changer l’ordre'}</button>`;
  const arrows = p => reorderProjects ? `<span class="flex" style="gap:6px;flex:none"><button class="round" style="width:40px;height:40px" aria-label="Monter ${esc(p.title)}" ${A(() => moveProject(p, -1))}>${ico('arrowUp')}</button><button class="round" style="width:40px;height:40px" aria-label="Descendre ${esc(p.title)}" ${A(() => moveProject(p, 1))}>${ico('arrowDown')}</button></span>` : `<span class="chev">${ico('chevR', 16)}</span>`;
  const card = p => {
    const n = p.steps.length, d = p.steps.filter(s => s.done).length, next = p.steps.find(s => !s.done);
    return `<div class="card pad" role="button" tabindex="0" style="text-align:left;width:100%" ${reorderProjects ? '' : A(() => go('#projet/' + p.id))}>
      <span class="flex" style="gap:12px">${projVisual(p)}<span class="title" style="flex:1">${esc(p.title)}</span>${arrows(p)}</span>
      ${n ? bar(d / n * 100, pColor(p)) : ''}
      <span class="between meta"><span>${n ? `${d} / ${n} étapes` : 'Aucune étape'}</span><span>${p.target ? 'Objectif : ' + fDay(p.target) : ''}</span></span>
      ${next ? `<span class="note">Prochaine étape : ${esc(next.title)}${next.due ? ' · ' + fShort(next.due) : ''}</span>` : ''}</div>`;
  };
  const act = DB.projects.filter(p => p.status === 'active'), pau = DB.projects.filter(p => p.status === 'paused'), don = DB.projects.filter(p => p.status === 'done');
  h += sec('En cours', act.length ? act.map(card).join('') : `<div class="card"><p class="empty">Aucun projet en cours. Crée-en un avec « + ».</p></div>`);
  if (pau.length) h += sec('En pause', list(pau.map(p => `<div class="row"${reorderProjects ? '' : ` role="button" tabindex="0" ${A(() => go('#projet/' + p.id))}`}>${projVisual(p, 34)}<span class="txt"><b>${esc(p.title)}</b><small>${p.steps.filter(s => s.done).length} / ${p.steps.length} étapes</small></span>${reorderProjects ? arrows(p) : pill('en pause')}</div>`).join('')));
  if (don.length) h += sec('Terminés', list(don.map(p => row({ title: p.title, right: pill('terminé', 'ok'), act: () => go('#projet/' + p.id) })).join('')));
  return h;
}
function editStep(p, s) {
  const isNew = !s; s = s || { id: uid(), title: '', due: null, done: false };
  form({ title: isNew ? 'Nouvelle étape' : 'Étape', fields: [{ k: 'title', label: 'Étape', type: 'text', value: s.title, autofocus: isNew }, { k: 'due', label: 'Date (facultatif)', type: 'date', value: s.due, help: "Avec une date, l'étape apparaît sur l'Accueil." }],
    required: ['title'], notify: 'step:' + s.id, onSave: v => { Object.assign(s, v); if (isNew) p.steps.push(s); }, onDelete: isNew ? null : () => { p.steps = p.steps.filter(y => y !== s); } });
}
function pageProjet(id) {
  const p = DB.projects.find(x => x.id === id);
  if (!p) return back('#projets', 'Projets') + `<div class="card"><p class="empty">Projet introuvable.</p></div>`;
  const t = today(), n = p.steps.length, d = p.steps.filter(s => s.done).length;
  let h = back('#projets', 'Projets');
  if (p.photo) h += `<img src="${p.photo}" alt="" style="width:100%;height:150px;object-fit:cover;border-radius:16px">`;
  h += `<div style="display:flex;flex-direction:column;gap:6px"><span>${pill({ active: 'En cours', paused: 'En pause', done: 'Terminé' }[p.status], p.status === 'done' ? 'ok' : '')}</span>
    <div class="head"><div class="flex" style="gap:12px;min-width:0">${p.photo ? '' : projVisual(p, 44)}<h1 style="font-size:26px;color:${pColor(p)}">${esc(p.title)}</h1></div><span class="flex" style="gap:8px;flex:none"><button class="round" aria-label="Apparence du projet" ${A(() => appearanceSheet(p))}>${ico('image')}</button><button class="round" aria-label="Modifier le projet" ${A(() => editProject(p))}>${ico('edit')}</button></span></div>
    ${p.goal ? `<p class="sub" style="font-size:14px;line-height:1.5">${esc(p.goal)}</p>` : ''}</div>`;
  h += `<div class="two"><div class="card pad"><span class="meta">Avancement</span><span class="title" style="font-size:22px">${d} / ${n}</span>${bar(n ? d / n * 100 : 0, pColor(p))}</div>
    <div class="card pad" role="button" tabindex="0" ${A(() => editProject(p))}><span class="meta">Date cible</span><span class="title" style="font-size:18px">${p.target ? esc(fDay(p.target)) : '—'}</span>${p.target ? `<span class="meta">${p.target >= t ? 'dans ' + ago(diff(t, p.target)) : 'dépassée'}</span>` : ''}</div></div>`;
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


/* ============================== Notifications via Rappels ============================== */
/* Toutes les notifications prévues : anniversaires (toujours) + éléments marqués « Me notifier ». */
function notifCandidates() {
  const S = DB.settings, N = S.notify || {}, out = [];
  for (const e of entries()) {
    const sid = sidOf(e.key);
    if (sid.startsWith('bday:') || sid.startsWith('fete:') || !N[sid]) continue;
    out.push({ date: e.date, late: e.kind === 'event' ? e.date : e.late, time: N[sid], title: e.title });
  }
  const bt = S.notifTime || '09:00', before = +S.bdayBefore || 0;
  for (const b of DB.birthdays) {
    const d = nextBirthday(b);
    const gift = b.giftStatus === 'bought' ? ' · cadeau acheté' : b.giftStatus === 'msg' ? '' : b.gift ? ` · cadeau : ${b.gift}` : '';
    out.push({ date: d, late: d, time: bt, title: `Anniversaire de ${b.name}${gift}` });
    if (before > 0) out.push({ date: addDays(d, -before), late: addDays(d, -before), time: bt, title: `Anniversaire de ${b.name} dans ${plural(before, 'jour', 'jours')}${b.giftStatus === 'bought' || b.giftStatus === 'msg' ? '' : ' · cadeau à prévoir'}` });
  }
  for (const f of DB.fetes) {
    const d = nextFete(f); if (!d) continue;
    const gift = f.giftStatus === 'bought' ? ' · cadeau acheté' : f.giftStatus === 'msg' ? '' : f.gift ? ` · cadeau : ${f.gift}` : '';
    out.push({ date: d, late: d, time: bt, title: feteTitle(f) + gift });
    if (before > 0) out.push({ date: addDays(d, -before), late: addDays(d, -before), time: bt, title: `${feteTitle(f)} dans ${plural(before, 'jour', 'jours')}${f.giftStatus === 'bought' || f.giftStatus === 'msg' ? '' : ' · cadeau à prévoir'}` });
  }
  return out.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}
const cleanTitle = t => String(t).replace(/[|\r\n]+/g, ' ').trim();
function notifSignature() { return notifCandidates().map(n => `${n.date} ${n.time}|${cleanTitle(n.title)}`).join('\n'); }
function notifLines() {
  const t = today(), now = new Date(), hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return notifCandidates().filter(n => {
    if (t > n.late) return false;                       // déjà en retard : déjà vu
    const d = n.date < t ? t : n.date;                  // en cours : notifier aujourd'hui
    if (d === t && n.time <= hm) return false;          // heure déjà passée aujourd'hui
    n.when = d; return true;
  }).map(n => `${n.when} ${n.time}|${cleanTitle(n.title)}`);
}
function notifDirty() {
  const S = DB.settings, sig = notifSignature();
  if (!sig && !S.notifSig) return false;
  return sig !== S.notifSig;
}
async function sendToReminders() {
  const S = DB.settings, lines = notifLines(), text = lines.join('\n');
  const url = 'shortcuts://run-shortcut?name=' + encodeURIComponent(S.shortcutName);
  const finish = () => { S.notifSig = notifSignature(); S.notifSent = today(); save(); };
  let copied = false;
  try { await navigator.clipboard.writeText(text || ' '); copied = true; } catch (e) { copied = false; }
  if (!copied) {
    openSheet(() => `${sheetHead('Copier la liste')}<p class="meta" style="margin:0">La copie automatique n'a pas marché. Sélectionne tout le texte ci-dessous, copie-le, puis lance le raccourci « ${esc(S.shortcutName)} ».</p>
      <textarea readonly style="width:100%;min-height:200px;border-radius:12px;border:1px solid var(--line);padding:12px;font-size:13px">${esc(text)}</textarea>
      <a class="btn primary" href="${url}" ${A(() => { finish(); closeSheet(); location.href = url; })}>Lancer le raccourci</a>`);
    return;
  }
  finish(); render();
  toast(`${plural(lines.length, 'notification copiée', 'notifications copiées')}, ouverture de Raccourcis…`);
  location.href = url;
}
function notifPreview() {
  const lines = notifLines();
  openSheet(() => `${sheetHead('Notifications prévues')}
    <p class="meta" style="margin:-6px 0 0">${lines.length ? 'Voici ce qui sera envoyé à l’app Rappels.' : 'Aucune notification prévue pour l’instant.'}</p>
    ${lines.length ? `<div class="card list">${lines.map(l => { const [w, t] = l.split('|'); const [d, h] = w.split(' '); return `<div class="row"><span class="txt"><b>${esc(t)}</b><small>${esc(fLong(d))} à ${esc(h)}</small></span></div>`; }).join('')}</div>` : ''}
    <button class="btn primary" ${A(() => { closeSheet(); sendToReminders(); })}>${ico('bell')}Envoyer vers Rappels</button>`);
}
function pageAideRappels() {
  const S = DB.settings;
  const step = (n, t, d) => `<div class="flex" style="align-items:flex-start;gap:12px"><span style="width:26px;height:26px;border-radius:13px;background:var(--accent);color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;flex:none">${n}</span><div style="flex:1"><b style="font-size:15px">${t}</b>${d ? `<div class="meta" style="font-size:13px;line-height:1.5;margin-top:2px">${d}</div>` : ''}</div></div>`;
  const act = n => `<b style="color:var(--ink)">${esc(n)}</b>`;
  let h = back('#plus', 'Plus') + head('Créer le raccourci', { sub: 'À faire une seule fois, environ 10 minutes. Pour trouver une action, tape les mots en gras dans la recherche des actions.' });
  h += sec('Avant de commencer', `<div class="card pad">
    ${step(1, 'Dans l’app Rappels, crée une liste « Mon quotidien »', 'Toutes les notifications de l’outil iront dans cette liste. N’y mets rien d’autre : elle est vidée à chaque envoi.')}
    ${step(2, `Dans l’app Raccourcis, touche « + » et nomme le raccourci « ${esc(S.shortcutName)} »`, 'Le nom doit être exactement celui-ci (il est modifiable dans Plus › Notifications).')}</div>`);
  h += sec('Les actions, dans l’ordre', `<div class="card pad">
    ${step(3, act('Rechercher des rappels'), 'Ajoute un filtre : Liste · est · Mon quotidien.')}
    ${step(4, act('Supprimer des rappels'), 'Elle prend automatiquement les rappels trouvés juste avant. Elle vide la liste pour éviter les doublons.')}
    ${step(5, act('Obtenir le presse-papiers'), '')}
    ${step(6, act('Diviser le texte'), 'Texte : Presse-papiers · Séparateur : Nouvelles lignes.')}
    ${step(7, act('Répéter avec chaque élément'), 'Sur : Texte divisé. Les actions 8 à 12 se placent à l’intérieur de la répétition.')}
    ${step(8, act('Diviser le texte'), 'Texte : Élément répété · Séparateur : Personnalisé, tape une barre verticale « | ».')}
    ${step(9, act('Obtenir l’élément de la liste'), 'Obtenir : Premier élément · de : Texte divisé (celui de l’action 8). C’est la date et l’heure.')}
    ${step(10, act('Date'), 'Choisis « Date spécifiée » et mets la variable Élément de la liste (action 9).')}
    ${step(11, act('Obtenir l’élément de la liste'), 'Obtenir : Dernier élément · de : Texte divisé (action 8). C’est le titre.')}
    ${step(12, act('Ajouter un nouveau rappel'), 'Titre : Élément de la liste (action 11) · Liste : Mon quotidien · active « Me rappeler » / l’alerte et choisis la variable Date (action 10).')}
    ${step(13, 'Termine le raccourci', 'Optionnel : ajoute après la répétition ' + act('Afficher une notification') + ' avec le texte « Rappels à jour ».')}</div>`);
  h += sec('Premier essai', `<div class="card pad">
    ${step(14, 'Reviens ici et touche « Envoyer vers Rappels »', 'L’outil copie la liste puis lance le raccourci.')}
    ${step(15, 'Accepte les autorisations', 'Accès à Rappels, et collage depuis Mon quotidien : choisis « Toujours autoriser » si on te le propose. À chaque envoi, confirme la suppression des anciens rappels.')}
    ${step(16, 'Vérifie la liste « Mon quotidien » dans Rappels', 'Chaque rappel doit avoir sa date et son heure. Les notifications arrivent comme pour n’importe quel rappel.')}
    ${step(17, 'Ensuite, c’est automatique', 'Après ce premier envoi, l’outil renvoie la liste tout seul quand tu actives « Me notifier » ou modifies un anniversaire. Pour le reste (une corvée cochée, une date reportée…), un bandeau te propose de mettre à jour.')}</div>
    <button class="btn" ${A(notifPreview)}>Voir ce qui sera envoyé</button>`);
  h += `<p class="hint">Format envoyé, une ligne par notification : « 2026-12-02 09:00|Pharmacie ». Si une notification n’a pas la bonne heure, vérifie l’action 10.</p>`;
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
  const nCount = notifLines().length;
  h += sec('Notifications', `<div class="card pad">
    <div class="flex" style="align-items:flex-start"><span class="ic" style="background:var(--accent-bg);color:var(--accent)">${ico('bell')}</span><div style="flex:1"><div style="font-weight:500">${plural(nCount, 'notification prévue', 'notifications prévues')}</div>
    <div class="meta" style="font-size:13px;line-height:1.5">Les anniversaires, les fêtes, et ce que tu as marqué « Me notifier ». Elles passent par l’app Rappels.${S.notifSent ? ' Dernier envoi le ' + fDay(S.notifSent) + '.' : ''}</div></div></div>
    <button class="btn primary" ${A(sendToReminders)}>${ico('bell')}Envoyer vers Rappels</button>
    <div class="btns"><button class="btn sm" ${A(notifPreview)}>Voir la liste</button><a class="btn sm" href="#aide-rappels">Créer le raccourci</a></div></div>`
    + list(
      row({ title: 'Heure par défaut', right: `<span class="tag">${esc(S.notifTime)}</span>`, act: () => form({ title: 'Heure par défaut', fields: [{ k: 'notifTime', label: 'Heure des notifications', type: 'time', value: S.notifTime, help: 'Utilisée pour les anniversaires et comme heure proposée.' }], required: ['notifTime'], onSave: v => { S.notifTime = v.notifTime; } }) }) +
      row({ title: 'Anniversaires et fêtes', right: `<span class="tag">${+S.bdayBefore ? `le jour J et ${S.bdayBefore} j avant` : 'le jour J'}</span>`, act: () => form({ title: 'Anniversaires', fields: [{ k: 'bdayBefore', label: 'Me prévenir aussi avant', type: 'seg', value: String(S.bdayBefore || 0), options: [['0', 'Non'], ['1', '1 j'], ['3', '3 j'], ['7', '7 j'], ['14', '14 j']] }], onSave: v => { S.bdayBefore = +v.bdayBefore || 0; } }) }) +
      row({ title: 'Envoi automatique', sub: esc('Quand tu actives une notification ou modifies un anniversaire'), right: `<span class="tag">${S.autoSend === false ? 'non' : 'oui'}</span>`, act: () => form({ title: 'Envoi automatique', fields: [{ k: 'autoSend', label: 'Envoyer vers Rappels automatiquement', type: 'seg', value: S.autoSend === false ? 'non' : 'oui', options: [['oui', 'Oui'], ['non', 'Non']], help: 'L’envoi ouvre l’app Raccourcis quelques secondes, puis tu reviens ici. Les autres changements se mettent à jour avec le bouton « Envoyer ».' }], onSave: v => { S.autoSend = v.autoSend !== 'non'; } }) }) +
      row({ title: 'Nom du raccourci', right: `<span class="tag">${esc(S.shortcutName)}</span>`, act: () => form({ title: 'Nom du raccourci', fields: [{ k: 'shortcutName', label: 'Nom exact du raccourci dans l’app Raccourcis', type: 'text', value: S.shortcutName }], required: ['shortcutName'], onSave: v => { S.shortcutName = v.shortcutName; } }) })
    ));
  h += sec('Réglages', list(
    row({ title: '« Dans les X jours » sur l’Accueil', right: `<span class="tag">${S.soonDays} jours</span>`, act: () => form({ title: 'Horizon de l’Accueil', fields: [{ k: 'soonDays', label: 'Afficher ce qui arrive dans les', type: 'seg', value: String(S.soonDays), options: [['14', '14 j'], ['30', '30 j'], ['45', '45 j'], ['60', '60 j']] }], onSave: v => { S.soonDays = +v.soonDays || 30; } }) }) +
    row({ title: 'Rappel de sauvegarde', right: `<span class="tag">tous les ${S.backupEveryDays} jours</span>`, act: () => form({ title: 'Rappel de sauvegarde', fields: [{ k: 'backupEveryDays', label: 'Me le rappeler tous les', type: 'seg', value: String(S.backupEveryDays), options: [['7', '7 j'], ['14', '14 j'], ['30', '30 j']] }], onSave: v => { S.backupEveryDays = +v.backupEveryDays || 7; } }) }) +
    row({ title: 'Effacer toutes les données', sub: 'Pour repartir de zéro', act: () => { if (confirm('Effacer toutes les données de cet iPhone ? Fais une sauvegarde avant.') && confirm('Vraiment tout effacer ?')) { DB = seed(); commit('Données effacées'); go('#accueil'); } } })
  ));
  h += `<p class="hint">Mon quotidien · version 1.1</p>`;
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
  const isNew = !c; c = c || { id: uid(), title: '', mode: 'interval', min: 1, max: 1, unit: 'weeks', weekday: null, lastDone: today(), freq: 'month', every: 1, dom: 1, fweekday: 1, md: null };
  const WD = [['1', 'lundi'], ['2', 'mardi'], ['3', 'mercredi'], ['4', 'jeudi'], ['5', 'vendredi'], ['6', 'samedi'], ['0', 'dimanche']];
  form({ title: isNew ? 'Nouvelle corvée' : c.title, fields: [
    { k: 'title', label: 'Nom', type: 'text', value: c.title, autofocus: isNew },
    { k: 'mode', label: 'Se répète', type: 'seg', value: c.mode || 'interval', options: [['interval', 'Depuis la dernière fois'], ['fixed', 'À date fixe']] },
    { k: 'min', label: 'Tous les… (au plus tôt)', type: 'number', value: c.min, min: 1, when: 'mode=interval' },
    { k: 'max', label: '…ou au plus tard (laisser pareil si fixe)', type: 'number', value: c.max, min: 1, help: 'Ex. lessive : 1 et 2 → entre 1 et 2 semaines.', when: 'mode=interval' },
    { k: 'unit', label: 'Unité', type: 'seg', value: c.unit || 'weeks', options: [['days', 'jours'], ['weeks', 'semaines'], ['months', 'mois']], when: 'mode=interval' },
    { k: 'weekday', label: 'Jour habituel', type: 'select', value: c.weekday ?? '', options: [['', 'Aucun'], ...WD], when: 'mode=interval' },
    { k: 'freq', label: 'Chaque', type: 'seg', value: c.freq || 'month', options: [['month', 'mois'], ['week', 'semaine'], ['year', 'année']], when: 'mode=fixed' },
    { k: 'dom', label: 'Le jour du mois', type: 'number', value: c.dom ?? 1, min: 1, help: '1 pour le 1er du mois, 31 pour le dernier jour du mois.', when: 'mode=fixed&freq=month' },
    { k: 'fweekday', label: 'Le', type: 'select', value: c.fweekday ?? 1, options: WD, when: 'mode=fixed&freq=week' },
    { k: 'every', label: 'Tous les combien (1 = à chaque fois)', type: 'number', value: c.every ?? 1, min: 1, help: 'Ex. 2 avec « mois » : un mois sur deux.', when: 'mode=fixed&freq=month|week' },
    { k: 'anchor', label: 'À partir du', type: 'date', value: c.anchor || today(), help: 'Sert pour « un mois sur deux » ou « un lundi sur deux » : la première fois tombe à partir de cette date.', when: 'mode=fixed&freq=month|week' },
    { k: 'ydate', label: 'Date', type: 'date', value: c.md ? `${today().slice(0, 4)}-${c.md}` : null, help: 'Seuls le jour et le mois comptent.', when: 'mode=fixed&freq=year' },
    { k: 'lastDone', label: 'Dernière fois (facultatif pour une date fixe)', type: 'date', value: c.lastDone },
  ], required: ['title'], onSave: v => {
    const fixed = v.mode === 'fixed';
    if (!fixed && !v.min) { toast('Indique tous les combien'); return false; }
    if (fixed && v.freq === 'year' && !v.ydate) { toast('Choisis la date'); return false; }
    v.max = Math.max(v.max || v.min || 1, v.min || 1); v.weekday = v.weekday === null || v.weekday === '' ? null : +v.weekday;
    v.fweekday = v.fweekday == null ? 1 : +v.fweekday; v.dom = Math.min(Math.max(+v.dom || 1, 1), 31); v.every = Math.max(1, +v.every || 1);
    v.md = v.ydate ? v.ydate.slice(5) : c.md || null; delete v.ydate;
    if (!v.anchor) v.anchor = c.anchor || today();
    if (fixed && isNew && v.lastDone === today()) v.lastDone = null;   // date par défaut non modifiée : rien de fait encore
    Object.assign(c, v); if (isNew) DB.chores.push(c);
  }, notify: 'chore:' + c.id,
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
  h += `<p class="hint">Rythme « depuis la dernière fois » : la date suivante part du jour où tu coches. Rythme « à date fixe » (le 1er du mois, chaque lundi…) : la date ne bouge pas. Une corvée non faite passe dans « En retard », ici et sur l'Accueil.</p>`;
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
    { k: 'date', label: 'Date de naissance', type: 'date', value: b.md ? `${b.year || y}-${b.md}` : null, help: "L'année sert seulement à afficher l'âge. Les anniversaires sont toujours notifiés." },
    { k: 'knowYear', label: "Je connais l'année de naissance", type: 'check', value: !!b.year },
    { k: 'gift', label: 'Cadeau', type: 'text', value: b.gift },
    { k: 'giftStatus', label: 'Où en est le cadeau', type: 'select', value: b.giftStatus, options: GIFT_ST },
  ], required: ['name', 'date'], autoSend: true, onSave: v => { b.name = v.name; b.md = v.date.slice(5); b.year = v.knowYear ? +v.date.slice(0, 4) : null; b.gift = v.gift || ''; b.giftStatus = v.giftStatus; if (isNew) DB.birthdays.push(b); },
  onDelete: isNew ? null : () => { DB.birthdays = DB.birthdays.filter(x => x !== b); } });
}
/* ---- fêtes : prénoms, fêtes des mères / pères / grands-parents, dates fixes ---- */
const FETE_KINDS = [['prenom', "Fête d'un prénom"], ['meres', 'Fête des mères'], ['peres', 'Fête des pères'], ['gmeres', 'Fête des grands-mères'], ['gperes', 'Fête des grands-pères'], ['date', 'Autre (date fixe)']];
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${pad(month)}-${pad(day)}`;
}
function nthSunday(y, month, n) { const d = new Date(y, month - 1, 1); while (d.getDay() !== 0) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return iso(d); }
function lastSunday(y, month) { const d = new Date(y, month, 0); while (d.getDay() !== 0) d.setDate(d.getDate() - 1); return iso(d); }
function feteDate(f, y) {
  switch (f.kind) {
    case 'meres': { const d = lastSunday(y, 5); return d === addDays(easter(y), 49) ? nthSunday(y, 6, 1) : d; }
    case 'peres': return nthSunday(y, 6, 3);
    case 'gmeres': return nthSunday(y, 3, 1);
    case 'gperes': return nthSunday(y, 10, 1);
    default: return f.md ? `${y}-${f.md}` : null;
  }
}
function nextFete(f) { const t = today(), y = +t.slice(0, 4); const d = feteDate(f, y); if (!d) return null; return d >= t ? d : feteDate(f, y + 1); }
function feteTitle(f) {
  const base = f.kind === 'prenom' ? `Fête de ${f.name || '?'}` : f.kind === 'date' ? (f.name || 'Fête') : FETE_KINDS.find(k => k[0] === f.kind)[1];
  return base + (f.person && f.kind !== 'prenom' ? ` · ${f.person}` : '');
}
function editFete(f) {
  const isNew = !f; f = f || { id: uid(), kind: 'prenom', name: '', md: null, person: '', gift: '', giftStatus: 'none' };
  const y = today().slice(0, 4);
  form({ title: isNew ? 'Nouvelle fête' : feteTitle(f), fields: [
    { k: 'kind', label: 'Quelle fête', type: 'select', value: f.kind, options: FETE_KINDS },
    { k: 'name', label: 'Prénom (ou nom de la fête)', type: 'text', value: f.name, placeholder: 'Ex. Léa, ou Saint-Valentin', help: 'Pour une fête de prénom ou une autre date fixe.' },
    { k: 'date', label: 'Date', type: 'date', value: f.md ? `${y}-${f.md}` : null, help: 'Seulement pour une fête de prénom ou une date fixe : le jour et le mois comptent. Les fêtes des mères, pères et grands-parents sont calculées toutes seules.' },
    { k: 'person', label: 'Pour qui (facultatif)', type: 'text', value: f.person, placeholder: 'Ex. Maman' },
    { k: 'gift', label: 'Cadeau', type: 'text', value: f.gift },
    { k: 'giftStatus', label: 'Où en est le cadeau', type: 'select', value: f.giftStatus, options: GIFT_ST },
  ], required: ['kind'], autoSend: true, onSave: v => {
    if ((v.kind === 'prenom' || v.kind === 'date') && !v.date) { toast('Choisis la date de la fête'); return false; }
    if ((v.kind === 'prenom' || v.kind === 'date') && !v.name) { toast(v.kind === 'prenom' ? 'Indique le prénom' : 'Indique le nom de la fête'); return false; }
    f.kind = v.kind; f.name = v.name || ''; f.md = v.date ? v.date.slice(5) : null; f.person = v.person || ''; f.gift = v.gift || ''; f.giftStatus = v.giftStatus;
    if (isNew) DB.fetes.push(f);
  }, onDelete: isNew ? null : () => { DB.fetes = DB.fetes.filter(x => x !== f); } });
}
function editGiftList(g) {
  const isNew = !g; g = g || { id: uid(), title: 'Noël ' + today().slice(0, 4), date: `${today().slice(0, 4)}-12-25`, items: [] };
  form({ title: isNew ? 'Nouvelle liste de cadeaux' : g.title, fields: [{ k: 'title', label: 'Nom', type: 'text', value: g.title }, { k: 'date', label: 'Date', type: 'date', value: g.date, help: "Les cadeaux manquants apparaissent sur l'Accueil 30 jours avant." }],
    required: ['title'], notify: 'glist:' + g.id, onSave: v => { Object.assign(g, v); if (isNew) DB.giftLists.push(g); }, onDelete: isNew ? null : () => { DB.giftLists = DB.giftLists.filter(x => x !== g); } });
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
  const fs = DB.fetes.map(f => ({ f, d: nextFete(f) })).filter(x => x.d).sort((a, b) => a.d.localeCompare(b.d));
  h += sec('Fêtes', (fs.length ? list(fs.map(({ f, d }) => {
    const n = diff(t, d);
    return `<div class="row" role="button" tabindex="0" ${A(() => editFete(f))}><span style="width:42px;text-align:center;flex:none"><b style="display:block;font-size:20px">${+d.slice(8)}</b><small class="meta">${esc(fmt(d, { month: 'short' }))}</small></span>
      <span class="txt"><b>${esc(feteTitle(f))}</b><small>${esc(f.gift || '')}${f.gift && f.giftStatus !== 'none' ? ' · ' : ''}${f.giftStatus === 'none' && !f.gift ? '' : giftPill(f.giftStatus).replace(/<[^>]+>/g, '')}</small></span>
      ${n <= 30 ? pill(n === 0 ? "aujourd'hui" : `dans ${n} j`, n <= 7 ? 'soon' : '') : ''}</div>`;
  }).join('')) : `<div class="card"><p class="empty">Aucune fête. Ajoute une fête de prénom, la fête des mères…</p></div>`) + `<button class="link" ${A(() => editFete(null))}>+ Ajouter une fête</button>`);
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
    { k: 'expires', label: "Date d'expiration", type: 'date', value: v.expires, help: "Apparaît sur l'Accueil 3 mois avant." },
    { k: 'note', label: 'Note', type: 'text', value: v.note, placeholder: 'Offert par…, en boutique uniquement…' },
    { k: 'used', label: 'Entièrement utilisé', type: 'check', value: v.used },
  ], required: ['name'], notify: 'voucher:' + v.id, onSave: x => { Object.assign(v, x); if (isNew) DB.vouchers.push(v); }, onDelete: isNew ? null : () => { DB.vouchers = DB.vouchers.filter(y => y !== v); } });
}
function pageBons() {
  const t = today();
  const act = DB.vouchers.filter(v => !v.used).sort((a, b) => (a.expires || '9').localeCompare(b.expires || '9'));
  const used = DB.vouchers.filter(v => v.used);
  const total = act.reduce((s, v) => s + (parseFloat(String(v.value).replace(',', '.')) || 0), 0);
  let h = back('#plus', 'Plus') + head('Bons cadeaux', { color: RUB.bons.fg, add: () => editVoucher(null), addLabel: 'Ajouter un bon', sub: `${total ? Math.round(total) + ' € à utiliser · ' : ''}triés par date d'expiration` });
  h += act.length ? act.map(v => {
    const soon = v.expires && diff(t, v.expires) <= 90;
    return `<div class="card pad${soon ? ' late' : ''}"><div class="between"><div role="button" tabindex="0" ${A(() => editVoucher(v))}><div class="title">${esc(v.name)}</div>${v.note ? `<div class="meta">${esc(v.note)}</div>` : ''}</div><span class="title" style="font-size:19px">${esc(v.value || '')}</span></div>
      ${v.expires ? `<div class="warn ${soon ? 'late' : ''}" style="${soon ? '' : 'background:#FAF9F7;color:var(--ink2)'}">${ico('clock', 16)}<span>Expire le ${fDay(v.expires)}${v.expires >= t ? `, dans ${ago(diff(t, v.expires))}` : ' (expiré)'}</span></div>` : ''}
      ${v.code ? `<div class="note between" style="align-items:center"><span class="meta">Code</span><span style="font-family:ui-monospace,monospace;letter-spacing:.06em">${shownCodes.has(v.id) ? esc(v.code) : '•••• ' + esc(v.code.slice(-4))}</span><button class="btn sm" ${A(() => { shownCodes.has(v.id) ? shownCodes.delete(v.id) : shownCodes.add(v.id); render(); })}>${shownCodes.has(v.id) ? 'Masquer' : 'Afficher'}</button></div>` : ''}
      <div class="btns"><button class="btn sm" ${A(() => form({ title: 'Utilisé en partie', fields: [{ k: 'value', label: 'Valeur restante', type: 'text', value: v.value }], onSave: x => { v.value = x.value || ''; } }))}>Utilisé en partie</button>
      <button class="btn sm ok" ${A(() => { v.used = true; commit('Bon utilisé'); })}>Entièrement utilisé</button></div></div>`;
  }).join('') : `<div class="card"><p class="empty">Aucun bon à utiliser.</p></div>`;
  h += `<p class="hint">Chaque bon apparaît sur l'Accueil 3 mois avant son expiration. Les bons de voyage sont dans Voyages.</p>`;
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
  ], required: ['title'], onSave: v => { if (!isNew && v.state !== p.state) p.log.push({ date: today(), text: { me: 'À moi d’agir', wait: 'En attente d’une réponse', done: 'Réglé' }[v.state] }); Object.assign(p, v); if (isNew) DB.problems.push(p); }, notify: 'pb:' + p.id,
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
/* ============================== Activité (ma semaine active) ============================== */
const AC = { end: '#D4483F', ren: '#2B50D6', sou: '#8E3AA8', well: '#1A7AA3', int: '#C25400', sta: '#6A6A72' };
const ARG = { jamb: 'Jambes · fessiers', tronc: 'Tronc', haut: 'Haut du corps' };
const ASZ = { dos: 'Dos', nuque: 'Nuque-épaules', hanches: 'Hanches', jambes: 'Jambes', artic: 'Articulations' };
const ABE = { resp: 'Respiration', medit: 'Méditation', nidra: 'Yoga nidra', son: 'Bain sonore', massage: 'Auto-massage', lymph: 'Drainage lymphatique' };
const AIT = { escaliers: 'Escaliers vifs', fraction: 'Marche fractionnée', cote: 'Côte', course: 'Course, vélo', autre: 'Autre soutenue' };
const AP = {
  trajet: { g: 'Endurance', l: 'Trajets à pied', s: '2 × 15 min rapide', mod: 30, c: 'end' },
  marche: { g: 'Endurance', l: 'Marche rapide', s: '30 min', mod: 30, c: 'end' },
  escaliers: { g: 'Intense', l: 'Escaliers vifs', s: '3 à 5 étages · 1 min', sout: 1, burst: 1, c: 'int' },
  fraction: { g: 'Intense', l: 'Marche fractionnée', s: 'minutes rapides', c: 'int', pick: 'm' },
  cote: { g: 'Intense', l: 'Côte, montée', s: 'à bon rythme', c: 'int', pick: 'm' },
  course: { g: 'Intense', l: 'Course, vélo rapide', s: 'séance', c: 'int', pick: 'm' },
  pilates: { g: 'Renfo', l: 'Pilates', s: 'renfo + souplesse', ren: 1, sou: 1, c: 'ren', pick: 'g', def: ['jamb', 'tronc'] },
  yogadyn: { g: 'Renfo', l: 'Yoga dynamique', s: 'renfo + souplesse', ren: 1, sou: 1, c: 'ren', pick: 'g', def: ['jamb', 'tronc', 'haut'] },
  renfo: { g: 'Renfo', l: 'Renfo maison', s: 'poids du corps, élastique', ren: 1, c: 'ren', pick: 'g', def: [] },
  yoga: { g: 'Souplesse', l: 'Yoga / étirements', s: 'séance générale', sou: 1, c: 'sou' },
  cible: { g: 'Souplesse', l: 'Étirements ciblés', s: 'dos, hanches…', sou: 1, c: 'sou', pick: 'z', def: [] },
  calme: { g: 'Bien-être', l: 'Respiration, méditation…', s: 'nidra, lymphatique…', c: 'well', pick: 'b' },
  debout: { g: 'Moins assise', l: 'Bureau debout', s: '1 h', sta: 60, c: 'sta' },
  yogadoux: { hide: 1, l: 'Yoga doux', sou: 1, c: 'sou' },
};
const APICKQ = { g: 'Quels groupes musculaires ?', z: 'Quelles zones étirées ?', b: 'Quelle pratique ?', m: 'Combien de minutes vraiment intenses ?' };
const AMIN = {}; for (const n of [1, 2, 3, 5, 10, 15, 20, 30, 45]) AMIN[n] = n + ' min';
const ADAY = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], AD1 = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const AOTHER = { mod: 'Endurance modérée', sout: 'Endurance soutenue', ren: 'Renforcement', sou: 'Souplesse' };
const ARX = /^w\d{4}-\d\d-\d\d$/;
const mondayOf = s => addDays(s, -((parse(s).getDay() + 6) % 7));
const dayIdx = s => (parse(s).getDay() + 6) % 7;
const pl = (n, w) => n + ' ' + w + (n > 1 ? 's' : '');
const wks = n => pl(n, 'semaine');
const nfr = (n, d = 1) => n.toLocaleString('fr-FR', { maximumFractionDigits: d });
let actCur = null, actSel = 0;
const actOpen = new Set();

const aOnly = (a, dict) => Array.isArray(a) ? [...new Set(a.filter(x => typeof x === 'string' && dict[x]))] : [];
function aClean(a) {
  if (!Array.isArray(a)) return [];
  const out = [];
  for (const e of a.slice(0, 300)) {
    if (!e || typeof e !== 'object') continue;
    const d = Number(e.d); if (!Number.isInteger(d) || d < 0 || d > 6) continue;
    if (AP[e.k]) {
      const o = { d, k: e.k }, p = AP[e.k].pick;
      if (p === 'g') o.gr = aOnly(e.gr, ARG);
      if (p === 'z') o.z = aOnly(e.z, ASZ);
      if (p === 'b') { if (!ABE[e.b]) continue; o.b = e.b; }
      if (p === 'm') { const m = Math.round(Number(e.m)); if (!(m >= 1 && m <= 180)) continue; o.m = m; }
      out.push(o);
    } else if (e.k === 'autre' && AOTHER[e.t]) {
      out.push({ d, k: 'autre', t: e.t, m: Math.max(0, Math.min(600, Math.round(Number(e.m) || 0))) });
    }
  }
  return out;
}
const aGroups = e => e.gr && e.gr.length ? e.gr : (AP[e.k] && AP[e.k].def) || [];
function aContrib(e) {
  if (AP[e.k] && AP[e.k].pick === 'm') return { sout: e.m };
  if (AP[e.k]) return AP[e.k];
  if (e.t === 'mod') return { mod: e.m }; if (e.t === 'sout') return { sout: e.m }; if (e.t === 'ren') return { ren: 1 }; return { sou: 1 };
}
function aLabel(e) {
  if (e.k === 'autre') return AOTHER[e.t] + (e.m ? ' ' + e.m + ' min' : '');
  if (e.k === 'calme') return ABE[e.b] || 'Bien-être';
  if (AP[e.k].pick === 'm') return AP[e.k].l + ' ' + e.m + ' min';
  return AP[e.k].l;
}
function aDetail(e) {
  if (AP[e.k] && AP[e.k].pick === 'g') { const g = aGroups(e); return g.map(x => ARG[x].split(' ')[0].toLowerCase()).join(', '); }
  if (e.k === 'cible') return (e.z || []).map(x => ASZ[x].toLowerCase()).join(', ');
  return '';
}
const aColor = e => AC[e.k === 'autre' ? { mod: 'end', sout: 'int', ren: 'ren', sou: 'sou' }[e.t] : AP[e.k].c];
function aTotals(es) {
  const t = { mod: 0, sout: 0, ren: 0, sou: 0, sta: 0, burst: 0, gen: 0 };
  const rd = new Set(), wd = new Set(), idd = new Set(), it = new Set(), wt = new Set(), gd = { jamb: new Set(), tronc: new Set(), haut: new Set() }, zc = {};
  for (const k in ASZ) zc[k] = 0;
  for (const e of es) {
    const c = aContrib(e);
    for (const k of ['mod', 'sout', 'ren', 'sou', 'sta', 'burst']) t[k] += c[k] || 0;
    if (c.ren) { rd.add(e.d); for (const g of aGroups(e)) gd[g].add(e.d); }
    if (e.k === 'cible') for (const z of e.z || []) zc[z]++;
    if (c.sou && e.k !== 'cible') t.gen++;
    if (e.k === 'calme') { wd.add(e.d); wt.add(e.b); }
    if (c.sout > 0) { idd.add(e.d); it.add(AIT[e.k] ? e.k : 'autre'); }
  }
  t.eq = t.mod + 2 * t.sout;
  const r = [...rd].sort((a, b) => a - b); t.spaced = r.some((a, i) => r.slice(i + 1).some(b => b - a >= 2));
  t.renDays = rd.size; t.gd = {}; for (const g in gd) t.gd[g] = gd[g].size;
  t.zc = zc; t.wellDays = wd.size; t.wt = wt; t.intDays = idd.size; t.it = it;
  t.missing = Object.keys(ARG).filter(g => t.gd[g] < 2);
  return t;
}
const aEntries = k => (DB.activity.weeks[k] && DB.activity.weeks[k].entries) || [];
function aAgg(endMon) {
  const ws = [];
  for (let n = 0; n < 4; n++) { const es = aEntries('w' + addDays(endMon, -7 * n)); if (es.length) ws.push(aTotals(es)); }
  const T = ws.length, c = f => ws.filter(f).length, sum = f => ws.reduce((x, t) => x + f(t), 0);
  const a = { T, end: c(t => t.eq >= 150), endAvg: T ? Math.round(sum(t => t.eq) / T) : 0, ren: c(t => t.missing.length === 0), sou: c(t => t.sou >= 2),
    well: c(t => t.wellDays >= 5), int: c(t => t.intDays >= 3), soutAvg: T ? Math.round(sum(t => t.sout) / T) : 0, wellAvg: T ? sum(t => t.wellDays) / T : 0,
    sta: sum(t => t.sta), gen: sum(t => t.gen), g: {}, z: {}, w: {}, i: {} };
  for (const g in ARG) a.g[g] = c(t => t.gd[g] >= 2);
  for (const z in ASZ) a.z[z] = c(t => t.zc[z] > 0);
  for (const b in ABE) a.w[b] = c(t => t.wt.has(b));
  for (const k in AIT) a.i[k] = c(t => t.it.has(k));
  const low = n => T >= 2 && n * 2 < T;
  a.warn = { obj: { end: low(a.end), ren: low(a.ren), sou: low(a.sou), well: low(a.well), int: low(a.int) }, g: {}, z: {} };
  for (const g in ARG) a.warn.g[g] = low(a.g[g]);
  for (const z in ASZ) a.warn.z[z] = low(a.z[z]);
  return a;
}

function aSetWeek(k, es) { if (es.length) DB.activity.weeks[k] = { entries: es }; else delete DB.activity.weeks[k]; }
function actChange(fn, msg) {
  const k = 'w' + actCur, prev = aEntries(k).slice(), es = prev.slice();
  fn(es); aSetWeek(k, es); save(); render();
  toastUndo(msg, () => { aSetWeek(k, prev); save(); render(); toast('Annulé'); });
}
function actAdd(k, extra) {
  const e = Object.assign({ d: actSel, k }, extra || {});
  actChange(es => es.push(e), aLabel(e) + ' · ' + ADAY[actSel]);
}
const actDayLong = () => fmt(addDays(actCur, actSel), { weekday: 'long', day: 'numeric', month: 'long' });

function actPreset(k) {
  const p = AP[k];
  if (!p.pick) { actAdd(k); return; }
  const title = `${p.l} · ${actDayLong()}`;
  if (p.pick === 'g' || p.pick === 'z') {
    const dict = p.pick === 'g' ? ARG : ASZ, col = p.pick === 'g' ? AC.ren : AC.sou;
    const root = openSheet(() => `${sheetHead(title)}<div class="field"><span class="lbl">${APICKQ[p.pick]}</span>
      <div class="chips" style="--c:${col}">${Object.keys(dict).map(x => `<label><input type="checkbox" name="pk" value="${x}"${(p.def || []).includes(x) ? ' checked' : ''}><span>${esc(dict[x])}</span></label>`).join('')}</div></div>
      <p class="err" hidden></p><div class="btns"><button class="btn primary" data-ok="1">Ajouter</button></div>`);
    root.querySelector('[data-ok]').addEventListener('click', () => {
      const v = [...root.querySelectorAll('input[name=pk]:checked')].map(i => i.value);
      if (!v.length) { const er = root.querySelector('.err'); er.hidden = false; er.textContent = p.pick === 'g' ? 'Choisis au moins un groupe.' : 'Choisis au moins une zone.'; return; }
      closeSheet(); actAdd(k, p.pick === 'g' ? { gr: v } : { z: v });
    });
    return;
  }
  const dict = p.pick === 'b' ? ABE : AMIN, col = p.pick === 'b' ? AC.well : AC.int;
  openSheet(() => `${sheetHead(title)}<div class="field"><span class="lbl">${APICKQ[p.pick]}</span>
    <div class="apick" style="--c:${col}">${Object.keys(dict).map(x => `<button class="btn" ${A(() => { closeSheet(); actAdd(k, p.pick === 'b' ? { b: x } : { m: +x }); })}>${esc(dict[x])}</button>`).join('')}</div>
    ${p.pick === 'm' ? '<span class="help">Note seulement les minutes vraiment intenses : tu ne dis que quelques mots sans reprendre ton souffle.</span>' : ''}</div>`);
}
function actOther() {
  form({ title: `Autre activité · ${actDayLong()}`, submit: 'Ajouter',
    fields: [{ k: 't', label: 'Type', type: 'seg', value: 'mod', options: [['mod', 'Modérée'], ['sout', 'Soutenue'], ['ren', 'Renfo'], ['sou', 'Souplesse']] },
      { k: 'm', label: 'Durée en minutes', type: 'number', min: 1, step: 5, when: 't=mod|sout', help: '1 min soutenue compte comme 2 min modérées.' }],
    onSave: v => {
      const t = v.t || 'mod', m = Math.max(0, Math.min(600, Math.round(v.m || 0)));
      if ((t === 'mod' || t === 'sout') && !m) { toast('Indique la durée en minutes'); return false; }
      setTimeout(() => actAdd('autre', { t, m: t === 'mod' || t === 'sout' ? m : 0 }), 0);
    } });
}
function actImport() {
  form({ title: 'Importer des semaines', submit: 'Importer',
    fields: [{ k: 'json', label: 'Données à importer', type: 'textarea', placeholder: '{"w2026-11-16":{"entries":[…]}}', help: 'Colle ici les semaines copiées depuis « Ma semaine active ». Une semaine déjà présente est remplacée.' }],
    required: ['json'],
    onSave: v => {
      let d; try { d = JSON.parse(v.json); } catch (e) { toast('Texte illisible : vérifie le copier-coller'); return false; }
      if (Array.isArray(d)) { const o = {}; for (const x of d) if (x && x.id) o[x.id] = x.data || x; d = o; }
      let n = 0;
      for (const k in d || {}) {
        if (!ARX.test(k)) continue;
        const es = aClean(Array.isArray(d[k]) ? d[k] : d[k] && d[k].entries);
        if (es.length) { DB.activity.weeks[k] = { entries: es }; n++; }
      }
      if (!n) { toast('Aucune semaine trouvée dans ce texte'); return false; }
      setTimeout(() => toast(pl(n, 'semaine') + ' importée' + (n > 1 ? 's' : '')), 50);
    } });
}

function actObj(id, name, mid, val, unit, done, warn, now, pills, info) {
  const C = AC[id];
  return `<details class="aobj" data-obj="${id}"${actOpen.has(id) ? ' open' : ''}><summary>
    <i class="adot" style="background:${C}"></i><span class="nm${warn ? ' warn' : ''}">${name}</span>${mid}
    <span class="v${done ? ' done' : ''}">${val}<small>${unit}</small></span><span class="chev">${ico('chevR', 16)}</span>
    ${pills ? `<span class="zc">${pills}</span>` : ''}</summary>
    <div class="more"><p class="now">${now}</p><ul>${info.map(x => `<li>${x}</li>`).join('')}</ul></div></details>`;
}
const aPill = (txt, c, cls, n) => `<span class="z ${cls}" style="--c:${c}">${esc(txt)}${n ? `<b>${n}</b>` : ''}</span>`;

function pageActivite() {
  const thisMon = mondayOf(today());
  if (!actCur || actCur > thisMon) { actCur = thisMon; actSel = dayIdx(today()); }
  const isNow = actCur === thisMon, es = aEntries('w' + actCur), t = aTotals(es), a = aAgg(actCur), W = a.warn;
  const view = DB.activity.view === 'month' ? 'month' : 'week';
  const go7 = n => { actCur = addDays(actCur, 7 * n); actSel = actCur === mondayOf(today()) ? dayIdx(today()) : 0; render(); };
  const range = (isNow ? 'Cette semaine · ' : '') + fDay(actCur) + ' – ' + fDay(addDays(actCur, 6));
  let h = `<div class="head"><div><h1 style="color:${RUB.activite.fg}">Activité</h1><p class="sub">${esc(range)}</p></div>
    <div class="flex" style="gap:6px"><button class="round" aria-label="Semaine précédente" ${A(() => go7(-1))}>${ico('chevL', 20)}</button>
    <button class="round" aria-label="Semaine suivante"${isNow ? ' disabled' : ''} ${A(() => { if (!isNow) go7(1); })}>${ico('chevR', 20)}</button></div></div>`;
  if (!isNow) h += `<button class="link" style="margin:-14px 0 -8px" ${A(() => { actCur = null; render(); })}>Revenir à cette semaine</button>`;

  /* --- résumé --- */
  const setView = v => { DB.activity.view = v; save(); render(); };
  let s = `<div class="seg" role="group" aria-label="Période"><button aria-pressed="${view === 'week'}" ${A(() => setView('week'))}>Cette semaine</button><button aria-pressed="${view === 'month'}" ${A(() => setView('month'))}>4 dernières semaines</button></div>`;
  if (a.T < 2) s += `<p class="hint">Le bilan de ce qui est souvent oublié apparaîtra après 2 semaines suivies.</p>`;
  else {
    const O = { end: 'endurance (150 min)', ren: 'renfo complet', sou: 'souplesse (2 séances)', well: 'bien-être (5 jours)', int: 'intense (3 jours)' }, items = [];
    for (const k in O) if (W.obj[k]) items.push(O[k]);
    for (const g in ARG) if (W.g[g]) items.push(ARG[g].toLowerCase());
    for (const z in ASZ) if (W.z[z]) items.push(ASZ[z].toLowerCase() + ' (étirements)');
    s += items.length
      ? `<div class="warn late">${ico('alert')}<span>Souvent oublié : ${items.map(x => '<b>' + esc(x) + '</b>').join(', ')}.<br><small>Moins d’une semaine sur deux, sur les ${a.T} dernières semaines suivies. Repère les « ! » ci-dessous.</small></span></div>`
      : `<div class="warn ok">${ico('check')}<span>Tout est équilibré sur les ${a.T} dernières semaines suivies.</span></div>`;
  }
  const B = (v, g, id) => bar(g ? v / g * 100 : 0, AC[id]);
  const INFO = {
    end: ['<b>Objectif :</b> 150 min équivalentes par semaine au minimum, 300 pour plus de bienfaits.',
      '<b>Modérée :</b> tu es un peu essoufflée mais tu peux parler. Marche rapide (environ 100 pas par minute, soit 1 500 pas en 15 min), vélo tranquille, natation douce, danse.',
      '<b>Soutenue :</b> tu ne dis que quelques mots sans reprendre ton souffle. <b>1 min soutenue = 2 min modérées.</b> Elle a sa propre ligne « Intense ».',
      'Toute durée compte, même courte (recommandations OMS 2020).',
      '<b>Ne compte pas :</b> marche tranquille, bureau debout, pilates, yoga, étirements.'],
    ren: ['<b>Objectif OMS :</b> au moins 2 jours par semaine de renforcement qui fait travailler <b>tous les grands groupes musculaires</b>, d’intensité modérée ou plus.',
      '<b>Les 3 groupes suivis :</b> jambes et fessiers, tronc (abdominaux, lombaires), haut du corps (bras, épaules, poitrine, haut du dos). Chacun devrait travailler <b>2 jours dans la semaine</b>, idéalement non consécutifs.',
      '<b>Compte :</b> pilates, yoga dynamique (vinyasa, ashtanga, power), exercices au poids du corps, élastiques, haltères.',
      '<b>Attention :</b> le pilates travaille surtout jambes et tronc. Pour le haut du corps : pompes contre un mur, planche, élastique, gainage sur les mains.',
      '<b>Ne compte pas :</b> escaliers, yoga doux ou hatha, étirements.'],
    sou: ['<b>Objectif ANSES :</b> 2 à 3 séances par semaine, avec des étirements maintenus 10 à 30 secondes et répétés 2 à 3 fois.',
      '<b>Compte :</b> yoga (doux, hatha, yin, couché, actif), étirements, pilates, yoga dynamique. Séance générale ou ciblée sur une zone.',
      '<b>Ne compte pas :</b> respiration, méditation, yoga nidra, bain sonore, auto-massage. Ils vont dans « Bien-être ».',
      'Faire le tour de toutes les zones dans la semaine est une bonne pratique, pas une règle officielle.'],
    well: ['<b>Objectif personnel</b> (pas de norme officielle) : une pratique au moins <b>5 jours sur 7</b>, même 5 minutes. Deux séances le même jour comptent pour un jour.',
      '<b>Pourquoi la régularité :</b> dans les études, la fréquence compte plus que la durée. 5 minutes par jour de respiration ou de méditation ont amélioré l’humeur et réduit l’anxiété en un mois. Chez des débutants, les effets nets sont apparus vers 8 semaines.',
      '<b>Compte :</b> respiration (par exemple le soupir cyclique, avec une expiration longue), méditation, yoga nidra, bain sonore, auto-massage, drainage lymphatique.',
      '<b>Drainage lymphatique :</b> les preuves solides concernent surtout le lymphœdème. Sans problème médical, c’est surtout une pratique de détente et de confort.'],
    int: ['<b>Repère personnel</b> (pas d’obligation officielle) : un peu d’intense <b>3 jours par semaine</b>. Ces minutes comptent aussi en endurance, à raison de 1 min = 2 min modérées.',
      '<b>Pourquoi :</b> minute pour minute, l’effort intense améliore davantage le souffle et le cœur. Dans une grande étude anglaise, chez des femmes qui ne faisaient pas de sport, environ 3,4 minutes par jour de courtes bouffées intenses dans la vie quotidienne étaient associées à 45 % de risque en moins d’accident cardiovasculaire majeur. C’est une association, pas une preuve de cause à effet.',
      '<b>Le bon niveau :</b> tu ne dis que quelques mots sans reprendre ton souffle. Note seulement les minutes vraiment intenses (par exemple, 5 min rapides dans une marche fractionnée de 20 min).',
      '<b>Idées :</b> escaliers d’un bon pas, marche fractionnée (1 min très rapide, 2 min normales), côte à bon rythme, course, vélo rapide.',
      '<b>Prudence :</b> augmente progressivement. En cas de problème cardiaque, d’hypertension, de douleur dans la poitrine ou d’essoufflement inhabituel, demande d’abord l’avis de ton médecin.'],
    sta: ['<b>Pas d’objectif chiffré officiel :</b> lève-toi et bouge quelques minutes toutes les 1 h 30 à 2 h.',
      '<b>Bureau debout :</b> alterne avec la position assise. Rester debout immobile longtemps n’est pas idéal non plus.',
      '<b>Pas :</b> environ 7 000 pas par jour sont un bon repère d’activité générale.'],
  };
  const staMid = '<span class="mid">bureau debout</span>';
  let rows;
  if (view === 'week') {
    const renDone = t.missing.length === 0;
    const miss = t.missing.map(g => ARG[g].toLowerCase() + ' (' + pl(t.gd[g], 'jour') + ')').join(', ');
    const zDone = Object.keys(ASZ).filter(z => t.zc[z] > 0).length;
    rows = [
      actObj('end', 'Endurance', B(t.eq, 150, 'end'), t.eq, '/150', t.eq >= 150, W.obj.end,
        `Cette semaine : ${t.mod} min modérées + ${t.sout} min soutenues (×2) = ${t.eq} min. ` + (t.eq >= 300 ? 'Objectif idéal de 300 atteint.' : t.eq >= 150 ? `Objectif atteint, encore ${300 - t.eq} min pour l’idéal.` : `Encore ${150 - t.eq} min.`), '', INFO.end),
      actObj('ren', 'Renfo', B(t.renDays, 2, 'ren'), t.renDays, '/2 j', renDone, W.obj.ren,
        t.renDays === 0 ? 'Pas encore de renfo cette semaine : 2 jours, en faisant travailler les 3 groupes.'
          : t.renDays < 2 ? `${pl(t.renDays, 'jour')} de renfo. Encore ${pl(2 - t.renDays, 'jour')}` + (miss ? `, en pensant à : ${miss}.` : '.')
            : renDone ? (t.spaced ? 'Objectif atteint : les 3 groupes ont travaillé 2 jours, sur des jours bien espacés.' : 'Objectif atteint. Si possible, espace les séances d’un jour.')
              : `${pl(t.renDays, 'jour')} de renfo, mais à compléter : ${miss}.`,
        Object.keys(ARG).map(g => { const n = t.gd[g]; return aPill(ARG[g], AC.ren, (n >= 2 ? 'full' : n ? 'half' : '') + (W.g[g] && n < 2 ? ' warn' : ''), n ? n + ' j' : ''); }).join(''), INFO.ren),
      actObj('sou', 'Souplesse', B(t.sou, 2, 'sou'), t.sou, '/2–3', t.sou >= 2, W.obj.sou,
        (t.sou >= 2 ? 'Objectif atteint. ' : `Encore ${pl(2 - t.sou, 'séance')}. `) + `${pl(t.gen, 'séance')} générale${t.gen > 1 ? 's' : ''}, zones ciblées : ${zDone} sur 5.`,
        Object.keys(ASZ).map(z => { const n = t.zc[z]; return aPill(ASZ[z], AC.sou, (n ? 'full' : '') + (W.z[z] && !n ? ' warn' : ''), n > 1 ? '×' + n : ''); }).join('') + (t.gen ? aPill(`+ ${t.gen} générale${t.gen > 1 ? 's' : ''}`, AC.sou, 'half') : ''), INFO.sou),
      actObj('well', 'Bien-être', B(t.wellDays, 5, 'well'), t.wellDays, '/5 j', t.wellDays >= 5, W.obj.well,
        (t.wellDays >= 5 ? 'Objectif atteint. ' : `${pl(t.wellDays, 'jour')} de pratique, encore ${pl(5 - t.wellDays, 'jour')}. `) + (t.wt.size ? 'Pratiques : ' + [...t.wt].map(b => ABE[b].toLowerCase()).join(', ') + '.' : ''),
        Object.keys(ABE).map(b => aPill(ABE[b], AC.well, t.wt.has(b) ? 'full' : '')).join(''), INFO.well),
      actObj('int', 'Intense', B(t.intDays, 3, 'int'), t.intDays, '/3 j', t.intDays >= 3, W.obj.int,
        (t.intDays >= 3 ? 'Repère atteint. ' : `${pl(t.intDays, 'jour')} avec de l’intense, encore ${pl(3 - t.intDays, 'jour')}. `) + `${t.sout} min soutenues au total (= ${2 * t.sout} min en endurance).`,
        Object.keys(AIT).map(k => aPill(AIT[k], AC.int, t.it.has(k) ? 'full' : '')).join(''), INFO.int),
      actObj('sta', 'Moins assise', staMid, nfr(t.sta / 60), ' h', false, false, `Cette semaine : ${nfr(t.sta / 60)} h de bureau debout.`, '', INFO.sta),
    ];
  } else {
    const T = a.T, G = T || 1, none = T ? '' : 'Aucune semaine suivie sur cette période. ';
    const cls = n => n && n * 2 >= T ? 'full' : n ? 'half' : '';
    rows = [
      actObj('end', 'Endurance', B(a.end, G, 'end'), a.end, '/' + T, T > 0 && a.end === T, W.obj.end, none + `150 min atteintes ${wks(a.end)} sur ${T}. Moyenne : ${a.endAvg} min par semaine.`, '', INFO.end),
      actObj('ren', 'Renfo', B(a.ren, G, 'ren'), a.ren, '/' + T, T > 0 && a.ren === T, W.obj.ren, none + `Renfo complet (3 groupes, 2 jours chacun) ${wks(a.ren)} sur ${T}.`,
        Object.keys(ARG).map(g => aPill(ARG[g], AC.ren, cls(a.g[g]) + (W.g[g] ? ' warn' : ''), `${a.g[g]}/${T}`)).join(''), INFO.ren),
      actObj('sou', 'Souplesse', B(a.sou, G, 'sou'), a.sou, '/' + T, T > 0 && a.sou === T, W.obj.sou, none + `2 séances ou plus ${wks(a.sou)} sur ${T}, dont ${pl(a.gen, 'séance')} générale${a.gen > 1 ? 's' : ''} au total.`,
        Object.keys(ASZ).map(z => aPill(ASZ[z], AC.sou, cls(a.z[z]) + (W.z[z] ? ' warn' : ''), `${a.z[z]}/${T}`)).join(''), INFO.sou),
      actObj('well', 'Bien-être', B(a.well, G, 'well'), a.well, '/' + T, T > 0 && a.well === T, W.obj.well, none + `5 jours ou plus ${wks(a.well)} sur ${T}. Moyenne : ${nfr(a.wellAvg)} jours par semaine.`,
        Object.keys(ABE).map(b => aPill(ABE[b], AC.well, cls(a.w[b]), `${a.w[b]}/${T}`)).join(''), INFO.well),
      actObj('int', 'Intense', B(a.int, G, 'int'), a.int, '/' + T, T > 0 && a.int === T, W.obj.int, none + `3 jours ou plus ${wks(a.int)} sur ${T}. Moyenne : ${a.soutAvg} min soutenues par semaine.`,
        Object.keys(AIT).map(k => aPill(AIT[k], AC.int, cls(a.i[k]), `${a.i[k]}/${T}`)).join(''), INFO.int),
      actObj('sta', 'Moins assise', staMid, nfr(a.sta / 60), ' h', false, false, none + `Sur ${wks(T)} : ${nfr(a.sta / 60)} h de bureau debout.`, '', INFO.sta),
    ];
  }
  s += `<div class="card list aobjs">${rows.join('')}</div>`;
  s += `<details class="ainfo" data-obj="info"${actOpen.has('info') ? ' open' : ''}><summary>${ico('eye', 16)}Lire les pastilles</summary><ul>
    <li><b>Cette semaine :</b> pointillé = pas encore fait, plein = fait (pour le renfo : contour = 1 jour, plein = 2 jours, l’objectif).</li>
    <li><b>4 dernières semaines :</b> le chiffre indique dans combien de semaines suivies la zone a été travaillée (pour le renfo : 2 jours dans la semaine). Plein = au moins une semaine sur deux.</li>
    <li><b>Contour orange et « ! » :</b> souvent oublié, travaillé moins d’une semaine sur deux sur les 4 dernières semaines suivies. La semaine en cours compte : fais-le et l’alerte disparaît.</li>
    <li>Seules les semaines où tu as noté au moins une activité comptent.</li></ul></details>`;
  h += `<section>${s}</section>`;

  /* --- ajouter --- */
  const ti = isNow ? dayIdx(today()) : -1;
  let add = `<div class="days7" role="group" aria-label="Jour">${ADAY.map((d, i) => `<button aria-pressed="${i === actSel}"${i === ti ? ' class="today"' : ''} aria-label="${d} ${+addDays(actCur, i).slice(8)}" ${A(() => { actSel = i; render(); })}>${AD1[i]}<small>${+addDays(actCur, i).slice(8)}</small></button>`).join('')}</div>`;
  const groups = {};
  for (const [k, p] of Object.entries(AP)) { if (p.hide) continue; (groups[p.g] = groups[p.g] || []).push([k, p]); }
  groups['Autre'] = [['_autre', { l: 'Autre activité', s: 'durée libre', c: 'sta' }]];
  add += Object.entries(groups).map(([g, l]) => `<div class="grp">${g}</div><div class="apresets">${l.map(([k, p]) =>
    `<button class="apre" ${A(() => k === '_autre' ? actOther() : actPreset(k))}><i class="adot" style="background:${AC[p.c]}"></i><span>${esc(p.l)}<small>${esc(p.s)}</small></span>${p.pick ? `<span class="chev">${ico('chevR', 14)}</span>` : ''}</button>`).join('')}</div>`).join('');
  h += sec(`<span>Ajouter</span><span style="font-weight:500">${esc(actDayLong())}</span>`, `<div class="card pad">${add}</div>`);

  /* --- jour par jour --- */
  h += sec('<span>Jour par jour</span><span style="font-weight:400">touche un jour pour le choisir</span>', `<div class="card list">${ADAY.map((d, i) => {
    const items = es.map((e, j) => ({ e, j })).filter(x => x.e.d === i);
    return `<div class="aday${i === actSel ? ' sel' : ''}"><button class="dh${i === ti ? ' today' : ''}" ${A(() => { actSel = i; render(); })}>${d} <small>${+addDays(actCur, i).slice(8)}</small></button>
      <div class="achips">${items.length ? items.map(x => { const dt = aDetail(x.e); return `<span class="achip"><i class="adot" style="background:${aColor(x.e)}"></i>${esc(aLabel(x.e))}${dt ? ` <em>${esc(dt)}</em>` : ''}<button aria-label="Retirer ${esc(aLabel(x.e))}" ${A(() => { const e = aEntries('w' + actCur)[x.j]; if (e) actChange(es2 => es2.splice(x.j, 1), aLabel(e) + ' retiré'); })}>×</button></span>`; }).join('') : '<span class="aempty">—</span>'}</div></div>`;
  }).join('')}</div>`);

  /* --- historique --- */
  let hist = '';
  for (let n = 7; n >= 0; n--) {
    const m = addDays(thisMon, -7 * n), tt = aTotals(aEntries('w' + m));
    const tg = (l, v, on, c) => `<span class="atag${on ? ' on' : ''}" style="--c:${c}">${l} ${v}</span>`;
    hist += `<div class="ahr${m === actCur ? ' cur' : ''}"><span>${esc(fDay(m))}</span>${bar(tt.eq / 3, AC.end)}<span class="n">${tt.eq}/150</span><span class="tags">${tg('R', tt.renDays, tt.missing.length === 0, AC.ren)}${tg('S', tt.sou, tt.sou >= 2, AC.sou)}${tg('B', tt.wellDays, tt.wellDays >= 5, AC.well)}${tg('I', tt.intDays, tt.intDays >= 3, AC.int)}</span></div>`;
  }
  h += `<details class="card ahist" data-obj="hist"${actOpen.has('hist') ? ' open' : ''}><summary><span>Historique, 8 semaines</span><span class="chev">${ico('chevR', 16)}</span></summary><div class="ahrs">${hist}</div>
    <p class="hint">Barre : endurance, pleine à 300 min. R = jours de renfo, S = séances de souplesse, B = jours de bien-être, I = jours avec de l’intense.</p></details>`;
  h += `<p class="hint">Repères OMS et ANSES pour une femme adulte de 18 à 64 ans en bonne santé. Les objectifs bien-être et intense sont des repères personnels. En cas de problème de santé, demande conseil à ton médecin.</p>`;
  h += `<button class="link" style="margin:-10px 4px 0" ${A(actImport)}>Importer des semaines depuis « Ma semaine active »</button>`;
  return h;
}
document.addEventListener('toggle', e => { const d = e.target; if (d && d.dataset && d.dataset.obj) { if (d.open) actOpen.add(d.dataset.obj); else actOpen.delete(d.dataset.obj); } }, true);

const ROUTES = {
  accueil: [pageAccueil, 'accueil'], completer: [pageCompleter, 'accueil'], trier: [pageTrier, 'accueil'], revue: [pageRevue, 'accueil'],
  sante: [pageSante, 'sante'], activite: [pageActivite, 'activite'], voyages: [pageVoyages, 'voyages'], import: [pageImport, 'voyages'],
  projets: [pageProjets, 'projets'], projet: [pageProjet, 'projets'],
  plus: [pagePlus, 'plus'], corvees: [pageCorvees, 'plus'], achats: [pageAchats, 'plus'], anniversaires: [pageAnniversaires, 'plus'],
  bons: [pageBons, 'plus'], 'aide-rappels': [pageAideRappels, 'plus'], problemes: [pageProblemes, 'plus'], papiers: [pagePapiers, 'plus'], 'papiers-types': [pagePapiersTypes, 'plus'], autre: [pageAutre, 'plus'],
};
const TABS = [['accueil', 'Accueil', 'sun'], ['sante', 'Santé', 'heart'], ['activite', 'Activité', 'pulse'], ['voyages', 'Voyages', 'suitcase'], ['projets', 'Projets', 'folder'], ['plus', 'Plus', 'dots']];
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
