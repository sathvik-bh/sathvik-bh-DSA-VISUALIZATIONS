// ---------- Pure logic ----------
class Stack {
  constructor() { this.a = []; }
  push(x) { this.a.push(x); }
  pop() { return this.a.pop(); }
  peek() { return this.a[this.a.length - 1]; }
  isEmpty() { return this.a.length === 0; }
  size() { return this.a.length; }
}
// Builds the full list of moves recursively: move n disks from a to c using b
function gen(n, a, b, c, out) {
  if (n === 0) return;
  gen(n - 1, a, c, b, out);
  out.push([a, c]);
  gen(n - 1, b, a, c, out);
}

// ---------- State ----------
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const X = [-6.5, 0, 6.5], NAMES = ['A', 'B', 'C'], H = 0.52, LIFT = 7.4;
let n = 3, pegs, meshes = [], moves = 0, busy = false, playing = false, list = null, idx = 0, sel = null;

// ---------- 3D scene ----------
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
let dist = 24, tx = 0;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(6, 14, 8); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 });
scene.add(sun);

const base = new THREE.Mesh(new THREE.BoxGeometry(20, 0.6, 7), new THREE.MeshStandardMaterial({ color: 0x2a1b4d, roughness: 0.4, metalness: 0.3 }));
base.receiveShadow = true; scene.add(base);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.3 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -0.31; floor.receiveShadow = true; scene.add(floor);

const hits = [];
X.forEach((x, i) => {
  const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 6.2, 24), new THREE.MeshStandardMaterial({ color: 0xffc766, roughness: 0.25, metalness: 0.8 }));
  peg.position.set(x, 3.4, 0); peg.castShadow = true; scene.add(peg);
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 7, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.position.set(x, 3.6, 0); hit.userData.peg = i; scene.add(hit); hits.push(hit);
});

function fit() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h);
  cam.aspect = w / h; cam.updateProjectionMatrix();
  dist = Math.max(22, 27 / cam.aspect);
}
new ResizeObserver(fit).observe(stage);
stage.addEventListener('mousemove', e => { const r = stage.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * 5; });
(function loop() {
  cam.position.set(cam.position.x + (tx - cam.position.x) * 0.05, dist * 0.42, dist);
  cam.lookAt(0, 2.2, 0);
  renderer.render(scene, cam);
  requestAnimationFrame(loop);
})();

// ---------- Helpers ----------
function toast(m) {
  const t = $('toast'); t.textContent = m; t.classList.add('show');
  stage.classList.add('shake');
  clearTimeout(toast.id);
  toast.id = setTimeout(() => { t.classList.remove('show'); stage.classList.remove('shake'); }, 1800);
}
const tw = (o, k, v, ms) => new Promise(r => {
  const s = o[k], t0 = performance.now();
  (function f(t) {
    const p = Math.min(1, (t - t0) / ms), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    o[k] = s + (v - s) * e;
    p < 1 ? requestAnimationFrame(f) : r();
  })(t0);
});
function ui() {
  $('m').textContent = moves;
  $('min').textContent = 2 ** n - 1;
  $('stacks').innerHTML = pegs.map((p, i) => `<div>${NAMES[i]}: [${p.a.join(', ')}]</div>`).join('');
  $('solve').textContent = playing ? 'Pause' : (list && idx > 0 && idx < list.length ? 'Resume' : 'Auto solve');
}
function build() {
  meshes.forEach(m => m && scene.remove(m));
  pegs = [new Stack(), new Stack(), new Stack()];
  meshes = [];
  for (let s = n; s >= 1; s--) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.6 + s * 0.25, 0.6 + s * 0.25, 0.5, 48),
      new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.92 - (s - 1) * 0.1, 0.8, 0.58), roughness: 0.3, metalness: 0.25 }));
    m.castShadow = true; m.receiveShadow = true;
    m.position.set(X[0], 0.55 + pegs[0].size() * H, 0);
    scene.add(m); meshes[s] = m; pegs[0].push(s);
  }
}
async function reset() {
  playing = false;
  while (busy) await sleep(30);
  moves = 0; list = null; idx = 0; sel = null;
  $('log').innerHTML = ''; $('win').classList.remove('show');
  build(); ui();
}

// ---------- Moves ----------
async function move(f, t) {
  if (pegs[f].isEmpty()) throw new Error('Peg ' + NAMES[f] + ' has no disks.');
  if (!pegs[t].isEmpty() && pegs[t].peek() < pegs[f].peek()) throw new Error('A larger disk cannot go on a smaller disk.');
  busy = true;
  const s = pegs[f].pop(), m = meshes[s], d = +$('spd').value;
  await tw(m.position, 'y', LIFT, d * 0.5);
  await tw(m.position, 'x', X[t], d * 0.8);
  await tw(m.position, 'y', 0.55 + pegs[t].size() * H, d * 0.5);
  pegs[t].push(s); moves++;
  const li = document.createElement('li');
  li.textContent = `Move ${moves}: pop disk ${s} from ${NAMES[f]}, push onto ${NAMES[t]}`;
  $('log').prepend(li);
  busy = false; ui();
  if (pegs[2].size() === n) {
    $('win').textContent = `Solved in ${moves} moves. The minimum possible is ${2 ** n - 1}.`;
    $('win').classList.add('show');
  }
}
async function setupAuto() { await reset(); list = []; gen(n, 0, 2, 1, list); idx = 0; }
async function play() {
  if (playing) { playing = false; return; }
  if (busy) return;
  if (!list || idx >= list.length) await setupAuto();
  playing = true; ui();
  while (playing && idx < list.length) await move(...list[idx++]);
  playing = false; ui();
}
async function step() {
  if (playing || busy) return;
  if (!list || idx >= list.length) await setupAuto();
  await move(...list[idx++]);
}
function glow(i, on) { const s = pegs[i].peek(); if (s) meshes[s].material.emissive.setHex(on ? 0x666666 : 0); }
async function pick(i) {
  if (busy || list) return;
  if (sel === null) {
    if (pegs[i].isEmpty()) return toast('Peg ' + NAMES[i] + ' has no disks.');
    sel = i; glow(i, true);
  } else {
    const f = sel; glow(f, false); sel = null;
    if (f !== i) try { await move(f, i); } catch (e) { toast(e.message); }
  }
}

// ---------- Events ----------
const ray = new THREE.Raycaster();
renderer.domElement.addEventListener('click', e => {
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera({ x: (e.clientX - r.left) / r.width * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, cam);
  const h = ray.intersectObjects(hits)[0];
  if (h) pick(h.object.userData.peg);
});
$('solve').onclick = play;
$('step').onclick = step;
$('reset').onclick = reset;
$('disks').onchange = e => { n = +e.target.value; reset(); };

fit(); reset();
