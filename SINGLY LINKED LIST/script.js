// ---------- Data structure (pure logic, no DOM) ----------
class Node { constructor(d) { this.data = d; this.next = null; } }

class LinkedList {
  constructor() { this.head = null; this.size = 0; }
  toArray() { const a = []; for (let c = this.head; c; c = c.next) a.push(c.data); return a; }
  insertAt(v, p) {
    if (p < 0 || p > this.size) throw new Error(`Invalid position ${p}. Valid range: 0 to ${this.size}.`);
    const n = new Node(v);
    if (p === 0) { n.next = this.head; this.head = n; }
    else { let t = this.head; for (let i = 0; i < p - 1; i++) t = t.next; n.next = t.next; t.next = n; }
    this.size++;
  }
  deleteAt(p) {
    let v;
    if (p === 0) { v = this.head.data; this.head = this.head.next; }
    else { let t = this.head; for (let i = 0; i < p - 1; i++) t = t.next; v = t.next.data; t.next = t.next.next; }
    this.size--; return v;
  }
  reverse() { let prev = null, c = this.head; while (c) { const nx = c.next; c.next = prev; prev = c; c = nx; } this.head = prev; }
}

// ---------- C code shown for each operation ----------
const CODE = {
  insHead: ['struct Node* n = malloc(sizeof(struct Node));\nn->data = val;\nn->next = head;  // point to old head\nhead = n;        // head moves to new node', 'O(1)'],
  insTail: ['n->next = NULL;\nstruct Node* t = head;\nwhile (t->next != NULL)\n    t = t->next;   // walk to last node\nt->next = n;', 'O(n)'],
  insPos: ['for (i = 0; i < pos - 1; i++)\n    t = t->next;   // stop before position\nn->next = t->next;\nt->next = n;', 'O(n)'],
  delHead: ['struct Node* t = head;\nhead = head->next;\nfree(t);', 'O(1)'],
  delTail: ['struct Node* t = head;\nwhile (t->next->next != NULL)\n    t = t->next;   // second last node\nfree(t->next);\nt->next = NULL;', 'O(n)'],
  delPos: ['for (i = 0; i < pos - 1; i++)\n    t = t->next;\nstruct Node* d = t->next;\nt->next = d->next;  // bypass d\nfree(d);', 'O(n)'],
  delVal: ['while (t != NULL && t->data != val) {\n    prev = t;\n    t = t->next;\n}\nprev->next = t->next;  // bypass t\nfree(t);', 'O(n)'],
  search: ['while (t != NULL) {\n    if (t->data == val) return pos;\n    t = t->next;\n    pos++;\n}\nreturn -1;  // not found', 'O(n)'],
  traverse: ['struct Node* t = head;\nwhile (t != NULL) {\n    printf("%d -> ", t->data);\n    t = t->next;\n}\nprintf("NULL");', 'O(n)'],
  reverse: ['prev = NULL; curr = head;\nwhile (curr != NULL) {\n    next = curr->next;\n    curr->next = prev;  // flip arrow\n    prev = curr;\n    curr = next;\n}\nhead = prev;', 'O(n)'],
  clear: ['while (head != NULL) {\n    t = head;\n    head = head->next;\n    free(t);\n}', 'O(n)']
};

// ---------- UI ----------
const L = new LinkedList();
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const delay = () => +$('spd').value;
let busy = false;

function render(o = {}) {
  const a = L.toArray(), box = $('list');
  if (!a.length) box.innerHTML = '<div class="empty">The list is empty. HEAD points to NULL. Insert a value to begin.</div>';
  else box.innerHTML = a.map((v, i) => {
    let c = 'node';
    if (i === o.cur) c += ' cur';
    else if (o.seen !== undefined && i < o.seen) c += ' seen';
    if (i === o.found) c += ' found';
    if (i === o.fresh) c += ' fresh';
    if (i === o.gone) c += ' gone';
    const back = o.flip !== undefined && i < o.flip;
    const arrow = `<span class="arr">${back ? '←' : '→'}</span>` + (i === a.length - 1 ? '<span class="null">NULL</span>' : '');
    return `<div class="cell">${i === 0 ? '<div class="tag">HEAD ▼</div>' : ''}<div class="${c}"><span class="d">${v}</span><span class="n">${i}</span></div>${arrow}</div>`;
  }).join('');
  info();
}

function info() {
  const a = L.toArray();
  $('i-len').textContent = L.size;
  $('i-head').textContent = a.length ? a[0] : 'NULL';
  $('i-tail').textContent = a.length ? a[a.length - 1] : 'NULL';
  $('i-empty').textContent = a.length ? 'No' : 'Yes';
}

function say(op, msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  $('log').prepend(li);
  $('code').textContent = CODE[op][0];
  $('cx').textContent = 'Time complexity: ' + CODE[op][1];
}

function toast(m) {
  const t = $('toast');
  t.textContent = m; t.classList.add('show');
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove('show'), 2500);
}

const lock = b => document.querySelectorAll('button').forEach(x => x.disabled = b);

// Walks the list node by node; returns the index of target, or -1
async function walk(target) {
  const a = L.toArray();
  for (let i = 0; i < a.length; i++) {
    render({ cur: i, seen: i });
    await sleep(delay());
    if (a[i] === target) return i;
  }
  return -1;
}

async function run(op) {
  if (busy) return;
  const v = $('val').value, p = $('pos').value;
  const val = v === '' ? null : +v, pos = p === '' ? null : +p, n = L.size;
  try {
    if (['insHead', 'insTail', 'insPos', 'delVal', 'search'].includes(op) && val === null) throw new Error('Enter a value first.');
    if (['insPos', 'delPos'].includes(op) && pos === null) throw new Error('Enter a position first.');
    if (['delHead', 'delTail', 'delPos', 'delVal', 'search', 'traverse', 'reverse'].includes(op) && !n)
      throw new Error(op.startsWith('del') ? 'The list is empty. Nothing to delete.' : 'The list is empty.');
    busy = true; lock(true);
    let i;
    switch (op) {
      case 'insHead': L.insertAt(val, 0); render({ fresh: 0 }); say(op, `Inserted ${val} at the beginning`); break;
      case 'insTail': L.insertAt(val, n); render({ fresh: n }); say(op, `Inserted ${val} at the end (index ${n})`); break;
      case 'insPos': L.insertAt(val, pos); render({ fresh: pos }); say(op, `Inserted ${val} at position ${pos}`); break;
      case 'delHead': case 'delTail': case 'delPos': case 'delVal':
        if (op === 'delVal') { i = await walk(val); if (i < 0) throw new Error(`${val} was not found in the list.`); }
        else {
          i = op === 'delHead' ? 0 : op === 'delTail' ? n - 1 : pos;
          if (i < 0 || i >= n) throw new Error(`Invalid position ${pos}. Valid range: 0 to ${n - 1}.`);
        }
        render({ gone: i }); await sleep(600);
        say(op, `Deleted ${L.deleteAt(i)} from index ${i}`); render(); break;
      case 'search':
        i = await walk(val);
        if (i < 0) { render(); say(op, `${val} not found`); toast(`${val} was not found in the list.`); }
        else { render({ found: i }); say(op, `Found ${val} at index ${i}`); }
        break;
      case 'traverse': await walk(null); render(); say(op, 'Traversal: ' + L.toArray().join(' → ') + ' → NULL'); break;
      case 'reverse':
        if (n < 2) { say(op, 'A list with fewer than 2 nodes is already reversed'); break; }
        for (let k = 1; k <= n; k++) { render({ flip: k, cur: k - 1 }); await sleep(delay()); }
        L.reverse(); render(); say(op, 'Reversed: ' + L.toArray().join(' → ') + ' → NULL'); break;
      case 'clear': L.head = null; L.size = 0; render(); say(op, 'List cleared'); break;
    }
  } catch (e) { render(); toast(e.message); }
  finally { busy = false; lock(false); }
}

document.addEventListener('click', e => { const b = e.target.closest('[data-op]'); if (b) run(b.dataset.op); });
$('val').addEventListener('keydown', e => { if (e.key === 'Enter') run('insTail'); });

[10, 20, 30].forEach((x, i) => L.insertAt(x, i));
render();
$('code').textContent = '// Run an operation to see its C code here';
