// KSPR Assist: accessibility control centre by KSPR Labs. https://ksprlabs.com
// Install (single file build): upload dist/kspr-assist.js, then add
//   <script type="module" src="/path/to/kspr-assist.js"></script>
// Optional settings, set BEFORE the script tag:
//   <script>window.KSPR_ASSIST = { title: 'Accessibility', glossary: true, hints: true }</script>
if (window.__ksprAssist) throw new Error('KSPR Assist loaded twice'); window.__ksprAssist = true;
const CFG = Object.assign({ title: 'ACCESSIBILITY', glossary: true, hints: true }, window.KSPR_ASSIST || {});
// read from the page's main content: <main id="main">, any <main>, or the whole body
const MAIN = () => document.getElementById('main') || document.querySelector('main, [role=main]') || document.body;
const inMain = sel => sel.split(',').flatMap(x => [...MAIN().querySelectorAll(x.trim())]);
const INLINE_CSS = null; // build.py puts the stylesheet here for the single-file dist build
await new Promise(r => {
  if (INLINE_CSS) { const st = document.createElement('style'); st.id = 'kspr-assist-css'; st.textContent = INLINE_CSS; document.head.append(st); return r(); }
  if (document.querySelector('link[href*="kspr-assist.css"]')) return r();
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL('kspr-assist.css', import.meta.url).href; l.onload = l.onerror = r; document.head.append(l);
});
if (document.readyState === 'loading') await new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true }));
const MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const FIG = `<svg class="km-fig" width="34" height="34" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="kmSkin" gradientUnits="userSpaceOnUse" x1="18" y1="8" x2="46" y2="58"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#f0e8ff"/><stop offset="1" stop-color="#bda4f2"/></linearGradient><linearGradient id="kmLimb" gradientUnits="userSpaceOnUse" x1="0" y1="16" x2="0" y2="58"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#e9dfff"/><stop offset="1" stop-color="#a98ce8"/></linearGradient><radialGradient id="kmHead" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#efe7ff"/><stop offset="1" stop-color="#ae92ea"/></radialGradient><filter id="kmDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1.3" stdDeviation="1.2" flood-color="#0b0410" flood-opacity=".7"/><feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="#9b6bff" flood-opacity=".55"/></filter></defs><circle cx="32" cy="32" r="29" fill="none" stroke="rgba(233,224,245,.16)" stroke-width=".6" stroke-dasharray=".6 2.4"/><g filter="url(#kmDrop)" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M32 26.2 L32 38.6" stroke="url(#kmSkin)" stroke-width="5.8"/><path d="M32 38 Q29.6 45.6 24.6 53.6" stroke="url(#kmLimb)" stroke-width="4.5"/><path d="M32 38 Q34.4 45.6 39.4 53.6" stroke="url(#kmLimb)" stroke-width="4.5"/><ellipse cx="23.4" cy="55" rx="3.2" ry="1.9" transform="rotate(-18 23.4 55)" fill="url(#kmSkin)" stroke="none"/><ellipse cx="40.6" cy="55" rx="3.2" ry="1.9" transform="rotate(18 40.6 55)" fill="url(#kmSkin)" stroke="none"/><path d="M10.6 21.4 Q21 26.4 32 26.2" stroke="url(#kmLimb)" stroke-width="4.5"/><circle cx="10.2" cy="21.2" r="2.6" fill="url(#kmSkin)" stroke="none"/><g class="km-arm-r"><path d="M32 26.2 Q43 26.4 53.4 21.4" stroke="url(#kmLimb)" stroke-width="4.5"/><circle cx="53.8" cy="21.2" r="2.6" fill="url(#kmSkin)" stroke="none"/></g><circle cx="32" cy="13.2" r="5.7" fill="url(#kmHead)" stroke="none"/></g><g fill="none" stroke-linecap="round" opacity=".85"><path d="M12.4 20.2 Q21.6 24.6 30.6 24.6" stroke="#fff" stroke-width="1" opacity=".75"/><path d="M30.6 27.6 L30.6 36.6" stroke="#fff" stroke-width="1.1" opacity=".55"/><ellipse cx="29.9" cy="10.8" rx="2.1" ry="1.3" fill="#fff" opacity=".9"/></g></svg>`;

// feature catalogue: [key, tab, title, description, kind]
const F = [
  ['voice', 'control', 'Voice control', 'Say "scroll down", "click contact", "show numbers", "go to services". Works in Chrome and Edge, which send speech to their own service to recognise it.', 'mod'],
  ['air', 'control', 'Air control', 'Point with a finger. Tap it to click. Flick to scroll. Uses the camera.', 'mod'],
  ['head', 'control', 'Head pointer', 'Your nose moves the cursor. Open your mouth to click. Uses the camera.', 'mod'],
  ['eyes', 'control', 'Eye scroll', 'Look down to scroll down, look up to scroll up. Uses the camera.', 'mod'],
  ['switch', 'control', 'One-switch scanning', 'Everything clickable lights up in turn. Press Space to choose.', 'mod'],
  ['hints', 'control', 'Click by number', 'Numbers appear on every button and link. Type or say one.', 'mod'],
  ['contrast', 'see', 'High contrast', 'Stronger text and edges.', 'cls'],
  ['dark', 'see', 'Dark mode', 'A darker, softer page. Photos stay natural.', 'filter'],
  ['mono', 'see', 'Low saturation', 'Calmer, greyer colours.', 'filter'],
  ['protan', 'see', 'Red/green (protan)', 'Separates reds and greens for protanopia.', 'filter'],
  ['deutan', 'see', 'Red/green (deutan)', 'Separates reds and greens for deuteranopia.', 'filter'],
  ['tritan', 'see', 'Blue/yellow (tritan)', 'Separates blues and yellows for tritanopia.', 'filter'],
  ['cursor', 'see', 'Big cursor', 'A large, high-contrast pointer.', 'cls'],
  ['links', 'see', 'Highlight links', 'Every link underlined and outlined.', 'cls'],
  ['noimg', 'see', 'Hide images', 'Text only, fewer distractions.', 'cls'],
  ['still', 'see', 'Stop animations', 'Nothing moves, blinks or slides.', 'cls'],
  ['read', 'read', 'Read to me', 'Hear the page, each word highlighted.', 'mod'],
  ['hover', 'read', 'Hover to hear', 'Point at any text and it is read aloud.', 'mod'],
  ['beam', 'read', 'Reading mask', 'Dim everything except the lines you are reading.', 'mod'],
  ['dys', 'read', 'Readable letters', 'Plainer letters, more space, left-aligned.', 'cls'],
  ['spacing', 'read', 'Text spacing', 'More room between lines and words.', 'cls'],
  ['focus', 'read', 'Focus mode', 'Only the part you are reading stays clear.', 'mod'],
  ['words', 'read', 'Explain NDIS words', 'Tap any jargon for a plain-English meaning.', 'mod'],
  ['map', 'read', 'Page map', 'Jump straight to any section.', 'mod'],
];
if (!CFG.glossary) F.splice(F.findIndex(f => f[0] === 'words'), 1);
const PROFILES = [
  ['Low vision', 'I find small text hard to see', { zoom: 1.3, contrast: 1, cursor: 1, links: 1 }],
  ['Dyslexia', 'Reading is tiring', { dys: 1, spacing: 1, beam: 1, words: 1 }],
  ['ADHD / focus', 'Busy pages distract me', { still: 1, focus: 1, mono: 1 }],
  ['Motor', 'Clicking is hard', { voice: 1, hints: 1, cursor: 1, zoom: 1.15 }],
  ['Hands-free (voice)', 'I want to use my voice', { voice: 1, hints: 1 }],
  ['Seizure safe', 'Flashing makes me unwell', { still: 1, mono: 1 }],
  ['Older reader', 'Everything is a bit small', { zoom: 1.2, spacing: 1, links: 1, cursor: 1 }],
  ['Colour blind', 'Some colours look the same', { deutan: 1, links: 1 }],
];

const ui = document.createElement('div'); ui.className = 'km';
const card = ([k, , t, d]) => `<button class="km-opt" data-k="${k}" aria-pressed="false"><span><b>${t}</b><em>${d}</em></span><i class="km-sw"></i></button>`;
ui.innerHTML = `
<button class="km-orb" aria-label="Accessibility and assist" aria-haspopup="dialog" aria-expanded="false" title="Accessibility (Alt+A)"><span class="km-core"></span>${FIG}</button>
<div class="km-label">Accessibility <span>· Alt A</span></div>
<div class="km-scrim"></div>
<section class="km-sheet km-wide" role="dialog" aria-modal="true" aria-labelledby="km-t" inert>
 <div class="km-in">
  <div class="km-head"><div><small>${CFG.title}</small><h2 id="km-t">Use this page your way.</h2></div><button class="km-x" aria-label="Close">×</button></div>
  <div class="km-tabs" role="tablist">
   <button role="tab" data-tab="me" aria-selected="true">For me</button><button role="tab" data-tab="control" aria-selected="false">Control</button><button role="tab" data-tab="see" aria-selected="false">See</button><button role="tab" data-tab="read" aria-selected="false">Read</button>
  </div>
  <div class="km-pane" data-pane="me">
   <p class="km-ask">What would help you? <span>One tap sets everything up. You can fine-tune it in the other tabs.</span></p>
   <div class="km-profiles">${PROFILES.map((p, i) => `<button data-p="${i}" aria-pressed="false"><b>${p[0]}</b><span>${p[1]}</span></button>`).join('')}</div>
   <div class="km-zoom"><span>Text size</span><button data-z="-" aria-label="Smaller">A−</button><output id="km-zv">100%</output><button data-z="+" aria-label="Bigger">A+</button></div>
  </div>
  ${['control', 'see', 'read'].map(tab => `<div class="km-pane" data-pane="${tab}" hidden><div class="km-opts">${F.filter(f => f[1] === tab).map(card).join('')}</div></div>`).join('')}
  <div class="km-foot"><button class="km-reset">Reset everything</button><span>Saved on this device. Works on every page.</span></div>
  <a class="km-credit" href="https://ksprlabs.com/?utm_source=kspr-assist&utm_medium=widget" target="_blank" rel="noopener">Accessibility by <b>KSPR Labs</b></a>
 </div>
</section>
<div class="km-player" hidden><span class="km-eq"><i></i><i></i><i></i><i></i></span><span class="km-now">Reading…</span><button data-p="toggle">Pause</button><button data-p="next">Next</button><button data-p="rate">1×</button><button data-p="stop" aria-label="Stop reading">×</button></div>
<div class="km-beam" hidden><i class="t"></i><i class="band"></i><i class="b"></i></div>
<div class="km-cursor gone" hidden><i class="km-cr"></i><i class="km-cd"></i></div>
<div class="km-live" hidden><span class="km-mic"><i></i><i></i><i></i></span><span class="km-heard">Listening…</span><span class="km-did"></span><button class="km-live-x" aria-label="Stop">×</button></div>
<div class="km-cam" hidden><canvas width="200" height="200"></canvas><div><b class="km-cam-t">Camera</b><span class="km-cam-m">Starting…</span></div><button class="km-cam-x" aria-label="Stop">×</button></div>
<nav class="km-mapbox" hidden aria-label="Page map"><b>Page map</b><ol></ol><button class="km-map-x" aria-label="Close page map">×</button></nav>
<div class="km-tip" aria-live="polite"></div>
<div class="km-toast" role="status"></div>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <filter id="km-protan"><feColorMatrix type="matrix" values="1.000 0.000 0.000 0 0  -0.255 1.255 0.000 0 0  0.303 -0.545 1.242 0 0  0 0 0 1 0"/></filter>
 <filter id="km-deutan"><feColorMatrix type="matrix" values="1.000 0.000 0.000 0 0  -0.438 1.438 0.000 0 0  0.262 -0.562 1.300 0 0  0 0 0 1 0"/></filter>
 <filter id="km-tritan"><feColorMatrix type="matrix" values="1.000 0.000 0.000 0 0  0.035 1.532 -0.567 0 0  0.035 -0.510 1.475 0 0  0 0 0 1 0"/></filter>
</defs></svg>`;
document.body.append(ui);
const q = s => ui.querySelector(s), qa = s => [...ui.querySelectorAll(s)];
const orb = q('.km-orb'), label = q('.km-label'), sheet = q('.km-sheet'), scrim = q('.km-scrim');
let toastT; function toast(m) { const t = q('.km-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- state ---------- */
const KEY = 'kspr-assist-v1';
let S = {}; try { S = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

/* ---------- zoom that reflows like the browser's own zoom ---------- */
let Z = 1;
function setZoom(z) {
  z = clamp(Math.round(z * 100) / 100, 1, 1.6); S.zoom = z; save(); q('#km-zv').textContent = Math.round(z * 100) + '%';
  if (z === Z) return; const frac = scrollY / Math.max(1, root.scrollHeight - innerHeight); Z = z;
  root.style.zoom = z === 1 ? '' : z; ui.style.zoom = z === 1 ? '' : 1 / z;
  requestAnimationFrame(() => scrollTo({ top: frac * Math.max(0, root.scrollHeight - innerHeight), behavior: 'instant' }));
}
qa('[data-z]').forEach(b => b.onclick = () => setZoom(Z + (b.dataset.z === '+' ? .1 : -.1)));

/* ---------- smooth-scroll-proof scrolling + clicking helpers (shared by every control mode) ---------- */
let scrollAcc = 0;
function scrollStep(d) { scrollAcc += d; const n = Math.trunc(scrollAcc); if (!n) return; scrollAcc -= n; scrollTo({ top: scrollY + n, behavior: 'instant' }); }
const CLICKABLE = 'a[href], button, [role=button], summary, label, input, select, textarea, [tabindex]:not([tabindex="-1"])';
function clickableAt(x, y) {
  const probe = (px, py) => { const e = document.elementFromPoint(px, py); return e && e.closest(CLICKABLE); };
  let el = probe(x, y); if (el) return el;
  for (const R of [18, 32]) for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [.7, .7], [-.7, .7], [.7, -.7], [-.7, -.7]]) { el = probe(x + ox * R, y + oy * R); if (el) return el; }
  return null;
}
function activate(el) {
  if (!el) return; el.classList.add('km-pressed'); setTimeout(() => el.classList.remove('km-pressed'), 220);
  if (el.matches('input, textarea, select')) el.focus(); else el.click();
}
function ripple(x, y) { const r = document.createElement('i'); r.className = 'km-ripple'; r.style.left = x + 'px'; r.style.top = y + 'px'; ui.append(r); setTimeout(() => r.remove(), 700); }
function visibleClickables() {
  return [...document.querySelectorAll(CLICKABLE)].filter(e => { if (e.closest('[aria-hidden="true"], [inert], .km-sheet[inert]') || e.closest('.km') && !e.closest('.km-live, .km-cam, .km-mapbox, .km-player')) return false; const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(e).visibility !== 'hidden'; });
}
const nameOf = e => (e.getAttribute('aria-label') || e.innerText || e.value || e.title || e.placeholder || '').replace(/\s+/g, ' ').trim();

// a shared on-screen cursor for air, head and switch modes
const cursorEl = q('.km-cursor'); const CUR = { x: innerWidth / 2, y: innerHeight / 2, hover: null };
function showCursor(on) { cursorEl.hidden = !on; if (!on) setHover(null); }
function moveCursor(x, y) { CUR.x = x; CUR.y = y; cursorEl.style.transform = `translate(${x}px,${y}px)`; }
function setHover(el) { if (CUR.hover === el) return; if (CUR.hover) CUR.hover.classList.remove('km-hover'); CUR.hover = el; if (el) el.classList.add('km-hover'); cursorEl.classList.toggle('on', !!el); }

/* ---------- camera + vision, shared by air, head and eyes ---------- */
const V = { stream: null, video: null, users: new Set(), face: null, hand: null };
async function camera(user) {
  V.users.add(user);
  if (!V.stream) {
    V.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 60 } }, audio: false });
    V.video = document.createElement('video'); V.video.playsInline = true; V.video.muted = true; V.video.srcObject = V.stream; await V.video.play().catch(() => {});
  }
  return V.video;
}
function releaseCamera(user) { V.users.delete(user); if (!V.users.size && V.stream) { V.stream.getTracks().forEach(t => t.stop()); V.stream = null; V.video = null; q('.km-cam').hidden = true; } }
let visionP = null; const vision = () => visionP || (visionP = import(`${MP}/vision_bundle.mjs`).then(async m => ({ m, files: await m.FilesetResolver.forVisionTasks(`${MP}/wasm`) })));
async function faceModel() { if (!V.face) { const { m, files } = await vision(); V.face = await m.FaceLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task', delegate: 'GPU' }, runningMode: 'VIDEO', numFaces: 1, outputFaceBlendshapes: true }); } return V.face; }
async function handModel() { if (!V.hand) { const { m, files } = await vision(); V.hand = await m.HandLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' }, runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: .55, minHandPresenceConfidence: .55, minTrackingConfidence: .5 }); } return V.hand; }
function onFrames(video, fn, alive) {
  const rv = 'requestVideoFrameCallback' in HTMLVideoElement.prototype; let lastT = -1;
  const step = () => { if (!alive() || !video) return; rv ? video.requestVideoFrameCallback(step) : requestAnimationFrame(step); if (!rv) { if (video.currentTime === lastT) return; lastT = video.currentTime; } try { fn(performance.now()); } catch (e) { console.error(e); } };
  rv ? video.requestVideoFrameCallback(step) : requestAnimationFrame(step);
}
const camBox = { el: q('.km-cam'), cv: q('.km-cam canvas'), t: q('.km-cam-t'), m: q('.km-cam-m') };
function camStatus(title, msg) { camBox.el.hidden = false; camBox.t.textContent = title; if (camBox.m.textContent !== msg) camBox.m.textContent = msg; }
q('.km-cam-x').onclick = () => ['air', 'head', 'eyes'].forEach(k => S[k] && setOpt(k, false));
class OneEuro {
  constructor(mc, b, dc = 1) { this.mc = mc; this.b = b; this.dc = dc; this.x = null; this.dx = 0; this.t = 0; }
  a(c, dt) { const r = 2 * Math.PI * c * dt; return r / (r + 1); }
  f(x, t) { if (this.x === null) { this.x = x; this.t = t; return x; } const dt = Math.max(1e-3, (t - this.t) / 1000); this.t = t; this.dx += this.a(this.dc, dt) * ((x - this.x) / dt - this.dx); this.x += this.a(this.mc + this.b * Math.abs(this.dx), dt) * (x - this.x); return this.x; }
  reset() { this.x = null; this.dx = 0; }
}

/* ---------- sheet, tabs ---------- */
let open = false;
function inset() { const b = orb.getBoundingClientRect(); sheet.classList.add('on'); const p = sheet.getBoundingClientRect(); return `inset(${b.top - p.top}px ${p.right - b.right}px ${p.bottom - b.bottom}px ${b.left - p.left}px round 28px)`; }
function openSheet() {
  if (open) return; open = true; const from = inset(); sheet.inert = false; scrim.classList.add('on'); orb.classList.add('away'); label.classList.remove('on'); orb.setAttribute('aria-expanded', 'true');
  sheet.animate([{ clipPath: from }, { clipPath: 'inset(0px 0px 0px 0px round 26px)' }], { duration: reduce ? 1 : 560, easing: 'cubic-bezier(.3,1,.3,1)', fill: 'forwards' });
  setTimeout(() => { sheet.classList.add('ready'); q('.km-x').focus(); }, reduce ? 0 : 200);
}
function closeSheet() {
  if (!open) return; open = false; sheet.classList.remove('ready'); scrim.classList.remove('on'); sheet.inert = true; orb.setAttribute('aria-expanded', 'false'); const to = inset();
  sheet.animate([{ clipPath: 'inset(0px 0px 0px 0px round 26px)' }, { clipPath: to }], { duration: reduce ? 1 : 420, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' }).onfinish = () => { sheet.classList.remove('on'); orb.classList.remove('away'); };
}
orb.onclick = openSheet; q('.km-x').onclick = closeSheet; scrim.onclick = closeSheet;
orb.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') label.classList.add('on'); });
orb.addEventListener('pointerleave', () => label.classList.remove('on'));
qa('[role=tab]').forEach(t => t.onclick = () => { qa('[role=tab]').forEach(x => x.setAttribute('aria-selected', x === t)); qa('.km-pane').forEach(p => p.hidden = p.dataset.pane !== t.dataset.tab); });
addEventListener('keydown', e => {
  if (e.altKey && e.code === 'KeyA') { e.preventDefault(); open ? closeSheet() : openSheet(); }
  if (e.altKey && e.code === 'KeyN') { e.preventDefault(); setOpt('hints', !S.hints); }
  if (e.altKey && e.code === 'KeyV') { e.preventDefault(); setOpt('voice', !S.voice); }
  if (e.key === 'Escape') { if (open) closeSheet(); else if (S.hints) setOpt('hints', false); else if (reading) stopRead(); }
});

/* ---------- one switchboard for every feature ---------- */
const MODS = {};
function applyFilters() {
  const f = [];
  if (S.dark) f.push('invert(.9) hue-rotate(180deg)');
  if (S.mono) f.push('saturate(.25)');
  for (const k of ['protan', 'deutan', 'tritan']) if (S[k]) f.push(`url(#km-${k})`);
  document.querySelectorAll('body > *:not(.km)').forEach(el => el.style.filter = f.join(' '));
  root.classList.toggle('kma-dark', !!S.dark);
}
function setOpt(k, on, quiet) {
  on = !!on; if (!!S[k] === on && !quiet && qa(`[data-k=${k}]`).every(b => (b.getAttribute('aria-pressed') === 'true') === on)) return; S[k] = on; save();
  qa(`[data-k=${k}]`).forEach(b => b.setAttribute('aria-pressed', on));
  const def = F.find(f => f[0] === k); if (!def) return;
  if (['protan', 'deutan', 'tritan'].includes(k) && on) ['protan', 'deutan', 'tritan'].filter(x => x !== k && S[x]).forEach(x => setOpt(x, false));
  const run = () => {
    if (def[4] === 'cls') root.classList.toggle('kma-' + k, on);
    if (def[4] === 'filter') applyFilters();
    if (k === 'still') root.classList.toggle('motion-ok', !on && !reduce);
    if (def[4] === 'mod' && MODS[k]) on ? MODS[k].on() : MODS[k].off();
  };
  if (!quiet && def[4] !== 'mod' && document.startViewTransition && !reduce) { const vt = document.startViewTransition(run); [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr && pr.catch(() => {})); } else run();
}
qa('.km-opt').forEach(b => b.onclick = () => { const on = b.getAttribute('aria-pressed') !== 'true'; if (on && ['voice', 'air', 'head', 'eyes', 'switch', 'hints', 'map', 'beam'].includes(b.dataset.k)) closeSheet(); setOpt(b.dataset.k, on); });
qa('[data-p]').forEach(b => { if (!b.closest('.km-profiles')) return; b.onclick = () => {
  const [name, , set] = PROFILES[+b.dataset.p]; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
  Object.entries(set).forEach(([k, v]) => k === 'zoom' ? setZoom(on ? Math.max(Z, v) : 1) : setOpt(k, on));
  toast(on ? `${name}: set up for you.` : `${name}: turned off.`);
}; });
q('.km-reset').onclick = () => { F.forEach(f => S[f[0]] && setOpt(f[0], false)); setZoom(1); qa('.km-profiles [data-p]').forEach(b => b.setAttribute('aria-pressed', 'false')); toast('Everything is back to normal.'); };

/* ---------- reading mask ---------- */
const beam = q('.km-beam'); let beamY = innerHeight * .45, beamT = beamY, beamRaf; const BAND = 84;
addEventListener('pointermove', e => { if (S.beam && !reading) beamT = e.clientY; }, { passive: true });
function loopBeam() { if (!S.beam) return; beamY += (beamT - beamY) * (reduce ? 1 : .2); beam.style.setProperty('--y0', Math.max(0, beamY - BAND / 2) + 'px'); beam.style.setProperty('--y1', Math.min(innerHeight, beamY + BAND / 2) + 'px'); beamRaf = requestAnimationFrame(loopBeam); }
MODS.beam = { on() { beam.hidden = false; loopBeam(); }, off() { beam.hidden = true; cancelAnimationFrame(beamRaf); } };
/* ---------- read to me: speech with word-by-word highlight ---------- */
let reading = false, blocks = [], bi = 0, rate = 1, paused = false, voice = null, est = null, safety = null;
const player = q('.km-player'), now = q('.km-now');
const hasHL = typeof CSS !== 'undefined' && CSS.highlights && typeof Highlight !== 'undefined';
function pickVoice() {
  const vs = speechSynthesis.getVoices(); if (!vs.length) return null;
  const pref = ['en-AU', 'en-GB', 'en-US'];
  for (const l of pref) { const v = vs.find(v => v.lang === l && v.localService); if (v) return v; }
  return vs.find(v => v.lang && v.lang.startsWith('en')) || vs[0];
}
function collect() {
  const els = inMain('h1, h2, h3, p, li').filter(el => {
    if (el.closest('[aria-hidden="true"], .km, .fan, form, .types, [hidden]')) return false;
    if (el.parentElement && el.parentElement.closest('p, li') && el.tagName !== 'P') return false;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false;
    return el.textContent.trim().length > 2;
  });
  return els.map(el => {
    const nodes = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('[aria-hidden="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n, text = '';
    while ((n = w.nextNode())) { nodes.push({ n, start: text.length }); text += n.data.replace(/\s/g, ' '); }
    return { el, nodes, text };
  }).filter(b => b.text.trim().length > 2);
}
function rangeFor(b, i, j) {
  const r = new Range(); let set = 0;
  for (const { n, start } of b.nodes) {
    const end = start + n.data.length;
    if (!(set & 1) && i >= start && i <= end) { r.setStart(n, i - start); set |= 1; }
    if (!(set & 2) && j >= start && j <= end) { r.setEnd(n, j - start); set |= 2; break; }
  }
  return set === 3 ? r : null;
}
function markWord(b, i) {
  if (!hasHL) return; const t = b.text; while (i < t.length && t[i] === ' ') i++; let j = i; while (j < t.length && t[j] !== ' ') j++;
  const r = rangeFor(b, i, j); if (r) CSS.highlights.set('km-word', new Highlight(r));
}
function speakBlock() {
  clearTimeout(safety); clearInterval(est); if (!reading) return;
  if (bi >= blocks.length) { stopRead(); toast('Finished reading.'); return; }
  const b = blocks[bi];
  document.querySelectorAll('.km-reading').forEach(e => e.classList.remove('km-reading'));
  if (hasHL) { const r = rangeFor(b, 0, b.text.length); if (r) CSS.highlights.set('km-line', new Highlight(r)); } else b.el.classList.add('km-reading');
  const rect = b.el.getBoundingClientRect(); if (rect.top < innerHeight * .18 || rect.bottom > innerHeight * .78) b.el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  if (S.beam) { const rr = () => { const k = b.el.getBoundingClientRect(); beamT = Math.min(innerHeight - 40, Math.max(40, k.top + Math.min(k.height, BAND) / 2)); }; rr(); setTimeout(rr, 450); }
  now.textContent = b.text.trim().replace(/\s+/g, ' ').slice(0, 70);
  let gotBoundary = false; const words = [...b.text.matchAll(/\S+/g)].map(m => m.index); let wi = 0;
  const startEstimate = () => { est = setInterval(() => { if (paused || gotBoundary) return; if (wi < words.length) markWord(b, words[wi++]); }, 1000 / (2.6 * rate)); };
  const next = () => { bi++; speakBlock(); };
  if ('speechSynthesis' in window && (voice = voice || pickVoice())) {
    const u = new SpeechSynthesisUtterance(b.text); u.voice = voice; u.lang = voice.lang; u.rate = rate;
    u.onboundary = e => { if (e.name && e.name !== 'word') return; gotBoundary = true; markWord(b, e.charIndex); };
    u.onend = () => { if (reading && !paused) next(); };
    u.onerror = () => {};
    speechSynthesis.speak(u); setTimeout(() => { if (!gotBoundary) startEstimate(); }, 700);
    safety = setTimeout(() => { if (reading && !paused && !speechSynthesis.speaking) next(); }, (words.length / (2.6 * rate)) * 1000 + 2500);
  } else { startEstimate(); safety = setTimeout(next, (words.length / (2.6 * rate)) * 1000 + 600); }
}
function startRead() {
  blocks = collect(); if (!blocks.length) return;
  const vis = blocks.findIndex(b => b.el.getBoundingClientRect().bottom > 80); bi = Math.max(0, vis);
  reading = true; paused = false; player.hidden = false; player.classList.remove('paused'); q('[data-p=toggle]').textContent = 'Pause';
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if ('speechSynthesis' in window && !speechSynthesis.getVoices().length) { speechSynthesis.onvoiceschanged = () => { voice = pickVoice(); }; setTimeout(speakBlock, 250); } else speakBlock();
}
function stopRead() {
  if (S.read) { S.read = false; save(); qa('[data-k=read]').forEach(b => b.setAttribute('aria-pressed', 'false')); }
  reading = false; clearTimeout(safety); clearInterval(est); if ('speechSynthesis' in window) speechSynthesis.cancel();
  player.hidden = true; if (hasHL) { CSS.highlights.delete('km-word'); CSS.highlights.delete('km-line'); }
  document.querySelectorAll('.km-reading').forEach(e => e.classList.remove('km-reading'));
}
player.onclick = e => {
  const p = e.target.closest('button')?.dataset.p; if (!p) return;
  if (p === 'stop') stopRead();
  if (p === 'next') { if ('speechSynthesis' in window) speechSynthesis.cancel(); paused = false; player.classList.remove('paused'); bi++; setTimeout(speakBlock, 60); }
  if (p === 'toggle') { paused = !paused; player.classList.toggle('paused', paused); e.target.textContent = paused ? 'Play' : 'Pause'; if ('speechSynthesis' in window) paused ? speechSynthesis.pause() : speechSynthesis.resume(); }
  if (p === 'rate') { const R = [1, 1.25, 1.5, .85]; rate = R[(R.indexOf(rate) + 1) % R.length]; e.target.textContent = rate + '×'; if ('speechSynthesis' in window) speechSynthesis.cancel(); setTimeout(speakBlock, 60); }
};


MODS.read = { on() { startRead(); }, off() { if (reading) stopRead(); } };

/* ---------- hover to hear ---------- */
let hoverT = 0, hoverEl = null;
function speak(text, rate = 1) { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = rate; const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } speechSynthesis.speak(u); }
const hoverMove = e => {
  const el = e.target.closest && e.target.closest('h1,h2,h3,h4,p,li,a,button,summary,label,figcaption,td,th');
  if (!el || el === hoverEl || el.closest('.km')) return; hoverEl = el; clearTimeout(hoverT);
  hoverT = setTimeout(() => { document.querySelectorAll('.km-hear').forEach(x => x.classList.remove('km-hear')); el.classList.add('km-hear'); speak(nameOf(el).slice(0, 400)); }, 380);
};
MODS.hover = { on() { document.addEventListener('pointerover', hoverMove); toast('Point at any text to hear it.'); }, off() { document.removeEventListener('pointerover', hoverMove); clearTimeout(hoverT); document.querySelectorAll('.km-hear').forEach(x => x.classList.remove('km-hear')); if ('speechSynthesis' in window) speechSynthesis.cancel(); } };

/* ---------- focus mode ---------- */
let focusIO = null;
MODS.focus = {
  on() {
    root.classList.add('kma-focus');
    const blocks = inMain('section').flatMap(sec => { const w = sec.querySelector(':scope > .wrap') || sec; return [...w.children].filter(c => !c.matches('[aria-hidden="true"], script, style') && c.getBoundingClientRect().height > 20); }).concat([...document.querySelectorAll('footer')]);
    focusIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('need-in', e.isIntersecting)), { rootMargin: '-38% 0px -38% 0px' });
    blocks.forEach(b => { b.classList.add('km-f'); focusIO.observe(b); });
  },
  off() { root.classList.remove('kma-focus'); if (focusIO) focusIO.disconnect(); focusIO = null; document.querySelectorAll('.km-f').forEach(e => e.classList.remove('need-in', 'km-f')); },
};

/* ---------- explain NDIS words ---------- */
const GLOSS = {
  'NDIS': 'National Disability Insurance Scheme. The government scheme that funds support for people with disability.',
  'NDIA': 'National Disability Insurance Agency. The government agency that runs the NDIS.',
  'SIL': 'Supported Independent Living. Help with daily tasks for people who live in shared or supported homes.',
  'SDA': 'Specialist Disability Accommodation. Housing built for people with very high support needs.',
  'support coordinator': 'A person who helps you use your NDIS plan and find the right providers.',
  'plan-managed': 'A plan manager pays your providers for you from your NDIS plan.',
  'self-managed': 'You pay providers yourself and claim the money back from the NDIS.',
  'SEO': 'Search engine optimisation. Making a website show up higher on Google.',
  'AEO': 'Answer engine optimisation. Making AI assistants quote your website in their answers.',
  'GEO': 'Generative engine optimisation. Getting AI tools like ChatGPT to recommend you.',
  'WCAG': 'Web Content Accessibility Guidelines. The standard for websites that everyone can use.',
};
const GRE = new RegExp('\\b(' + Object.keys(GLOSS).sort((a, b) => b.length - a.length).map(k => k.replace(/-/g, '\\-')).join('|') + ')\\b', 'g');
const tip = q('.km-tip');
function closeTip() { tip.classList.remove('on'); }
function termClick(e) {
  const t = e.target.closest('.km-term'); if (!t) { if (!e.target.closest('.km-tip')) closeTip(); return; }
  e.preventDefault(); e.stopPropagation();
  const r = t.getBoundingClientRect(), k = Object.keys(GLOSS).find(x => x.toLowerCase() === t.dataset.term.toLowerCase());
  tip.innerHTML = `<b>${t.dataset.term}</b><span>${GLOSS[k]}</span><button type="button">Read it to me</button>`;
  tip.querySelector('button').onclick = () => speak(t.dataset.term + '. ' + GLOSS[k]);
  tip.classList.add('on'); const w = Math.min(320, innerWidth - 24); tip.style.width = w + 'px';
  let x = r.left * Z + r.width * Z / 2 - w / 2, y = r.bottom * Z + 10; x = clamp(x, 12, innerWidth - w - 12); if (y + 150 > innerHeight) y = r.top * Z - 10 - tip.offsetHeight;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
MODS.words = {
  on() {
    const w = document.createTreeWalker(MAIN(), NodeFilter.SHOW_TEXT, { acceptNode: n => { GRE.lastIndex = 0; return (!n.parentElement.closest('script,style,.km,.km-term,[aria-hidden="true"],a,button,input,textarea,select,svg') && GRE.test(n.data)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    const nodes = []; let n; while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(n => { GRE.lastIndex = 0; const f = document.createDocumentFragment(); let last = 0; n.data.replace(GRE, (m, _k, i) => { f.append(n.data.slice(last, i)); const b = document.createElement('button'); b.type = 'button'; b.className = 'km-term'; b.textContent = m; b.dataset.term = m; f.append(b); last = i + m.length; return m; }); f.append(n.data.slice(last)); n.replaceWith(f); });
    document.addEventListener('click', termClick, true); addEventListener('scroll', closeTip, { passive: true });
    toast(`${document.querySelectorAll('.km-term').length} NDIS words explained. Tap one.`);
  },
  off() { document.querySelectorAll('.km-term').forEach(b => b.replaceWith(b.textContent)); document.removeEventListener('click', termClick, true); closeTip(); },
};

/* ---------- page map ---------- */
const mapbox = q('.km-mapbox');
function sections() { return inMain('h1, h2').filter(h => h.getBoundingClientRect().height).map(h => ({ h, t: (h.querySelector('.sr-only') || h).textContent.replace(/\s+/g, ' ').trim() })); }
MODS.map = {
  on() { mapbox.querySelector('ol').innerHTML = sections().map((s, i) => `<li><button data-i="${i}">${s.t}</button></li>`).join(''); mapbox.hidden = false; mapbox.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { sections()[+b.dataset.i].h.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }); },
  off() { mapbox.hidden = true; },
};
q('.km-map-x').onclick = () => setOpt('map', false);

/* ---------- click by number (like Apple Voice Control's "show numbers") ---------- */
let hintEls = [], hintBox = null, typed = '';
function drawHints() {
  if (!hintBox) { hintBox = document.createElement('div'); hintBox.className = 'km-hints'; ui.append(hintBox); }
  hintEls = visibleClickables().filter(e => !e.closest('.km'));
  hintBox.innerHTML = hintEls.map((e, i) => { const r = e.getBoundingClientRect(); return `<span style="left:${Math.max(2, r.left * Z - 6)}px;top:${Math.max(2, r.top * Z - 8)}px">${i + 1}</span>`; }).join('');
}
let hintRaf = 0; const hintRedraw = () => { cancelAnimationFrame(hintRaf); hintRaf = requestAnimationFrame(drawHints); };
function pickHint(n) { const el = hintEls[n - 1]; if (!el) { toast(`There's no number ${n}.`); return false; } const r = el.getBoundingClientRect(); ripple((r.left + r.width / 2) * Z, (r.top + r.height / 2) * Z); activate(el); toast(`Pressed "${nameOf(el).slice(0, 40) || 'item ' + n}"`); setTimeout(hintRedraw, 400); return true; }
const hintKey = e => {
  if (e.target.closest('input, textarea') || e.altKey || e.metaKey || e.ctrlKey) return;
  if (/^[0-9]$/.test(e.key)) { typed += e.key; clearTimeout(hintKey.t); hintKey.t = setTimeout(() => { pickHint(+typed); typed = ''; }, 650); e.preventDefault(); }
};
MODS.hints = {
  on() { drawHints(); addEventListener('scroll', hintRedraw, { passive: true }); addEventListener('resize', hintRedraw); addEventListener('keydown', hintKey); toast('Type or say a number to press it. Esc to hide.'); },
  off() { if (hintBox) hintBox.innerHTML = ''; removeEventListener('scroll', hintRedraw); removeEventListener('resize', hintRedraw); removeEventListener('keydown', hintKey); },
};

/* ---------- one-switch scanning ---------- */
let scanI = -1, scanT = 0, scanList = [];
function scanNext() { scanList = visibleClickables().filter(e => !e.closest('.km')); if (!scanList.length) { scrollStep(innerHeight * .6); return; } scanI = (scanI + 1) % (scanList.length + 1); if (scanI === scanList.length) { setHover(null); document.querySelectorAll('.km-scan').forEach(x => x.classList.remove('km-scan')); toast('Scrolling down…'); scrollTo({ top: scrollY + innerHeight * .7, behavior: reduce ? 'instant' : 'smooth' }); scanI = -1; return; } document.querySelectorAll('.km-scan').forEach(x => x.classList.remove('km-scan')); scanList[scanI].classList.add('km-scan'); }
const scanKey = e => { if (e.code === 'Space' && !e.target.closest('input, textarea')) { e.preventDefault(); const el = document.querySelector('.km-scan'); if (el) { activate(el); toast(`Pressed "${nameOf(el).slice(0, 40)}"`); } } };
MODS.switch = {
  on() { scanI = -1; scanNext(); scanT = setInterval(scanNext, 1400); addEventListener('keydown', scanKey); toast('Press Space (or your switch) when the right thing lights up.'); },
  off() { clearInterval(scanT); removeEventListener('keydown', scanKey); document.querySelectorAll('.km-scan').forEach(x => x.classList.remove('km-scan')); },
};

/* ---------- voice control ---------- */
const live = q('.km-live'), heard = q('.km-heard'), did = q('.km-did');
let rec = null, voiceOn = false, keepScroll = 0, keepRaf = 0;
const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20 };
const toNum = s => { s = s.trim(); if (/^\d+$/.test(s)) return +s; return NUM[s] || null; };
const SECTION_WORDS = { faq: 'faq', questions: 'faq', price: 'offer', pricing: 'offer', cost: 'offer', offer: 'offer', work: 'work', examples: 'work', demos: 'work', review: 'review', contact: 'review', form: 'review', process: 'process', 'how it works': 'process', compare: 'compare', included: 'included', 'get found': 'found', google: 'found', results: 'results', top: 'top', home: 'top' };
function done(msg) { did.textContent = '✓ ' + msg; did.classList.remove('pop'); void did.offsetWidth; did.classList.add('pop'); }
function keepGoing(dir) { keepScroll = dir; cancelAnimationFrame(keepRaf); let last = performance.now(); const step = now => { if (!keepScroll) return; scrollStep(keepScroll * 380 * Math.min(.05, (now - last) / 1000)); last = now; keepRaf = requestAnimationFrame(step); }; keepRaf = requestAnimationFrame(step); }
function findByName(name) {
  const words = name.toLowerCase().replace(/^(the|on|button|link)\s+/g, '').split(/\s+/).filter(w => w.length > 1 && !['the', 'button', 'link', 'on', 'a'].includes(w));
  if (!words.length) return [];
  const phrase = name.toLowerCase().trim();
  return visibleClickables().filter(e => !e.closest('.km')).map(e => { const n = nameOf(e).toLowerCase(); const hit = words.filter(w => n.includes(w)).length; return { e, s: hit / words.length - n.length / 400 + (n.includes(phrase) ? 1 : 0) + (n === phrase ? .5 : 0) }; }).filter(x => x.s > .45).sort((a, b) => b.s - a.s);
}
function command(raw) {
  const t = raw.toLowerCase().replace(/[.,!?]/g, '').trim(); let m;
  if (/^(stop|stop scrolling|halt|pause)$/.test(t)) { keepScroll = 0; if (reading) stopRead(); done('Stopped'); return; }
  if ((m = t.match(/^(keep |start )?scroll(ing)? (down|up)( slowly)?$/)) && m[1]) { keepGoing(m[3] === 'down' ? 1 : -1); done(`Scrolling ${m[3]}. Say "stop".`); return; }
  if ((m = t.match(/^(scroll|page|go|move) (down|up)( a (little|bit)| a lot)?$/))) { const d = m[2] === 'down' ? 1 : -1, amt = m[3] && /lot/.test(m[3]) ? 1.6 : m[3] ? .35 : .8; scrollTo({ top: scrollY + d * innerHeight * amt, behavior: reduce ? 'instant' : 'smooth' }); done(`Scrolled ${m[2]}`); return; }
  if (/^(go to |scroll to )?(the )?(top|start|beginning)( of the page)?$/.test(t)) { scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' }); done('Top of the page'); return; }
  if (/^(go to |scroll to )?(the )?(bottom|end)( of the page)?$/.test(t)) { scrollTo({ top: root.scrollHeight, behavior: reduce ? 'instant' : 'smooth' }); done('Bottom of the page'); return; }
  if (/^(show|show me) (the )?(numbers|links|buttons|labels)$/.test(t)) { setOpt('hints', true); done('Say a number'); return; }
  if (/^(hide|remove|clear) (the )?(numbers|links|labels)$/.test(t)) { setOpt('hints', false); done('Numbers hidden'); return; }
  if ((m = t.match(/^(?:click|press|tap|choose|select|open)?\s*(?:number\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)$/)) && S.hints) { if (pickHint(toNum(m[1]))) done(`Pressed ${m[1]}`); return; }
  if ((m = t.match(/^(?:go to|show me|take me to|jump to|scroll to)\s+(?:the\s+)?(.+?)(?:\s+section)?$/))) { const key = Object.keys(SECTION_WORDS).find(k => m[1].includes(k)); const id = key && SECTION_WORDS[key]; const target = id && document.getElementById(id) || sections().find(s => s.t.toLowerCase().includes(m[1]))?.h; if (target) { target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); done(`Went to ${m[1]}`); } else heard.textContent = `I couldn't find "${m[1]}".`; return; }
  if ((m = t.match(/^(?:click|press|tap|open|choose|select)\s+(?:on\s+)?(.+)$/))) {
    const hits = findByName(m[1]);
    if (!hits.length) { heard.textContent = `I couldn't see "${m[1]}". Try "show numbers".`; return; }
    if (hits.length > 1 && hits[1].s > hits[0].s - .05) { setOpt('hints', true); done(`A few match "${m[1]}". Say a number.`); return; }
    const el = hits[0].e, r = el.getBoundingClientRect(); ripple((r.left + r.width / 2) * Z, (r.top + r.height / 2) * Z); el.scrollIntoView({ block: 'nearest' }); activate(el); done(`Pressed "${nameOf(el).slice(0, 40)}"`); return;
  }
  if ((m = t.match(/^type (.+)$/))) { const f = document.activeElement; if (f && f.matches('input, textarea')) { f.value += (f.value ? ' ' : '') + m[1]; f.dispatchEvent(new Event('input', { bubbles: true })); done('Typed'); } else heard.textContent = 'Click a text box first.'; return; }
  if (/^(read|read this|read (the |this )?page|read (it )?to me|read aloud)$/.test(t)) { setOpt('read', true); done('Reading the page'); return; }
  if (/^stop reading$/.test(t)) { setOpt('read', false); done('Stopped reading'); return; }
  if (/^(bigger|zoom in|larger|make (it|the text) bigger|bigger text|increase text)$/.test(t)) { setZoom(Z + .1); done(`Text ${Math.round(Z * 100)}%`); return; }
  if (/^(smaller|zoom out|make (it|the text) smaller|smaller text|decrease text)$/.test(t)) { setZoom(Z - .1); done(`Text ${Math.round(Z * 100)}%`); return; }
  if (/^(dark mode|dark|night mode)$/.test(t)) { setOpt('dark', true); done('Dark mode on'); return; }
  if (/^(light mode|light|day mode)$/.test(t)) { setOpt('dark', false); done('Light mode on'); return; }
  if (/^(high contrast|contrast)$/.test(t)) { setOpt('contrast', !S.contrast); done('Contrast changed'); return; }
  if (/^(focus mode|focus)$/.test(t)) { setOpt('focus', !S.focus); done('Focus mode changed'); return; }
  if (/^(go back|back)$/.test(t)) { history.back(); done('Went back'); return; }
  if (/^(open|close) (accessibility|menu|settings)$/.test(t)) { /^open/.test(t) ? openSheet() : closeSheet(); done(t); return; }
  if (/^(reset|reset everything|start again)$/.test(t)) { q('.km-reset').click(); done('Reset'); return; }
  if (/^(help|what can i say|commands)$/.test(t)) { heard.innerHTML = 'Try: <b>scroll down</b> · <b>keep scrolling</b> · <b>stop</b> · <b>click contact</b> · <b>show numbers</b> · <b>go to services</b> · <b>read this</b> · <b>bigger</b> · <b>dark mode</b>'; return; }
  heard.textContent = `"${raw}". Say "help" to hear what I can do.`;
}
MODS.voice = {
  on() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast('Voice control needs Chrome, Edge or Safari.'); setOpt('voice', false); return; }
    voiceOn = true; live.hidden = false; heard.textContent = 'Listening… say "help" to hear what I can do.'; did.textContent = '';
    const start = () => {
      if (!voiceOn) return; rec = new SR(); rec.lang = 'en-AU'; rec.continuous = true; rec.interimResults = true;
      rec.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; heard.textContent = '“' + r[0].transcript.trim() + '”'; if (r.isFinal) command(r[0].transcript); } };
      rec.onerror = e => { if (e.error === 'not-allowed') { toast('Microphone permission wasn\'t given.'); setOpt('voice', false); } };
      rec.onend = () => { if (voiceOn) setTimeout(start, 200); };
      try { rec.start(); } catch {}
    };
    start(); toast('Voice control on. Say "help" any time.');
  },
  off() { voiceOn = false; keepScroll = 0; if (rec) { rec.onend = null; try { rec.stop(); } catch {} } rec = null; live.hidden = true; },
};
q('.km-live-x').onclick = () => setOpt('voice', false);

/* ---------- camera modes: shared drawing ---------- */
const HB = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
function drawPts(L, bones, hi) {
  const c = camBox.cv, x = c.getContext('2d'), S2 = c.width; x.clearRect(0, 0, S2, S2); if (!L) return;
  let x0 = 1, x1 = 0, y0 = 1, y1 = 0; for (const p of L) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const sc = S2 * .66 / Math.max(x1 - x0, y1 - y0, .05), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, X = p => S2 / 2 - (p.x - mx) * sc, Y = p => S2 / 2 + (p.y - my) * sc;
  if (bones) { x.lineCap = 'round'; x.lineWidth = 4; x.strokeStyle = 'rgba(205,189,227,.5)'; for (const [a, b] of bones) { x.beginPath(); x.moveTo(X(L[a]), Y(L[a])); x.lineTo(X(L[b]), Y(L[b])); x.stroke(); } }
  x.globalCompositeOperation = 'lighter';
  const step = L.length > 100 ? 3 : 1;
  for (let i = 0; i < L.length; i += step) { const big = hi && hi.includes(i); x.fillStyle = big ? '#fff' : 'rgba(200,180,255,.8)'; x.beginPath(); x.arc(X(L[i]), Y(L[i]), big ? 5 : (L.length > 100 ? 1.5 : 3.5), 0, 6.283); x.fill(); }
  x.globalCompositeOperation = 'source-over';
}

/* ---------- air control v2: one finger, auto-centred, sticky targets, iPad-style pointer ---------- */
const AIR = { on: false, present: false, lost: 0, hy: null, ht: 0, vy: 0, flickDir: 0, flickEnd: 0, hold: 0, mom: 0, rb: 0, bend: false, bendT: 0, tx: 0, ty: 0, cool: 0, pinch: false, pinchT: 0, hist: [], raf: 0, edgeT: 0,
  cx: null, cy: null, lock: null, taps: 0, coach: null, speed: 0 };
const aX = new OneEuro(.85, .018), aY = new OneEuro(.85, .018); const atg = { x: innerWidth / 2, y: innerHeight / 2 };
// pointer layers: a soft light trail and a "hug" that wraps the button you're on
const trail = document.createElement('canvas'); trail.className = 'km-trail'; ui.append(trail);
const hug = document.createElement('div'); hug.className = 'km-hug'; hug.innerHTML = '<svg><rect pathLength="100"/></svg>'; ui.append(hug); const hugRect = hug.querySelector('rect');
const tctx = trail.getContext('2d'); const TP = [];
function sizeTrail() { const d = Math.min(2, devicePixelRatio || 1); trail.width = innerWidth * d; trail.height = innerHeight * d; tctx.setTransform(d, 0, 0, d, 0, 0); }
function drawTrail(now) {
  tctx.clearRect(0, 0, innerWidth, innerHeight); if (TP.length < 2) return;
  for (let i = 1; i < TP.length; i++) { const a = TP[i - 1], b = TP[i], age = (now - b.t) / 420; if (age > 1) continue;
    tctx.strokeStyle = `rgba(155,107,255,${(1 - age) * .55})`; tctx.lineWidth = 2 + (1 - age) * 7; tctx.lineCap = 'round';
    tctx.beginPath(); tctx.moveTo(a.x, a.y); tctx.lineTo(b.x, b.y); tctx.stroke(); }
}
function hugTo(el) {
  if (!el) { hug.classList.remove('on'); cursorEl.classList.remove('hugging'); return; }
  const r = el.getBoundingClientRect(), pad = 7, br = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 10;
  hug.style.left = (r.left * Z - pad) + 'px'; hug.style.top = (r.top * Z - pad) + 'px'; hug.style.width = (r.width * Z + pad * 2) + 'px'; hug.style.height = (r.height * Z + pad * 2) + 'px';
  const rad = Math.min(r.height * Z / 2 + pad, br * Z + pad); hug.style.borderRadius = rad + 'px'; const W2 = r.width * Z + pad * 2, H2 = r.height * Z + pad * 2; hugRect.setAttribute('x', 1.5); hugRect.setAttribute('y', 1.5); hugRect.setAttribute('width', Math.max(1, W2 - 3)); hugRect.setAttribute('height', Math.max(1, H2 - 3)); hugRect.setAttribute('rx', Math.max(0, rad - 1.5)); hug.classList.add('on'); cursorEl.classList.add('hugging');
}
// how-to card with an animated hand
function coach(show) {
  if (show && !AIR.coach) {
    AIR.coach = document.createElement('div'); AIR.coach.className = 'km-coach';
    AIR.coach.innerHTML = `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="hand"><path d="M52 104V58c0-4 3-7 7-7s7 3 7 7v-2c0-4 3-6 6-6s6 2 6 6v3c0-3 3-5 6-5s6 2 6 5v28c0 12-8 22-22 22h-6c-9 0-15-5-19-12L37 82c-2-4 0-8 4-9 3-1 6 0 8 3l3 5z" fill="#fff" stroke="#6a2875" stroke-width="3" stroke-linejoin="round"/><g class="finger"><path d="M52 60V22c0-4 3-7 7-7s7 3 7 7v36" fill="#fff" stroke="#6a2875" stroke-width="3" stroke-linejoin="round"/><circle cx="59" cy="16" r="5" fill="#9b6bff"/></g></g></svg>
      <div><b class="step">Point</b><span class="tip">Move one finger. The cursor follows.</span><div class="dots"><i class="on"></i><i></i><i></i></div></div>`;
    ui.append(AIR.coach); let i = 0; const steps = [['Point', 'Move one finger. The cursor follows.', 'point'], ['Click', 'Rest on a button for a second, or tap your finger.', 'tap'], ['Flick', 'Flick up or down to scroll the page.', 'flick']];
    AIR.coachT = setInterval(() => { if (!AIR.coach) return; i = (i + 1) % 3; AIR.coach.querySelector('.step').textContent = steps[i][0]; AIR.coach.querySelector('.tip').textContent = steps[i][1]; AIR.coach.dataset.s = steps[i][2]; AIR.coach.querySelectorAll('.dots i').forEach((d, j) => d.classList.toggle('on', j === i)); }, 2200);
    AIR.coach.dataset.s = 'point';
  } else if (!show && AIR.coach) { const c = AIR.coach; AIR.coach = null; clearInterval(AIR.coachT); c.classList.add('bye'); setTimeout(() => c.remove(), 400); }
}
function chip(text) { const c = document.createElement('i'); c.className = 'km-chip'; c.textContent = text; c.style.left = CUR.x + 'px'; c.style.top = CUR.y + 'px'; ui.append(c); setTimeout(() => c.remove(), 800); }

MODS.air = {
  async on() {
    AIR.on = true; AIR.cx = null; AIR.taps = 0; camStatus('Air control', 'Starting camera…'); showCursor(true); cursorEl.classList.add('gone'); cursorEl.classList.add('air'); sizeTrail(); addEventListener('resize', sizeTrail); trail.hidden = false;
    let video; try { video = await camera('air'); } catch (e) { camStatus('Air control', 'Camera blocked: ' + (e && e.name || e) + '. Allow the camera in the address bar.'); toast('Camera permission wasn\'t given.'); return; }
    camStatus('Air control', 'Waking up hand tracking…'); let hl; try { hl = await handModel(); } catch (e) { console.error(e); camStatus('Air control', 'Hand tracking could not load: ' + (e && e.message || e)); return; } if (!AIR.on) return;
    camStatus('Air control', 'Hold up one finger.'); coach(true);
    onFrames(video, t => airFrame(hl.detectForVideo(video, t), t), () => AIR.on);
    let last = performance.now();
    const loop = now => { if (!AIR.on) return; AIR.raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (AIR.present) {
        // sticky targets: once on a button, small shakes can't knock you off
        let h = AIR.lock;
        if (h) { const b = h.getBoundingClientRect(); const out = atg.x < b.left * Z - 44 || atg.x > b.right * Z + 44 || atg.y < b.top * Z - 40 || atg.y > b.bottom * Z + 40; if (out || !h.isConnected) h = null; }
        if (!h && !AIR.bend) { const c = clickableAt(atg.x, atg.y); if (c) { const b = c.getBoundingClientRect(); if (b.width * Z < 520 && b.height * Z < 220) h = c; } }
        if (!AIR.bend) AIR.lock = h;
        let gx = atg.x, gy = atg.y;
        if (AIR.lock) { const b = AIR.lock.getBoundingClientRect(); gx += (b.left * Z + b.width * Z / 2 - gx) * .55; gy += (b.top * Z + b.height * Z / 2 - gy) * .55; }
        const k = 1 - Math.exp(-dt * (AIR.lock ? 11 : 17)); const nx = CUR.x + (gx - CUR.x) * k, ny = CUR.y + (gy - CUR.y) * k;
        AIR.speed += (Math.hypot(nx - CUR.x, ny - CUR.y) / Math.max(dt, .001) - AIR.speed) * .2;
        moveCursor(nx, ny); setHover(AIR.lock); hugTo(AIR.lock);
        // hover to click: rest on a button for a moment and it presses itself
        if (AIR.lock && AIR.lock !== AIR.dwellDone && !AIR.bend && !AIR.pinch && Math.abs(AIR.mom) < 60) { if (AIR.dwellEl !== AIR.lock) { AIR.dwellEl = AIR.lock; AIR.dwellT = now; } const k2 = Math.min(1, (now - AIR.dwellT) / 1100); hugRect.style.strokeDashoffset = 100 - k2 * 100; hug.classList.toggle('dwell', k2 > .05);
          if (k2 >= 1) { AIR.dwellDone = AIR.lock; hug.classList.remove('dwell'); const b = AIR.lock.getBoundingClientRect(); ripple((b.left + b.width / 2) * Z, (b.top + b.height / 2) * Z); cursorEl.classList.remove('pop'); void cursorEl.offsetWidth; cursorEl.classList.add('pop'); hug.classList.add('fired'); setTimeout(() => hug.classList.remove('fired'), 450); activate(AIR.lock); chip('Clicked'); } }
        else { if (AIR.lock !== AIR.dwellEl) { AIR.dwellEl = null; } if (!AIR.lock) AIR.dwellDone = null; hug.classList.remove('dwell'); hugRect.style.strokeDashoffset = 100; }
        cursorEl.style.setProperty('--sq', AIR.lock ? .35 : 1);
        TP.push({ x: nx, y: ny, t: now }); while (TP.length && now - TP[0].t > 420) TP.shift();
        AIR.hist.push({ t: now, x: nx, y: ny }); while (AIR.hist.length && AIR.hist[0].t < now - 700) AIR.hist.shift();
        const e = CUR.y < innerHeight * .06 ? -1 : CUR.y > innerHeight * .94 ? 1 : 0; if (e) { if (!AIR.edgeT) AIR.edgeT = now; if (now - AIR.edgeT > 650) AIR.mom += (e * 480 - AIR.mom) * (1 - Math.exp(-dt * 3)); } else AIR.edgeT = 0;
      } else { TP.length = 0; hugTo(null); }
      drawTrail(now);
      cursorEl.classList.toggle('flick', Math.abs(AIR.mom) > 160); cursorEl.style.setProperty('--dir', AIR.mom > 0 ? 1 : -1);
      if (Math.abs(AIR.mom) > 10) { scrollStep(AIR.mom * dt); AIR.mom *= Math.exp(-dt * 2.4); if (AIR.lock) hugTo(AIR.lock); } else AIR.mom = 0;
    };
    AIR.raf = requestAnimationFrame(loop);
  },
  off() { AIR.on = false; cancelAnimationFrame(AIR.raf); coach(false); hugTo(null); AIR.lock = null; trail.hidden = true; tctx.clearRect(0, 0, innerWidth, innerHeight); cursorEl.classList.remove('air', 'flick', 'hugging'); showCursor(!!(S.head)); releaseCamera('air'); },
};
function airFrame(res, t) {
  AIR.fc = (AIR.fc || 0) + 1; if (t - (AIR.fpsT || 0) > 1000) { AIR.fps = AIR.fc; AIR.fc = 0; AIR.fpsT = t; if (AIR.present) camStatus('Air control', `Hand seen · ${AIR.fps} fps · point, tap, flick`); else camStatus('Air control', `No hand yet · ${AIR.fps} fps · hold one finger up, palm to the screen`); }
  const L = res.landmarks && res.landmarks[0]; drawPts(L, HB, [8]);
  if (!L) { if (AIR.lost > 90) AIR.lostLong = true; if (++AIR.lost > 5 && AIR.present) { AIR.present = false; cursorEl.classList.add('gone'); AIR.bend = false; AIR.hy = null; setHover(null); camStatus('Air control', 'Hold up one finger.'); } return; }
  AIR.lost = 0;
  if (!AIR.present) { AIR.present = true; cursorEl.classList.remove('gone'); aX.reset(); aY.reset(); AIR.rb = 0; if (AIR.lostLong) AIR.cx = null; AIR.lostLong = false; camStatus('Air control', 'Point · tap to click · flick to scroll'); }
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), size = d(L[0], L[9]) || .1;
  // auto-centre: wherever your hand first rests becomes the middle of the screen
  if (AIR.cx === null) { AIR.cn = 0; AIR.cx = L[8].x; AIR.cy = L[8].y; }
  if (AIR.cn < 12) { AIR.cn++; AIR.cx += (L[8].x - AIR.cx) / AIR.cn; AIR.cy += (L[8].y - AIR.cy) / AIR.cn; }
  AIR.cx += (clamp(L[8].x, .25, .75) - AIR.cx) * .0015; AIR.cy += (clamp(L[8].y, .2, .7) - AIR.cy) * .0015; // drifts slowly with your posture
  const dtH = AIR.hy === null ? 0 : Math.max(.001, (t - AIR.ht) / 1000), vyRaw = AIR.hy === null ? 0 : (L[9].y - AIR.hy) / dtH; AIR.hy = L[9].y; AIR.ht = t; AIR.vy += (vyRaw - AIR.vy) * .55;
  const dir = Math.sign(AIR.vy), refr = AIR.flickDir && dir === -AIR.flickDir && t - AIR.flickEnd < 520;
  if (Math.abs(AIR.vy) > .95 && !refr && !AIR.bend) { if (AIR.flickDir !== dir) chip(dir > 0 ? '↓' : '↑'); AIR.flickDir = dir; AIR.mom = clamp(AIR.mom + AIR.vy * innerHeight * .16, -3400, 3400); AIR.flickEnd = t; AIR.hold = t + 260; if (AIR.coach && ++AIR.taps > 2) coach(false); } else if (t - AIR.flickEnd > 520) AIR.flickDir = 0;
  // range: a comfortable hand movement (about a third of the camera view) covers the whole screen
  const RX = .48, RY = .4;
  const nx = clamp(.5 + (AIR.cx - L[8].x) / RX, 0, 1), ny = clamp(.5 + (L[8].y - AIR.cy) / RY, 0, 1);
  const fx = aX.f(nx * innerWidth, t), fy = aY.f(ny * innerHeight, t);
  if (t > AIR.hold && !AIR.bend) { atg.x = fx; atg.y = fy; }
  const r = d(L[8], L[5]) / size; if (!AIR.rb) AIR.rb = r; AIR.rb += (r - AIR.rb) * (r > AIR.rb ? .25 : .012);
  const past = ms => AIR.hist.find(h => h.t >= t - ms) || CUR;
  const fire = () => { const el = AIR.lock || clickableAt(AIR.tx, AIR.ty); AIR.dwellDone = el; hug.classList.remove('dwell'); ripple(AIR.tx, AIR.ty); cursorEl.classList.remove('pop'); void cursorEl.offsetWidth; cursorEl.classList.add('pop'); if (el) { activate(el); chip('Tap'); } AIR.cool = t + 350; if (AIR.coach && ++AIR.taps > 1) coach(false); };
  if (!AIR.bend && t > AIR.cool && r < AIR.rb * .82 && Math.abs(AIR.vy) < .7) { AIR.bend = true; AIR.bendT = t; const p = past(170); AIR.tx = p.x; AIR.ty = p.y; cursorEl.classList.add('down'); }
  if (AIR.bend) { if (r > AIR.rb * .9) { AIR.bend = false; cursorEl.classList.remove('down'); if (t - AIR.bendT < 650) fire(); } else if (t - AIR.bendT > 900) { AIR.bend = false; cursorEl.classList.remove('down'); } }
  const pd = d(L[4], L[8]) / size;
  if (!AIR.pinch && pd < .3 && t > AIR.cool) { AIR.pinch = true; AIR.pinchT = t; const p = past(120); AIR.tx = p.x; AIR.ty = p.y; cursorEl.classList.add('down'); }
  else if (AIR.pinch && pd > .42) { AIR.pinch = false; cursorEl.classList.remove('down'); if (t - AIR.pinchT < 700) fire(); }
}

/* ---------- head pointer (like Google's Project Gameface): nose moves the cursor, open mouth clicks ---------- */
const HEAD = { on: false, n: 0, cx: 0, cy: 0, lost: 0, open: false, openT: 0, cool: 0, raf: 0, edgeT: 0, mom: 0, tx: innerWidth / 2, ty: innerHeight / 2 };
const hX = new OneEuro(1.0, .008), hY = new OneEuro(1.0, .008);
MODS.head = {
  async on() {
    HEAD.on = true; HEAD.n = 0; camStatus('Head pointer', 'Starting camera…'); showCursor(true);
    let video; try { video = await camera('head'); } catch { toast('Camera permission wasn\'t given.'); setOpt('head', false); return; }
    camStatus('Head pointer', 'Waking up face tracking…'); const fl = await faceModel(); if (!HEAD.on) return;
    camStatus('Head pointer', 'Look at the middle of the screen…');
    onFrames(video, t => headFrame(fl.detectForVideo(video, t), t), () => HEAD.on);
    let last = performance.now();
    const loop = now => { if (!HEAD.on) return; HEAD.raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now;
      let gx = HEAD.tx, gy = HEAD.ty; const h = clickableAt(gx, gy); if (h) { const b = h.getBoundingClientRect(); if (b.width < 500 && b.height < 200) { gx += (b.left * Z + b.width * Z / 2 - gx) * .3; gy += (b.top * Z + b.height * Z / 2 - gy) * .3; } }
      const k = 1 - Math.exp(-dt * 10); moveCursor(CUR.x + (gx - CUR.x) * k, CUR.y + (gy - CUR.y) * k); setHover(h);
      const e = CUR.y < innerHeight * .07 ? -1 : CUR.y > innerHeight * .93 ? 1 : 0; if (e) { if (!HEAD.edgeT) HEAD.edgeT = now; if (now - HEAD.edgeT > 350) HEAD.mom += (e * 480 - HEAD.mom) * (1 - Math.exp(-dt * 3)); } else { HEAD.edgeT = 0; HEAD.mom *= Math.exp(-dt * 6); }
      if (Math.abs(HEAD.mom) > 8) scrollStep(HEAD.mom * dt); };
    HEAD.raf = requestAnimationFrame(loop);
  },
  off() { HEAD.on = false; cancelAnimationFrame(HEAD.raf); showCursor(!!S.air); releaseCamera('head'); },
};
function headFrame(res, t) {
  const L = res.faceLandmarks && res.faceLandmarks[0]; drawPts(L, null, [1]);
  if (!L) { if (++HEAD.lost > 8) { cursorEl.classList.add('gone'); camStatus('Head pointer', 'Looking for you…'); } return; }
  HEAD.lost = 0; cursorEl.classList.remove('gone');
  const B = {}; ((res.faceBlendshapes && res.faceBlendshapes[0] && res.faceBlendshapes[0].categories) || []).forEach(c => B[c.categoryName] = c.score);
  const nose = L[1];
  if (HEAD.n < 25) { HEAD.cx = (HEAD.cx * HEAD.n + nose.x) / (HEAD.n + 1); HEAD.cy = (HEAD.cy * HEAD.n + nose.y) / (HEAD.n + 1); HEAD.n++; if (HEAD.n === 25) camStatus('Head pointer', 'Move your head to point · open your mouth to click'); return; }
  const gain = 4.2; // small head turns cover the whole screen
  HEAD.tx = hX.f(clamp(innerWidth / 2 - (nose.x - HEAD.cx) * gain * innerWidth, 0, innerWidth), t);
  HEAD.ty = hY.f(clamp(innerHeight / 2 + (nose.y - HEAD.cy) * gain * 1.3 * innerHeight, 0, innerHeight), t);
  const jaw = B.jawOpen || 0;
  if (!HEAD.open && jaw > .42 && t > HEAD.cool) { HEAD.open = true; HEAD.openT = t; HEAD.px = CUR.x; HEAD.py = CUR.y; cursorEl.classList.add('down'); }
  else if (HEAD.open && jaw < .2) { HEAD.open = false; cursorEl.classList.remove('down'); if (t - HEAD.openT < 1500) { ripple(HEAD.px, HEAD.py); activate(clickableAt(HEAD.px, HEAD.py)); HEAD.cool = t + 500; } }
}

/* ---------- eye scroll: look down to scroll down, up to scroll up ---------- */
const EYE = { on: false, n: 0, base: 0, v: 0, lost: 0, raf: 0, s: 0 };
MODS.eyes = {
  async on() {
    EYE.on = true; EYE.n = 0; camStatus('Eye scroll', 'Starting camera…');
    let video; try { video = await camera('eyes'); } catch { toast('Camera permission wasn\'t given.'); setOpt('eyes', false); return; }
    camStatus('Eye scroll', 'Waking up face tracking…'); const fl = await faceModel(); if (!EYE.on) return;
    camStatus('Eye scroll', 'Look at the middle of the screen…');
    onFrames(video, t => eyeFrame(fl.detectForVideo(video, t), t), () => EYE.on);
    let last = performance.now();
    const loop = now => { if (!EYE.on) return; EYE.raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; EYE.v += (EYE.s * 420 - EYE.v) * (1 - Math.exp(-dt * 2.5)); if (Math.abs(EYE.v) > 8) scrollStep(EYE.v * dt); };
    EYE.raf = requestAnimationFrame(loop);
  },
  off() { EYE.on = false; cancelAnimationFrame(EYE.raf); releaseCamera('eyes'); },
};
function eyeFrame(res, t) {
  const L = res.faceLandmarks && res.faceLandmarks[0]; drawPts(L, null, [468, 473]);
  if (!L) { EYE.s = 0; return; }
  const B = {}; ((res.faceBlendshapes && res.faceBlendshapes[0] && res.faceBlendshapes[0].categories) || []).forEach(c => B[c.categoryName] = c.score);
  if ((B.eyeBlinkLeft + B.eyeBlinkRight) / 2 > .5) return;
  const g = ((B.eyeLookDownLeft || 0) + (B.eyeLookDownRight || 0) - (B.eyeLookUpLeft || 0) - (B.eyeLookUpRight || 0)) / 2;
  if (EYE.n < 30) { EYE.base = (EYE.base * EYE.n + g) / (EYE.n + 1); EYE.n++; if (EYE.n === 30) camStatus('Eye scroll', 'Look down to scroll down · look up to scroll up'); return; }
  const dg = g - EYE.base, want = dg > .22 ? 1 : dg < -.18 ? -1 : 0;
  if (want !== EYE.want) { EYE.want = want; EYE.since = t; }
  EYE.s = t - EYE.since > 350 ? want * Math.min(1, (Math.abs(dg) - .12) * 3) : 0;
}

/* ---------- restore saved choices ---------- */
if (S.zoom && S.zoom > 1) setZoom(S.zoom);
// camera, mic and scanning modes never auto-restart, so forget them on load (otherwise the toggle thinks they're already on)
['air', 'head', 'eyes', 'voice', 'read', 'switch'].forEach(k => { S[k] = false; }); save();
F.forEach(([k]) => { if (S[k]) setOpt(k, true, true); });

/* ---------- glass bubble button: a live soap-film shader behind the figure ---------- */
(() => {
  const cv = document.createElement('canvas'); cv.className = 'km-bub'; cv.setAttribute('aria-hidden', 'true');
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) return;
  const FS = `precision mediump float;uniform vec2 res,look;uniform float t,ex,press;
float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
float fbm3(vec3 p){float a=.5,s=0.;for(int i=0;i<2;i++){s+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
vec3 plum(float x){x=clamp(x,0.,1.);vec3 a=vec3(.12,.03,.16),b=vec3(.43,.15,.52),c=vec3(.62,.42,1.),d=vec3(.87,.81,.99);
 if(x<.33)return mix(a,b,x/.33);if(x<.66)return mix(b,c,(x-.33)/.33);return mix(c,d,(x-.66)/.34);}
float spec(vec3 n,vec3 L,float p){return pow(max(dot(reflect(-normalize(L),n),vec3(0.,0.,1.)),0.),p);}
vec3 film(float x){x=fract(x);vec3 a=vec3(.58,.32,.96),b=vec3(.36,.32,.92),c=vec3(.62,.82,1.),d=vec3(1.,.97,1.),e=vec3(.82,.62,1.);
 if(x<.2)return mix(a,b,x/.2);if(x<.4)return mix(b,c,(x-.2)/.2);if(x<.6)return mix(c,d,(x-.4)/.2);if(x<.8)return mix(d,e,(x-.6)/.2);return mix(e,a,(x-.8)/.2);}
void main(){vec2 uv=(gl_FragCoord.xy/res)*2.-1.;uv-=look*.05*ex;float a=atan(uv.y,uv.x);float la=atan(look.y,look.x);
 float R=.34*(1.+.08*ex+.12*press)+(.006+.02*ex)*sin(a*2.+t*1.3)+(.004+.014*ex)*sin(a*3.-t*1.7)+.022*ex*clamp(length(look),0.,1.)*max(0.,cos(a-la));
 float r=length(uv)/R;
 if(r>=1.02){float g=exp(-max(r-1.,0.)*3.)*(.12+.35*ex)*smoothstep(1.,.58,length(uv));gl_FragColor=vec4(vec3(.62,.46,1.)*g,g);return;}
 float nz=sqrt(max(0.,1.-r*r));vec3 n=normalize(vec3(uv/R,nz));
 vec3 q=vec3(n.xy*1.4,nz)+vec3(0.,t*.12,t*.1);float th=fbm(q*1.8+fbm3(q*1.2+t*.05))*1.6+n.y*.35+t*.03;
 vec3 fc=film(th*1.3+(1.-nz)*.6);float fr=pow(1.-nz,2.5);
 float al=clamp(.07+.95*fr,0.,1.)*smoothstep(1.02,.985,r);vec3 c=fc*(.5+1.1*fr);
 float arc=exp(-pow((r-.8)/.06,2.))*smoothstep(.2,.9,dot(normalize(uv/R),normalize(vec2(-.7,.7))));vec2 dd=uv/R-vec2(-.36,.44);float win=clamp(arc*.9+exp(-dot(dd,dd)/.006),0.,1.);c+=vec3(1.)*win;al=max(al,win*.85);
 float s=spec(n,vec3(.55,-.5,.65),50.);c+=s*.8;al=max(al,s*.7);
 vec2 pp=(uv/R+look*.1)/.62;float pr=length(pp);
 if(pr<1.){float pz=sqrt(1.-pr*pr);vec3 pn=normalize(vec3(pp,pz));
  vec3 pc=plum(.2+.42*pz)+vec3(1.)*spec(pn,vec3(-.6,.7,.5),22.)*.7+film(th+pn.x)*pow(1.-pz,2.)*.7;
  float pa=smoothstep(1.,.93,pr);gl_FragColor=vec4(mix(c*al,pc,pa),mix(al,1.,pa));return;}
 gl_FragColor=vec4(c*al,al);}`;
  const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
  const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;
  const P = gl.createProgram(); gl.attachShader(P, vs); gl.attachShader(P, fs); gl.linkProgram(P); if (!gl.getProgramParameter(P, gl.LINK_STATUS)) return;
  gl.useProgram(P); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(P, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(P, n), uRes = U('res'), uLook = U('look'), uT = U('t'), uEx = U('ex'), uPress = U('press');
  const CSS = 168, DPR = Math.min(2, devicePixelRatio || 1); cv.width = cv.height = Math.round(CSS * DPR); gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height);
  orb.prepend(cv); orb.classList.add('km-glass');
  const st = { x: -1e4, y: -1e4, prox: 0, lx: 0, ly: 0, T: 7, press: 0, hover: false, last: performance.now() };
  addEventListener('pointermove', e => { st.x = e.clientX; st.y = e.clientY; }, { passive: true });
  orb.addEventListener('pointerenter', () => st.hover = true); orb.addEventListener('pointerleave', () => st.hover = false);
  orb.addEventListener('pointerdown', () => st.press = 1);
  const draw = () => { gl.uniform1f(uT, st.T); gl.uniform1f(uEx, st.prox); gl.uniform2f(uLook, st.lx, st.ly); gl.uniform1f(uPress, st.press); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  if (reduce) { draw(); return; }
  let raf = 0;
  const frame = now => {
    raf = 0; const dt = Math.min(.05, (now - st.last) / 1000); st.last = now;
    const r = orb.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = st.x - cx, dy = st.y - cy, d = Math.hypot(dx, dy);
    st.prox += ((st.hover ? 1 : Math.max(0, 1 - d / 320)) - st.prox) * .1;
    const k = Math.min(1, 150 / Math.max(d, 1)); st.lx += ((d > 1 ? dx / d * k : 0) * Math.min(1, st.prox * 2) - st.lx) * .14; st.ly += ((d > 1 ? -dy / d * k : 0) * Math.min(1, st.prox * 2) - st.ly) * .14;
    st.press *= .86; st.T += dt * (1 + st.prox * 1.6);
    draw(); if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  const go = () => { if (!raf && !document.hidden) { st.last = performance.now(); raf = requestAnimationFrame(frame); } };
  document.addEventListener('visibilitychange', go); go();
})();

/* ---------- little hints that bubble out of the button ---------- */
(() => {
  let off = !CFG.hints; try { off = off || localStorage.getItem('km-hints') === 'off'; } catch { }
  if (off) return;
  const HINTS = [
    ['Try voice control', 'Say "scroll down" or "click contact"', 'control', 'voice'],
    ['Browse with your camera', 'Point a finger to move and click', 'control', 'air'],
    ['Have this page read to you', 'Every word lights up as it\'s read', 'read', 'read'],
    ['Make the text bigger', 'One tap, and it stays on every page', 'me', null],
  ];
  const tip = document.createElement('button'); tip.type = 'button'; tip.className = 'km-hint'; tip.tabIndex = -1; tip.setAttribute('aria-hidden', 'true');
  tip.innerHTML = '<b></b><span></span><i class="km-hint-x">×</i>'; ui.append(tip);
  let i = 0, shown = 0, timer = 0, hideT = 0, cur = null;
  const stop = () => { off = true; clearTimeout(timer); clearTimeout(hideT); tip.classList.remove('on'); try { localStorage.setItem('km-hints', 'off'); } catch { } };
  const hide = () => { tip.classList.remove('on'); timer = setTimeout(next, 24000); };
  const next = () => {
    if (off || shown >= 4) return;
    if (open || document.hidden || orb.classList.contains('away') || document.querySelector('.km-live:not([hidden]),.km-cam:not([hidden])')) { timer = setTimeout(next, 8000); return; }
    cur = HINTS[i++ % HINTS.length]; shown++;
    tip.querySelector('b').textContent = cur[0]; tip.querySelector('span').textContent = cur[1];
    tip.classList.add('on'); hideT = setTimeout(hide, 6500);
  };
  tip.addEventListener('click', e => {
    if (e.target.closest('.km-hint-x')) { stop(); return; }
    const h = cur; stop(); openSheet();
    setTimeout(() => { const tb = q(`[data-tab="${h[2]}"]`); if (tb) tb.click(); if (h[3]) { const o = q(`.km-opt[data-k="${h[3]}"]`); if (o) { o.scrollIntoView({ block: 'center' }); o.classList.add('km-flash'); setTimeout(() => o.classList.remove('km-flash'), 1800); } } }, reduce ? 0 : 420);
  });
  orb.addEventListener('click', stop);
  timer = setTimeout(next, 5000);
})();
