# Stack Visualizer

An interactive, animated **Stack data structure visualizer** built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no dependencies. Just open `index.html` in any modern browser.

---

## 🚀 How to Run

1. Download or clone this folder.
2. **Double-click `index.html`** — that's it!

> Works in Chrome, Firefox, Edge, and Safari. No server required.

---

## 📋 Operations

| Operation | Description | Time Complexity |
|-----------|-------------|-----------------|
| **Push**    | Adds a value on top of the stack. Shows overflow error if full. | O(1) |
| **Pop**     | Removes and returns the top value. Shows underflow error if empty. | O(1) |
| **Peek**    | Returns the top value without removing it. | O(1) |
| **isEmpty** | Returns `true` if the stack has no elements, `false` otherwise. | O(1) |
| **isFull**  | Returns `true` if the stack has reached its max capacity, `false` otherwise. | O(1) |
| **Clear**   | Resets the stack, removing all elements instantly. | O(1) |

---

## ✨ Features

- **Animated Stack** — smooth push (slide-in), pop (lift-out), and peek (pulse glow) animations
- **Overflow / Underflow detection** — shake animation, red border flash, and toast notification
- **Adjustable capacity** (3–10) — resize the stack on the fly with a reset warning
- **Animation speed control** — slider from 0.2s (fast) to 1.5s (slow)
- **Live info panel** — real-time size, capacity, top index, isEmpty, and isFull stats
- **Operation log** — scrollable history of the last 50 operations with color-coded entries
- **C code panel** — every operation displays its equivalent C implementation with syntax highlighting
- **Toast notifications** — slide-in/out toasts for overflow, underflow, and capacity changes
- **Glassmorphism dark UI** — teal accent color on a deep dark background
- **Fully responsive** — 3-column desktop layout, stacked on tablet/mobile

---

## 🛠️ Tech Stack

| Technology | Details |
|------------|---------|
| **HTML5**      | Semantic structure, ARIA labels, no dependencies |
| **CSS3**       | CSS custom properties, keyframe animations, `backdrop-filter`, CSS Grid, Flexbox |
| **Vanilla JS** | ES6 classes (`Stack`, `StackUI`), DOM manipulation, event listeners, no libraries |
| **Google Fonts** | Inter, Poppins (UI), JetBrains Mono (code) — loaded from CDN |

---

## 📁 File Structure

```
STACK/
├── index.html   ← Main HTML page
├── style.css    ← All styles, animations, and responsive layout
├── script.js    ← Stack logic, UI rendering, toast system
└── README.md    ← This file
```

---

## 🎨 Design System

- **Background**: `linear-gradient(135deg, #0a0a0f → #0d1117 → #0a0f0a)`
- **Accent**: `#00d4aa` (teal/cyan)
- **Danger**: `#ff4444` | **Warning**: `#ffaa00` | **Info**: `#4488ff`
- **Cards**: `rgba(255,255,255,0.05)` + `backdrop-filter: blur(10px)`
- **Radius**: 12px cards, 8px buttons/inputs

---

*Built as an educational tool to visualize LIFO (Last In, First Out) stack behavior.*
