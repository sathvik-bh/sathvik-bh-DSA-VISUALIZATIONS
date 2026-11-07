# Queue Visualizer

A modern, interactive single-page web app that visualizes queue data structures with animations, a live info panel, an operation log, and C implementation code snippets.

---

## Features

### Queue Modes
| Mode | Description |
|------|-------------|
| **Linear Queue** | Classic FIFO queue; dequeued slots show as grayed-out "wasted space" cells |
| **Circular Queue** | Rear wraps using `(rear+1) % capacity`; includes a circular ring SVG view |
| **Priority Queue** | Min-priority queue sorted on insert; supports `value:priority` syntax |
| **Deque** | Double-ended queue; enqueue/dequeue at both front and rear |

### Operations
- **Enqueue** — adds a value at the rear (or front for Deque)
- **Dequeue** — removes from the front (or rear for Deque)
- **Peek / Front** — reads front element without removing it
- **isEmpty** — checks if queue has no elements
- **isFull** — checks if queue is at capacity
- **Clear** — resets the queue

### Visualization
- Horizontal cell boxes with FRONT (🟢) and REAR (🩷) pointer arrows
- Smooth slide-in (enqueue) and slide-out (dequeue) CSS animations
- Circular ring SVG view for Circular Queue and Deque modes
- Shake + red flash animation for overflow / underflow errors
- Animation speed slider (Slow / Medium / Fast)

### Info & Logging
- **Live Info Panel** — real-time: front index, rear index, size, capacity, isEmpty, isFull
- **Operation Log** — chronological list of every operation with number prefix
- **C Code Panel** — shows the C implementation of the *current* operation with syntax highlighting and time complexity

---

## Getting Started

1. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari)
2. No server, build tools, npm, or internet required (except Google Fonts CDN for typefaces)

```
QUEUE/
├── index.html   ← HTML structure and layout
├── style.css    ← All styles (dark theme, glassmorphism, animations)
├── script.js    ← All logic (Queue classes + Renderer + App)
└── README.md    ← This file
```

---

## How to Use

### Basic Flow
1. Select a **mode tab** at the top (Linear, Circular, Priority, Deque)
2. Optionally change the **Capacity** (3–10) and click **Set**
3. Type a value in the input field and click **Enqueue** (or press Enter)
4. Click **Dequeue**, **Peek Front**, **isEmpty**, **isFull**, or **Clear**
5. Watch the visualization, Live Info panel, log, and C code update in real time

### Priority Queue Syntax
Enter values as `value:priority` to specify a priority number (lower = higher priority):
```
Apple:1    ← highest priority
Banana:3
Cherry:2
```
Or just type `value` and the priority is auto-assigned.

### Animation Speed
Use the slider in the controls area:
- **Slow** — 700 ms (great for demos)
- **Medium** — 400 ms (default)
- **Fast** — 180 ms (quick testing)

---

## Code Architecture

```
script.js
├── LinearQueue    — Array-backed linear queue (front advances, wasted slots)
├── CircularQueue  — Circular queue using (rear+1) % capacity wrap-around
├── PriorityQueue  — Sorted array, min-priority at front (O(n) enqueue, O(1) dequeue)
├── Deque          — Double-ended circular queue
├── QueueRenderer  — All DOM updates, animations, SVG ring, log, code panel
└── App            — Event binding, operation dispatch, mode switching
```

All queue classes expose the same interface:
```js
enqueue(value)  → { ok, value, rearIdx }  | { ok: false, err: 'overflow' }
dequeue()       → { ok, value, frontIdx } | { ok: false, err: 'underflow' }
front()         → { ok, value }           | { ok: false, err: 'underflow' }
isEmpty()       → boolean
isFull()        → boolean
getSize()       → number
clear()         → void
getState()      → { cells[], frontIdx, rearIdx, size, capacity, isEmpty, isFull }
```

---

## Mental Test Verification

| # | Test | Expected |
|---|------|----------|
| 1 | Linear: enqueue 6 items | Fills all cells; REAR at index 5 |
| 2 | Linear: enqueue 7th | Overflow message + shake animation |
| 3 | Linear: dequeue 2 | Cells 0 & 1 turn gray (wasted space) |
| 4 | Linear: dequeue until empty | Underflow on next dequeue |
| 5 | Circular: enqueue 6, dequeue 2, enqueue 2 | REAR wraps to index 0 & 1; ring view shows wrap |
| 6 | Peek on non-empty queue | Front cell pulses; value shown in banner |
| 7 | Peek on empty queue | Underflow message + shake |
| 8 | Clear | All cells reset to empty |
| 9 | Capacity change | Queue resets; new cell count rendered |
| 10| Speed slider | Animation duration visibly changes |

---

## Design

- **Background**: Deep dark `#0f0f1a` with violet radial gradients
- **Cards**: Glassmorphism (`backdrop-filter: blur(16px)`) with semi-transparent borders
- **Accent**: Violet/purple (`#8b5cf6`, `#a78bfa`)
- **FRONT pointer**: Emerald green `#34d399`
- **REAR pointer**: Pink `#f472b6`
- **Fonts**: Inter / Poppins (UI), JetBrains Mono (code panel)
- **Fully responsive** down to 720 px

---

## Browser Compatibility

Works in any modern browser supporting:
- CSS `backdrop-filter` (Chrome 76+, Firefox 103+, Edge 79+, Safari 9+)
- CSS Custom Properties
- ES6 classes, async/await, `const`/`let`

---

*Built with pure HTML, CSS, and JavaScript — no frameworks, no npm, no build tools.*
