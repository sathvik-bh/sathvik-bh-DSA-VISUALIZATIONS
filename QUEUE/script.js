/**
 * Queue Visualizer — script.js
 * Pure ES6+, no frameworks, no build tools.
 *
 * Architecture:
 *   LinearQueue    — data-only queue class (linear / non-circular)
 *   CircularQueue  — data-only circular queue class
 *   PriorityQueue  — data-only min-priority queue class
 *   Deque          — data-only double-ended queue class
 *   QueueRenderer  — all DOM updates, animations, pointer positioning
 *   App            — ties everything together, handles all UI events
 */

'use strict';

/* ============================================================
   CONSTANTS
============================================================ */
const MIN_CAPACITY = 3;
const MAX_CAPACITY = 10;
const DEFAULT_CAPACITY = 6;

/** Animation durations (ms) keyed by speed slider value 1/2/3 */
const ANIM_SPEEDS = { 1: 700, 2: 400, 3: 180 };

/* ============================================================
   C CODE SNIPPETS
   Each snippet has: title, complexity, and lines[] where each
   line is {text, highlight?}.
============================================================ */
const C_CODE = {
  default: {
    title: '—',
    complexity: 'O(1)',
    lines: [
      { text: '#define MAX 6' },
      { text: '' },
      { text: 'typedef struct {' },
      { text: '    int items[MAX];' },
      { text: '    int front, rear, size;' },
      { text: '} Queue;' },
      { text: '' },
      { text: '/* Select an operation to see its C code */' },
    ],
  },

  /* ── Linear Enqueue ── */
  linear_enqueue: {
    title: 'Enqueue (Linear)',
    complexity: 'O(1)',
    lines: [
      { text: 'void enqueue(Queue *q, int value) {' },
      { text: '    if (q->size == MAX) {', highlight: false },
      { text: '        printf("Queue Overflow!\\n");' },
      { text: '        return;' },
      { text: '    }' },
      { text: '    /* Advance rear pointer */' },
      { text: '    q->rear = q->rear + 1;', highlight: true },
      { text: '    /* Store value at rear */' },
      { text: '    q->items[q->rear] = value;', highlight: true },
      { text: '    q->size++;', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* Time: O(1)  Space: O(1) */' },
    ],
  },

  /* ── Linear Dequeue ── */
  linear_dequeue: {
    title: 'Dequeue (Linear)',
    complexity: 'O(1)',
    lines: [
      { text: 'int dequeue(Queue *q) {' },
      { text: '    if (q->size == 0) {' },
      { text: '        printf("Queue Underflow!\\n");' },
      { text: '        return -1;' },
      { text: '    }' },
      { text: '    /* Read value at front */' },
      { text: '    int val = q->items[q->front];', highlight: true },
      { text: '    /* Advance front pointer (wastes space) */' },
      { text: '    q->front = q->front + 1;', highlight: true },
      { text: '    q->size--;', highlight: true },
      { text: '    return val;' },
      { text: '}' },
      { text: '' },
      { text: '/* Time: O(1)  Space: O(1) */' },
    ],
  },

  /* ── Circular Enqueue ── */
  circular_enqueue: {
    title: 'Enqueue (Circular)',
    complexity: 'O(1)',
    lines: [
      { text: 'void enqueue(CQueue *q, int value) {' },
      { text: '    if (q->size == MAX) {' },
      { text: '        printf("Queue Overflow!\\n");' },
      { text: '        return;' },
      { text: '    }' },
      { text: '    /* Wrap-around using modulo — key insight */' },
      { text: '    q->rear = (q->rear + 1) % MAX;', highlight: true },
      { text: '    q->items[q->rear] = value;', highlight: true },
      { text: '    q->size++;', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* (rear+1)%MAX wraps 5→0 in a size-6 queue */' },
      { text: '/* Time: O(1)  Space: O(1) */' },
    ],
  },

  /* ── Circular Dequeue ── */
  circular_dequeue: {
    title: 'Dequeue (Circular)',
    complexity: 'O(1)',
    lines: [
      { text: 'int dequeue(CQueue *q) {' },
      { text: '    if (q->size == 0) {' },
      { text: '        printf("Queue Underflow!\\n");' },
      { text: '        return -1;' },
      { text: '    }' },
      { text: '    int val = q->items[q->front];' },
      { text: '    /* Wrap-around front pointer */' },
      { text: '    q->front = (q->front + 1) % MAX;', highlight: true },
      { text: '    q->size--;', highlight: true },
      { text: '    return val;' },
      { text: '}' },
      { text: '' },
      { text: '/* (front+1)%MAX wraps 5→0 in a size-6 queue */' },
      { text: '/* Time: O(1)  Space: O(1) */' },
    ],
  },

  /* ── isEmpty ── */
  is_empty: {
    title: 'isEmpty',
    complexity: 'O(1)',
    lines: [
      { text: '/* Linear Queue isEmpty */' },
      { text: 'int isEmpty(Queue *q) {' },
      { text: '    return (q->size == 0);', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* Circular Queue isEmpty */' },
      { text: 'int isEmpty(CQueue *q) {' },
      { text: '    return (q->size == 0);', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* Alternative (front == rear) works only' },
      { text: '   with sentinel conventions; size is cleaner */' },
      { text: '' },
      { text: '/* Time: O(1) */' },
    ],
  },

  /* ── isFull ── */
  is_full: {
    title: 'isFull',
    complexity: 'O(1)',
    lines: [
      { text: '/* Linear Queue isFull */' },
      { text: 'int isFull(Queue *q) {' },
      { text: '    return (q->size == MAX);', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* Circular Queue isFull */' },
      { text: 'int isFull(CQueue *q) {' },
      { text: '    return (q->size == MAX);', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* Alternative: (rear+1)%MAX == front */' },
      { text: '/* Time: O(1) */' },
    ],
  },

  /* ── Peek / Front ── */
  peek: {
    title: 'Peek / Front',
    complexity: 'O(1)',
    lines: [
      { text: 'int front(Queue *q) {' },
      { text: '    if (q->size == 0) {' },
      { text: '        printf("Queue is empty!\\n");' },
      { text: '        return -1;' },
      { text: '    }' },
      { text: '    /* Return without removing */' },
      { text: '    return q->items[q->front];', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* Does NOT modify front/rear/size */' },
      { text: '/* Time: O(1) */' },
    ],
  },

  /* ── Clear ── */
  clear: {
    title: 'Clear',
    complexity: 'O(1)',
    lines: [
      { text: 'void clear(Queue *q) {' },
      { text: '    q->front = 0;', highlight: true },
      { text: '    q->rear  = -1;', highlight: true },
      { text: '    q->size  = 0;', highlight: true },
      { text: '    /* items[] memory remains but is logically */' },
      { text: '    /* inaccessible until new enqueues happen  */' },
      { text: '}' },
      { text: '' },
      { text: '/* Time: O(1) — pointers reset, not memset */' },
    ],
  },

  /* ── Priority Enqueue ── */
  priority_enqueue: {
    title: 'Enqueue (Priority)',
    complexity: 'O(n)',
    lines: [
      { text: 'void enqueue(PQueue *q, int val, int prio) {' },
      { text: '    if (q->size == MAX) { /* overflow */ return; }' },
      { text: '    /* Find insertion point (sorted by priority) */' },
      { text: '    int i = q->size - 1;' },
      { text: '    while (i >= 0 && q->items[i].prio > prio) {', highlight: true },
      { text: '        q->items[i+1] = q->items[i];', highlight: true },
      { text: '        i--;', highlight: true },
      { text: '    }' },
      { text: '    q->items[i+1].val  = val;', highlight: true },
      { text: '    q->items[i+1].prio = prio;', highlight: true },
      { text: '    q->size++;' },
      { text: '}' },
      { text: '' },
      { text: '/* Time: O(n) due to shifting */' },
    ],
  },

  /* ── Priority Dequeue ── */
  priority_dequeue: {
    title: 'Dequeue (Priority)',
    complexity: 'O(1)',
    lines: [
      { text: 'int dequeue(PQueue *q) {' },
      { text: '    if (q->size == 0) { /* underflow */ return -1; }' },
      { text: '    /* Highest priority is always at front */' },
      { text: '    int val = q->items[0].val;', highlight: true },
      { text: '    /* Shift remaining elements left */' },
      { text: '    for (int i = 0; i < q->size-1; i++) {' },
      { text: '        q->items[i] = q->items[i+1];' },
      { text: '    }' },
      { text: '    q->size--;' },
      { text: '    return val;' },
      { text: '}' },
      { text: '' },
      { text: '/* Time: O(n) for shift, O(1) for access */' },
    ],
  },

  /* ── Deque Enqueue Front ── */
  deque_enqueue_front: {
    title: 'Deque: Enqueue Front',
    complexity: 'O(1)',
    lines: [
      { text: 'void pushFront(Deque *d, int val) {' },
      { text: '    if (d->size == MAX) { /* overflow */ return; }' },
      { text: '    /* Wrap-around: move front backward */' },
      { text: '    d->front = (d->front - 1 + MAX) % MAX;', highlight: true },
      { text: '    d->items[d->front] = val;', highlight: true },
      { text: '    d->size++;', highlight: true },
      { text: '}' },
      { text: '' },
      { text: '/* (front-1+MAX)%MAX avoids negative modulo */' },
      { text: '/* Time: O(1) */' },
    ],
  },

  /* ── Deque Dequeue Rear ── */
  deque_dequeue_rear: {
    title: 'Deque: Dequeue Rear',
    complexity: 'O(1)',
    lines: [
      { text: 'int popRear(Deque *d) {' },
      { text: '    if (d->size == 0) { /* underflow */ return -1; }' },
      { text: '    int val = d->items[d->rear];', highlight: true },
      { text: '    /* Wrap-around: move rear backward */' },
      { text: '    d->rear = (d->rear - 1 + MAX) % MAX;', highlight: true },
      { text: '    d->size--;', highlight: true },
      { text: '    return val;' },
      { text: '}' },
      { text: '' },
      { text: '/* Time: O(1) */' },
    ],
  },
};

/* ============================================================
   LINEAR QUEUE CLASS
   Simulates a simple array-backed queue where front advances
   and dequeued slots become "wasted" (not reclaimed).
============================================================ */
class LinearQueue {
  /**
   * @param {number} capacity - Maximum number of elements
   */
  constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    this._items = new Array(capacity).fill(null); // internal array
    this._front = 0;   // index of front element
    this._rear  = -1;  // index of rear element
    this._size  = 0;
    this._wasted = []; // indices that have been dequeued (gray cells)
  }

  /** Add value to rear; returns {ok, value, rearIdx} or {ok:false, err} */
  enqueue(value) {
    if (this.isFull()) return { ok: false, err: 'overflow' };
    this._rear++;
    this._items[this._rear] = value;
    this._size++;
    return { ok: true, value, rearIdx: this._rear };
  }

  /** Remove value from front; returns {ok, value, frontIdx} or {ok:false, err} */
  dequeue() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    const value = this._items[this._front];
    const frontIdx = this._front;
    this._wasted.push(this._front);
    this._items[this._front] = null;
    this._front++;
    this._size--;
    return { ok: true, value, frontIdx };
  }

  /** Peek at front without removing */
  front() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    return { ok: true, value: this._items[this._front] };
  }

  isEmpty() { return this._size === 0; }
  isFull()  { return this._rear === this.capacity - 1; }
  getSize() { return this._size; }

  /** Reset completely */
  clear() {
    this._items  = new Array(this.capacity).fill(null);
    this._front  = 0;
    this._rear   = -1;
    this._size   = 0;
    this._wasted = [];
  }

  /**
   * Returns a snapshot for the renderer.
   * cells[i]: { value, state: 'empty'|'filled'|'wasted', isFront, isRear }
   */
  getState() {
    const cells = [];
    for (let i = 0; i < this.capacity; i++) {
      let state = 'empty';
      if (this._wasted.includes(i)) state = 'wasted';
      else if (this._items[i] !== null) state = 'filled';

      cells.push({
        index:   i,
        value:   this._items[i],
        state,
        isFront: this._size > 0 && i === this._front,
        isRear:  this._size > 0 && i === this._rear,
      });
    }
    return {
      cells,
      frontIdx:  this._size > 0 ? this._front : null,
      rearIdx:   this._size > 0 ? this._rear  : null,
      size:      this._size,
      capacity:  this.capacity,
      isEmpty:   this.isEmpty(),
      isFull:    this.isFull(),
    };
  }
}

/* ============================================================
   CIRCULAR QUEUE CLASS
   Rear wraps around using (rear+1) % capacity, eliminating
   wasted space from linear queues.
============================================================ */
class CircularQueue {
  constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    this._items = new Array(capacity).fill(null);
    this._front = 0;
    this._rear  = -1;
    this._size  = 0;
  }

  enqueue(value) {
    if (this.isFull()) return { ok: false, err: 'overflow' };
    this._rear = (this._rear + 1) % this.capacity;  // wrap-around
    this._items[this._rear] = value;
    this._size++;
    return { ok: true, value, rearIdx: this._rear };
  }

  dequeue() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    const value    = this._items[this._front];
    const frontIdx = this._front;
    this._items[this._front] = null;
    this._front = (this._front + 1) % this.capacity; // wrap-around
    this._size--;
    return { ok: true, value, frontIdx };
  }

  front() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    return { ok: true, value: this._items[this._front] };
  }

  isEmpty() { return this._size === 0; }
  isFull()  { return this._size === this.capacity; }
  getSize() { return this._size; }

  clear() {
    this._items = new Array(this.capacity).fill(null);
    this._front = 0;
    this._rear  = -1;
    this._size  = 0;
  }

  getState() {
    const cells = [];
    for (let i = 0; i < this.capacity; i++) {
      cells.push({
        index:   i,
        value:   this._items[i],
        state:   this._items[i] !== null ? 'filled' : 'empty',
        isFront: this._size > 0 && i === this._front,
        isRear:  this._size > 0 && i === this._rear,
      });
    }
    return {
      cells,
      frontIdx: this._size > 0 ? this._front : null,
      rearIdx:  this._size > 0 ? this._rear  : null,
      size:     this._size,
      capacity: this.capacity,
      isEmpty:  this.isEmpty(),
      isFull:   this.isFull(),
    };
  }
}

/* ============================================================
   PRIORITY QUEUE CLASS
   Min-priority queue: lower priority number = higher priority.
   Internally sorted array — O(n) enqueue, O(1) dequeue.
============================================================ */
class PriorityQueue {
  constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    this._items = []; // [{value, priority}]
  }

  /**
   * Enqueue with optional priority. If input contains ":" parse as
   * "value:priority". Otherwise use length as default priority.
   */
  enqueue(rawValue) {
    if (this.isFull()) return { ok: false, err: 'overflow' };

    let value    = rawValue;
    let priority = this._items.length + 1; // default priority

    // Parse "value:priority" syntax
    if (typeof rawValue === 'string' && rawValue.includes(':')) {
      const parts = rawValue.split(':');
      value    = parts[0].trim();
      priority = parseInt(parts[1].trim(), 10);
      if (isNaN(priority)) priority = this._items.length + 1;
    }

    // Insert in sorted position (ascending priority number = higher priority at front)
    const item = { value, priority };
    let inserted = false;
    for (let i = 0; i < this._items.length; i++) {
      if (priority < this._items[i].priority) {
        this._items.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
    if (!inserted) this._items.push(item);

    return { ok: true, value, priority, rearIdx: this._items.length - 1 };
  }

  dequeue() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    const item = this._items.shift();
    return { ok: true, value: item.value, priority: item.priority, frontIdx: 0 };
  }

  front() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    return { ok: true, value: this._items[0].value, priority: this._items[0].priority };
  }

  isEmpty() { return this._items.length === 0; }
  isFull()  { return this._items.length === this.capacity; }
  getSize() { return this._items.length; }

  clear() { this._items = []; }

  getState() {
    const capacity = this.capacity;
    const cells = [];

    // Filled cells
    for (let i = 0; i < this._items.length; i++) {
      cells.push({
        index:   i,
        value:   `${this._items[i].value}(${this._items[i].priority})`,
        state:   'filled',
        isFront: i === 0,
        isRear:  i === this._items.length - 1,
      });
    }
    // Empty cells
    for (let i = this._items.length; i < capacity; i++) {
      cells.push({ index: i, value: null, state: 'empty', isFront: false, isRear: false });
    }

    return {
      cells,
      frontIdx: this._items.length > 0 ? 0 : null,
      rearIdx:  this._items.length > 0 ? this._items.length - 1 : null,
      size:     this._items.length,
      capacity,
      isEmpty:  this.isEmpty(),
      isFull:   this.isFull(),
    };
  }
}

/* ============================================================
   DEQUE CLASS
   Double-ended queue: enqueue/dequeue at both front AND rear.
============================================================ */
class Deque {
  constructor(capacity = DEFAULT_CAPACITY) {
    this.capacity = capacity;
    this._items = new Array(capacity).fill(null);
    this._front = 0;
    this._rear  = -1;
    this._size  = 0;
  }

  /** Enqueue at rear (standard) */
  enqueue(value) {
    if (this.isFull()) return { ok: false, err: 'overflow' };
    this._rear = (this._rear + 1) % this.capacity;
    this._items[this._rear] = value;
    this._size++;
    return { ok: true, value, rearIdx: this._rear };
  }

  /** Enqueue at front */
  enqueueFront(value) {
    if (this.isFull()) return { ok: false, err: 'overflow' };
    this._front = (this._front - 1 + this.capacity) % this.capacity;
    this._items[this._front] = value;
    this._size++;
    return { ok: true, value, frontIdx: this._front };
  }

  /** Dequeue from front (standard) */
  dequeue() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    const value    = this._items[this._front];
    const frontIdx = this._front;
    this._items[this._front] = null;
    this._front = (this._front + 1) % this.capacity;
    this._size--;
    return { ok: true, value, frontIdx };
  }

  /** Dequeue from rear */
  dequeueRear() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    const value   = this._items[this._rear];
    const rearIdx = this._rear;
    this._items[this._rear] = null;
    this._rear = (this._rear - 1 + this.capacity) % this.capacity;
    this._size--;
    return { ok: true, value, rearIdx };
  }

  front() {
    if (this.isEmpty()) return { ok: false, err: 'underflow' };
    return { ok: true, value: this._items[this._front] };
  }

  isEmpty() { return this._size === 0; }
  isFull()  { return this._size === this.capacity; }
  getSize() { return this._size; }

  clear() {
    this._items = new Array(this.capacity).fill(null);
    this._front = 0;
    this._rear  = -1;
    this._size  = 0;
  }

  getState() {
    const cells = [];
    for (let i = 0; i < this.capacity; i++) {
      cells.push({
        index:   i,
        value:   this._items[i],
        state:   this._items[i] !== null ? 'filled' : 'empty',
        isFront: this._size > 0 && i === this._front,
        isRear:  this._size > 0 && i === this._rear,
      });
    }
    return {
      cells,
      frontIdx: this._size > 0 ? this._front : null,
      rearIdx:  this._size > 0 ? this._rear  : null,
      size:     this._size,
      capacity: this.capacity,
      isEmpty:  this.isEmpty(),
      isFull:   this.isFull(),
    };
  }
}

/* ============================================================
   QUEUE RENDERER
   Handles all DOM mutations, animations, and pointer placement.
============================================================ */
class QueueRenderer {
  /**
   * @param {object} elements - Map of DOM element references
   * @param {number} animDuration - Current animation duration (ms)
   */
  constructor(elements, animDuration) {
    this.el = elements;
    this.animDuration = animDuration;
    this._logCounter  = 1;  // incrementing operation number
    this._ringVisible = true;
  }

  /* ── Cell Rendering ── */

  /**
   * Full re-render of the queue track from a state snapshot.
   * @param {object} state - from queue.getState()
   * @param {string} mode  - 'linear'|'circular'|'priority'|'deque'
   */
  renderQueue(state, mode) {
    const track    = this.el.queueTrack;
    const indexRow = this.el.indexRow;

    // Rebuild cells
    track.innerHTML    = '';
    indexRow.innerHTML = '';

    state.cells.forEach(cell => {
      const div = document.createElement('div');
      div.className = 'q-cell';
      div.dataset.idx = cell.index;

      if (cell.state === 'wasted') {
        div.classList.add('wasted');
      } else if (cell.state === 'filled') {
        div.classList.add('filled');
        div.textContent = cell.value;
      }

      if (cell.isFront && cell.state === 'filled') div.classList.add('is-front');
      if (cell.isRear  && cell.state === 'filled') div.classList.add('is-rear');

      track.appendChild(div);

      // Index label
      const lbl = document.createElement('div');
      lbl.className   = 'idx-label';
      lbl.textContent = cell.index;
      indexRow.appendChild(lbl);
    });

    // Update pointer arrows
    this._updatePointers(state);

    // Update circular ring if visible
    if (mode === 'circular' || mode === 'deque') {
      this._renderRing(state);
    }
  }

  /**
   * Animate a single enqueue: briefly adds the new cell with slide-in animation,
   * then does a full re-render.
   * @param {object} state - post-enqueue state
   * @param {number} rearIdx - the index that just received the value
   * @param {string} mode
   */
  animateEnqueue(state, rearIdx, mode) {
    // Render immediately, then apply animation to the new rear cell
    this.renderQueue(state, mode);
    const cell = this._getCellElement(rearIdx);
    if (cell) {
      cell.classList.add('anim-enqueue');
      cell.addEventListener('animationend', () => {
        cell.classList.remove('anim-enqueue');
      }, { once: true });
    }
  }

  /**
   * Animate dequeue: slide-out the front cell, wait, then re-render.
   * Returns a Promise that resolves after the animation completes.
   * @param {object} preState  - state BEFORE dequeue (for animation target)
   * @param {object} postState - state AFTER dequeue (for final render)
   * @param {number} frontIdx
   * @param {string} mode
   */
  animateDequeue(preState, postState, frontIdx, mode) {
    return new Promise(resolve => {
      // Render the pre-state so the cell is visible for animation
      this.renderQueue(preState, mode);
      const cell = this._getCellElement(frontIdx);

      if (cell) {
        cell.classList.add('anim-dequeue');
        setTimeout(() => {
          this.renderQueue(postState, mode);
          resolve();
        }, this.animDuration);
      } else {
        this.renderQueue(postState, mode);
        resolve();
      }
    });
  }

  /** Flash error animation on the entire queue track */
  flashError() {
    const track = this.el.queueTrack;
    track.classList.add('shake-error');
    track.querySelectorAll('.q-cell.filled, .q-cell.wasted').forEach(c => {
      c.classList.add('anim-error');
    });
    setTimeout(() => {
      track.classList.remove('shake-error');
      track.querySelectorAll('.anim-error').forEach(c => c.classList.remove('anim-error'));
    }, 600);
  }

  /** Pulse/highlight the front cell for peek */
  flashFront(state) {
    const cell = this._getCellElement(state.frontIdx);
    if (cell) {
      cell.classList.add('flash-highlight');
      cell.addEventListener('animationend', () => cell.classList.remove('flash-highlight'), { once: true });
    }
  }

  /* ── Pointer Positioning ── */

  /**
   * Position FRONT and REAR pointer labels above their respective cells.
   * Uses cell width + gap to compute left offset.
   */
  _updatePointers(state) {
    const CELL_W = 64;
    const GAP    = 6;
    const ptrFront = this.el.ptrFront;
    const ptrRear  = this.el.ptrRear;

    if (state.frontIdx === null || state.isEmpty) {
      ptrFront.classList.add('hidden');
    } else {
      ptrFront.classList.remove('hidden');
      const leftPx = state.frontIdx * (CELL_W + GAP);
      ptrFront.style.left = `${leftPx + CELL_W / 2 - 24}px`;
    }

    if (state.rearIdx === null || state.isEmpty) {
      ptrRear.classList.add('hidden');
    } else {
      ptrRear.classList.remove('hidden');
      const leftPx = state.rearIdx * (CELL_W + GAP);
      // If front === rear, offset the rear label slightly so they don't overlap
      const offset = (state.frontIdx === state.rearIdx) ? 28 : 0;
      ptrRear.style.left = `${leftPx + CELL_W / 2 - 24 + offset}px`;
    }
  }

  /* ── Circular Ring SVG ── */

  /**
   * Draw the circular ring view as an SVG.
   * Cells are arranged in a circle; FRONT is green, REAR is pink.
   */
  _renderRing(state) {
    const svg  = this.el.ringSvg;
    const cx   = 160, cy = 160, r = 110;
    const n    = state.capacity;
    const CELL = 38; // cell box size

    svg.innerHTML = '';

    // Background circle track
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(139,92,246,0.15)');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('stroke-dasharray', '4 6');
    svg.appendChild(circle);

    state.cells.forEach((cell, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x     = cx + r * Math.cos(angle);
      const y     = cy + r * Math.sin(angle);

      // Cell rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x',  x - CELL / 2);
      rect.setAttribute('y',  y - CELL / 2);
      rect.setAttribute('width',  CELL);
      rect.setAttribute('height', CELL);
      rect.setAttribute('rx', 6);

      if (cell.state === 'filled') {
        rect.setAttribute('fill', 'rgba(139,92,246,0.22)');
        rect.setAttribute('stroke', cell.isFront ? '#34d399' : cell.isRear ? '#f472b6' : 'rgba(139,92,246,0.45)');
        rect.setAttribute('stroke-width', cell.isFront || cell.isRear ? '2.5' : '1.5');
      } else {
        rect.setAttribute('fill', 'rgba(255,255,255,0.04)');
        rect.setAttribute('stroke', 'rgba(255,255,255,0.08)');
        rect.setAttribute('stroke-width', '1');
      }
      svg.appendChild(rect);

      // Cell value text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 1);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', cell.state === 'filled' ? '#f1f0ff' : 'rgba(255,255,255,0.15)');
      text.textContent = cell.state === 'filled' ? cell.value : '—';
      svg.appendChild(text);

      // Index label
      const idxR    = r + 30;
      const idxText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      idxText.setAttribute('x', cx + idxR * Math.cos(angle));
      idxText.setAttribute('y', cy + idxR * Math.sin(angle));
      idxText.setAttribute('text-anchor', 'middle');
      idxText.setAttribute('dominant-baseline', 'middle');
      idxText.setAttribute('font-size', '9');
      idxText.setAttribute('fill', 'rgba(160,160,192,0.6)');
      idxText.textContent = i;
      svg.appendChild(idxText);

      // FRONT / REAR labels near cell
      if (cell.isFront && !state.isEmpty) {
        this._addRingLabel(svg, x, y - CELL / 2 - 14, 'F', '#34d399');
      }
      if (cell.isRear && !state.isEmpty) {
        const yOff = cell.isFront ? CELL / 2 + 14 : -(CELL / 2) - 14;
        this._addRingLabel(svg, x, y + yOff, 'R', '#f472b6');
      }
    });

    // Center label
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', cx);
    centerText.setAttribute('y', cy - 8);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('font-size', '10');
    centerText.setAttribute('fill', 'rgba(160,160,192,0.5)');
    centerText.textContent = `${state.size}/${state.capacity}`;
    svg.appendChild(centerText);

    const centerSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerSub.setAttribute('x', cx);
    centerSub.setAttribute('y', cy + 8);
    centerSub.setAttribute('text-anchor', 'middle');
    centerSub.setAttribute('font-size', '8');
    centerSub.setAttribute('fill', 'rgba(139,92,246,0.6)');
    centerSub.textContent = 'Circular';
    svg.appendChild(centerSub);
  }

  _addRingLabel(svg, x, y, label, color) {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('font-size', '9');
    t.setAttribute('font-weight', '700');
    t.setAttribute('fill', color);
    t.textContent = label;
    svg.appendChild(t);
  }

  /* ── Live Info Panel ── */

  /** Update all values in the info panel */
  updateInfo(state) {
    const fmt = v => (v === null ? '—' : String(v));

    this._setInfoVal('info-front',    fmt(state.frontIdx));
    this._setInfoVal('info-rear',     fmt(state.rearIdx));
    this._setInfoVal('info-size',     state.size);
    this._setInfoVal('info-capacity', state.capacity);
    this._updateBoolBadge('info-isempty', state.isEmpty);
    this._updateBoolBadge('info-isfull',  state.isFull);
  }

  _setInfoVal(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== String(value)) {
      el.textContent = value;
      el.classList.remove('updated');
      void el.offsetWidth; // reflow to restart animation
      el.classList.add('updated');
      setTimeout(() => el.classList.remove('updated'), 500);
    }
  }

  _updateBoolBadge(id, bool) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = bool ? 'true' : 'false';
    el.classList.toggle('is-true',  bool);
    el.classList.toggle('is-false', !bool);
  }

  /* ── Message Banner ── */

  /**
   * Show inline message banner.
   * @param {string} text
   * @param {'error'|'success'|'warning'|'info'} type
   * @param {number} [duration=2800] - ms before auto-hide
   */
  showMessage(text, type = 'info', duration = 2800) {
    const banner = this.el.messageBanner;
    banner.textContent  = text;
    banner.className    = `message-banner ${type}`;
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => {
      banner.className = 'message-banner hidden';
    }, duration);
  }

  /* ── Operation Log ── */

  /**
   * Prepend a log entry.
   * @param {string} text
   * @param {string} type - CSS modifier class suffix
   */
  log(text, type = 'info') {
    const list = this.el.opLog;
    const li   = document.createElement('li');
    li.className   = `log-entry log-${type} new`;
    li.innerHTML   = `<span class="log-num">#${this._logCounter++}</span>${text}`;
    list.prepend(li);
    setTimeout(() => li.classList.remove('new'), 300);
  }

  clearLog() {
    this.el.opLog.innerHTML = '';
    this._logCounter = 1;
  }

  /* ── C Code Panel ── */

  /**
   * Update the code panel with a snippet key.
   * @param {string} key - key into C_CODE object
   */
  showCode(key) {
    const snippet = C_CODE[key] || C_CODE.default;
    const badge   = document.getElementById('op-name-badge');
    const complex  = document.getElementById('complexity-badge');
    const content  = document.getElementById('code-content');

    if (badge)   badge.textContent   = snippet.title;
    if (complex) complex.textContent = snippet.complexity;

    if (content) {
      content.innerHTML = snippet.lines
        .map(line => {
          const escaped = this._escapeHtml(line.text);
          const highlighted = this._syntaxHighlight(escaped);
          if (line.highlight) {
            return `<span class="code-highlight">${highlighted}</span>`;
          }
          return highlighted;
        })
        .join('\n');
    }
  }

  /** Minimal C syntax highlighting */
  _syntaxHighlight(code) {
    return code
      // C keywords
      .replace(/\b(int|void|return|if|while|for|typedef|struct|printf|define|else)\b/g,
               '<span class="c-keyword">$1</span>')
      // Preprocessor
      .replace(/(#\w+)/g, '<span class="c-keyword">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="c-number">$1</span>')
      // Comments
      .replace(/(\/\*[\s\S]*?\*\/|\/\/.*)/g, '<span class="c-comment">$1</span>')
      // Strings
      .replace(/"([^"]*)"/g, '<span class="c-string">"$1"</span>');
  }

  _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── Helpers ── */

  _getCellElement(idx) {
    return this.el.queueTrack.querySelector(`.q-cell[data-idx="${idx}"]`);
  }
}

/* ============================================================
   APP CLASS
   Wires together queues, renderer, and all UI events.
============================================================ */
class App {
  constructor() {
    // DOM element references
    this.el = {
      queueTrack:     document.getElementById('queue-track'),
      indexRow:       document.getElementById('index-row'),
      pointerRow:     document.getElementById('pointer-row'),
      ptrFront:       document.getElementById('ptr-front'),
      ptrRear:        document.getElementById('ptr-rear'),
      messageBanner:  document.getElementById('message-banner'),
      opLog:          document.getElementById('op-log'),
      ringSvg:        document.getElementById('ring-svg'),
      circularWrapper:document.getElementById('circular-ring-wrapper'),
      ringToggleBtn:  document.getElementById('ring-toggle-btn'),

      enqueueInput:   document.getElementById('enqueue-input'),
      dequeFrontInput:document.getElementById('deque-front-input'),
      capacityInput:  document.getElementById('capacity-input'),
      speedSlider:    document.getElementById('speed-slider'),

      btnEnqueue:     document.getElementById('btn-enqueue'),
      btnEnqueueFront:document.getElementById('btn-enqueue-front'),
      btnDequeue:     document.getElementById('btn-dequeue'),
      btnDequeueRear: document.getElementById('btn-dequeue-rear'),
      btnFront:       document.getElementById('btn-front'),
      btnIsEmpty:     document.getElementById('btn-isempty'),
      btnIsFull:      document.getElementById('btn-isfull'),
      btnClear:       document.getElementById('btn-clear'),
      btnSetCapacity: document.getElementById('btn-set-capacity'),
      btnClearLog:    document.getElementById('btn-clear-log'),

      modeTabs:       document.querySelectorAll('.tab-btn'),
      vizTitle:       document.getElementById('viz-title'),
      modeBadge:      document.getElementById('mode-badge'),

      dequeOnlyEls:   document.querySelectorAll('.deque-only'),
    };

    this.mode         = 'linear';
    this.capacity     = DEFAULT_CAPACITY;
    this.animDuration = ANIM_SPEEDS[2]; // medium speed
    this._busy        = false;          // prevent overlapping animations

    // Instantiate queues for each mode
    this._queues = {
      linear:   new LinearQueue(this.capacity),
      circular: new CircularQueue(this.capacity),
      priority: new PriorityQueue(this.capacity),
      deque:    new Deque(this.capacity),
    };

    // Renderer
    this.renderer = new QueueRenderer(this.el, this.animDuration);

    this._bindEvents();
    this._applyMode('linear');
    this._fullRender();
    this.renderer.showCode('default');
  }

  /* ── Active queue accessor ── */
  get queue() { return this._queues[this.mode]; }

  /* ── Event Binding ── */

  _bindEvents() {
    // Mode tabs
    this.el.modeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.dataset.mode;
        this.el.modeTabs.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this._applyMode(m);
        this._fullRender();
        this.renderer.showCode('default');
        this.renderer.log(`Switched to ${m} queue mode`, 'info');
      });
    });

    // Enqueue (rear)
    this.el.btnEnqueue.addEventListener('click', () => this._opEnqueue());
    this.el.enqueueInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._opEnqueue();
    });

    // Enqueue front (deque)
    this.el.btnEnqueueFront.addEventListener('click', () => this._opEnqueueFront());
    this.el.dequeFrontInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._opEnqueueFront();
    });

    // Dequeue (front)
    this.el.btnDequeue.addEventListener('click', () => this._opDequeue());

    // Dequeue rear (deque)
    this.el.btnDequeueRear.addEventListener('click', () => this._opDequeueRear());

    // Peek / Front
    this.el.btnFront.addEventListener('click', () => this._opFront());

    // isEmpty
    this.el.btnIsEmpty.addEventListener('click', () => this._opIsEmpty());

    // isFull
    this.el.btnIsFull.addEventListener('click', () => this._opIsFull());

    // Clear queue
    this.el.btnClear.addEventListener('click', () => this._opClear());

    // Set capacity
    this.el.btnSetCapacity.addEventListener('click', () => this._opSetCapacity());
    this.el.capacityInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._opSetCapacity();
    });

    // Clear log
    this.el.btnClearLog.addEventListener('click', () => {
      this.renderer.clearLog();
    });

    // Speed slider
    this.el.speedSlider.addEventListener('input', () => {
      const speed = parseInt(this.el.speedSlider.value, 10);
      this.animDuration = ANIM_SPEEDS[speed] || 400;
      this.renderer.animDuration = this.animDuration;
      // Update CSS variable for animations
      document.documentElement.style.setProperty('--anim-duration', `${this.animDuration}ms`);
    });

    // Ring toggle
    this.el.ringToggleBtn.addEventListener('click', () => {
      const svg = this.el.ringSvg.closest('.circular-ring-container');
      const btn = this.el.ringToggleBtn;
      const hidden = svg.style.display === 'none';
      svg.style.display = hidden ? '' : 'none';
      btn.textContent   = hidden ? 'Hide Ring' : 'Show Ring';
    });
  }

  /* ── Mode Application ── */

  _applyMode(mode) {
    this.mode = mode;

    const titles = {
      linear:   'Linear Queue Visualization',
      circular: 'Circular Queue Visualization',
      priority: 'Priority Queue Visualization',
      deque:    'Deque (Double-Ended) Visualization',
    };

    const badges = {
      linear:   'Linear',
      circular: 'Circular',
      priority: 'Priority',
      deque:    'Deque',
    };

    this.el.vizTitle.textContent  = titles[mode]  || 'Queue Visualization';
    this.el.modeBadge.textContent = badges[mode]  || mode;

    // Show/hide circular ring
    if (mode === 'circular' || mode === 'deque') {
      this.el.circularWrapper.classList.remove('hidden');
    } else {
      this.el.circularWrapper.classList.add('hidden');
    }

    // Show/hide deque-only controls
    this.el.dequeOnlyEls.forEach(el => {
      if (mode === 'deque') el.classList.remove('hidden');
      else                  el.classList.add('hidden');
    });

    // Update placeholder hint for priority queue
    if (mode === 'priority') {
      this.el.enqueueInput.placeholder = 'value or value:priority';
    } else {
      this.el.enqueueInput.placeholder = 'Enter value…';
    }
  }

  /* ── Full Re-render ── */

  _fullRender() {
    const state = this.queue.getState();
    this.renderer.renderQueue(state, this.mode);
    this.renderer.updateInfo(state);
  }

  /* ── Operations ── */

  /** Enqueue at rear */
  async _opEnqueue() {
    if (this._busy) return;
    const raw = this.el.enqueueInput.value.trim();

    // Validate input
    if (!raw) {
      this.renderer.showMessage('⚠ Please enter a value to enqueue.', 'error');
      this.renderer.flashError();
      this.el.enqueueInput.focus();
      return;
    }

    const result = this.queue.enqueue(raw);

    if (!result.ok) {
      // Overflow
      this.renderer.showMessage('🚫 Queue Overflow! The queue is full.', 'error');
      this.renderer.flashError();
      this.renderer.log(`Overflow — cannot enqueue "${raw}" (queue full)`, 'error');
      this._showCodeForCurrentMode('enqueue');
      return;
    }

    this.el.enqueueInput.value = '';
    this._busy = true;

    const state = this.queue.getState();
    this.renderer.animateEnqueue(state, result.rearIdx, this.mode);
    this.renderer.updateInfo(state);
    this.renderer.showMessage(`✓ Enqueued "${raw}" → rear = ${result.rearIdx}`, 'success');
    this.renderer.log(`Enqueued <b>${raw}</b> → rear = ${result.rearIdx}`, 'enqueue');
    this._showCodeForCurrentMode('enqueue');

    setTimeout(() => { this._busy = false; }, this.animDuration + 50);
  }

  /** Enqueue at front (deque only) */
  async _opEnqueueFront() {
    if (this._busy || this.mode !== 'deque') return;
    const raw = this.el.dequeFrontInput.value.trim();

    if (!raw) {
      this.renderer.showMessage('⚠ Please enter a value to enqueue at front.', 'error');
      this.renderer.flashError();
      return;
    }

    const result = this.queue.enqueueFront(raw);

    if (!result.ok) {
      this.renderer.showMessage('🚫 Queue Overflow! The deque is full.', 'error');
      this.renderer.flashError();
      this.renderer.log(`Overflow — cannot enqueue-front "${raw}" (deque full)`, 'error');
      this.renderer.showCode('deque_enqueue_front');
      return;
    }

    this.el.dequeFrontInput.value = '';
    this._busy = true;

    const state = this.queue.getState();
    this.renderer.animateEnqueue(state, result.frontIdx, this.mode);
    this.renderer.updateInfo(state);
    this.renderer.showMessage(`✓ Enqueued "${raw}" at front = ${result.frontIdx}`, 'success');
    this.renderer.log(`Enqueue-Front <b>${raw}</b> → front = ${result.frontIdx}`, 'enqueue');
    this.renderer.showCode('deque_enqueue_front');

    setTimeout(() => { this._busy = false; }, this.animDuration + 50);
  }

  /** Dequeue from front */
  async _opDequeue() {
    if (this._busy) return;

    // Capture state BEFORE dequeue for animation
    const preState = JSON.parse(JSON.stringify(this.queue.getState()));
    const result   = this.queue.dequeue();

    if (!result.ok) {
      this.renderer.showMessage('⚠ Queue Underflow! The queue is empty.', 'error');
      this.renderer.flashError();
      this.renderer.log(`Underflow — queue is empty (cannot dequeue)`, 'error');
      this._showCodeForCurrentMode('dequeue');
      return;
    }

    this._busy = true;
    this._showCodeForCurrentMode('dequeue');

    const postState = this.queue.getState();
    await this.renderer.animateDequeue(preState, postState, result.frontIdx, this.mode);
    this.renderer.updateInfo(postState);
    this.renderer.showMessage(`✓ Dequeued "${result.value}" ← front was ${result.frontIdx}`, 'success');
    this.renderer.log(`Dequeued <b>${result.value}</b> ← front was ${result.frontIdx}`, 'dequeue');

    this._busy = false;
  }

  /** Dequeue from rear (deque only) */
  async _opDequeueRear() {
    if (this._busy || this.mode !== 'deque') return;

    const preState = JSON.parse(JSON.stringify(this.queue.getState()));
    const result   = this.queue.dequeueRear();

    if (!result.ok) {
      this.renderer.showMessage('⚠ Deque Underflow! The deque is empty.', 'error');
      this.renderer.flashError();
      this.renderer.log(`Underflow — deque is empty (cannot dequeue-rear)`, 'error');
      this.renderer.showCode('deque_dequeue_rear');
      return;
    }

    this._busy = true;
    this.renderer.showCode('deque_dequeue_rear');

    const postState = this.queue.getState();
    await this.renderer.animateDequeue(preState, postState, result.rearIdx, this.mode);
    this.renderer.updateInfo(postState);
    this.renderer.showMessage(`✓ Dequeued Rear "${result.value}" ← rear was ${result.rearIdx}`, 'success');
    this.renderer.log(`Dequeue-Rear <b>${result.value}</b> ← rear was ${result.rearIdx}`, 'dequeue');

    this._busy = false;
  }

  /** Peek at front element */
  _opFront() {
    const result = this.queue.front();
    this.renderer.showCode('peek');

    if (!result.ok) {
      this.renderer.showMessage('⚠ Queue Underflow! The queue is empty — nothing to peek.', 'error');
      this.renderer.flashError();
      this.renderer.log(`Peek — queue is empty`, 'error');
      return;
    }

    const state = this.queue.getState();
    this.renderer.flashFront(state);
    this.renderer.showMessage(`👁 Front / Peek → "${result.value}"`, 'info', 3000);
    this.renderer.log(`Peek → <b>${result.value}</b> (front unchanged)`, 'peek');
  }

  /** Check isEmpty */
  _opIsEmpty() {
    const empty  = this.queue.isEmpty();
    const result = empty ? 'YES — Queue is empty' : 'NO — Queue has elements';
    this.renderer.showCode('is_empty');
    this.renderer.showMessage(`isEmpty → ${empty}`, empty ? 'warning' : 'info', 2500);
    this.renderer.log(`isEmpty → <b>${empty}</b> (${result})`, 'success');
  }

  /** Check isFull */
  _opIsFull() {
    const full   = this.queue.isFull();
    const result = full ? 'YES — Queue is full' : 'NO — Queue has space';
    this.renderer.showCode('is_full');
    this.renderer.showMessage(`isFull → ${full}`, full ? 'warning' : 'info', 2500);
    this.renderer.log(`isFull → <b>${full}</b> (${result})`, full ? 'error' : 'success');
  }

  /** Clear the queue */
  _opClear() {
    this.queue.clear();
    const state = this.queue.getState();
    this.renderer.renderQueue(state, this.mode);
    this.renderer.updateInfo(state);
    this.renderer.showCode('clear');
    this.renderer.showMessage('✕ Queue cleared.', 'warning', 2000);
    this.renderer.log(`Queue cleared — all elements removed`, 'clear');
  }

  /** Change capacity */
  _opSetCapacity() {
    let cap = parseInt(this.el.capacityInput.value, 10);
    if (isNaN(cap) || cap < MIN_CAPACITY || cap > MAX_CAPACITY) {
      this.renderer.showMessage(`⚠ Capacity must be between ${MIN_CAPACITY} and ${MAX_CAPACITY}.`, 'error');
      this.el.capacityInput.value = this.capacity;
      return;
    }

    this.capacity = cap;

    // Rebuild all queues with new capacity
    this._queues = {
      linear:   new LinearQueue(cap),
      circular: new CircularQueue(cap),
      priority: new PriorityQueue(cap),
      deque:    new Deque(cap),
    };

    this._fullRender();
    this.renderer.showMessage(`✓ Capacity set to ${cap}. Queue has been reset.`, 'success');
    this.renderer.log(`Capacity changed to <b>${cap}</b> — all queues reset`, 'info');
  }

  /* ── Code Display Routing ── */

  _showCodeForCurrentMode(op) {
    const key = `${this.mode === 'deque' ? 'circular' : this.mode}_${op}`;
    if (C_CODE[key]) {
      this.renderer.showCode(key);
    } else if (C_CODE[`linear_${op}`]) {
      this.renderer.showCode(`linear_${op}`);
    }
  }
}

/* ============================================================
   BOOTSTRAP — wait for DOM, then instantiate App
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
