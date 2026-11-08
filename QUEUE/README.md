# 🔄 Queue Visualizer

An interactive, animated **Queue Data Structure Visualizer** built using HTML5, CSS3, and Vanilla JavaScript.

This web application helps users understand different types of queues through real-time visualizations, animations, operation logs, and equivalent C implementation code snippets.

It supports four different queue variations, providing a practical way to explore their working principles and operations.

---

## 🚀 Features

### 1. Queue Modes

The application supports four types of queues:

| Queue Type | Description |
|---|---|
| Linear Queue | Implements the traditional FIFO principle. Dequeued positions appear as wasted spaces. |
| Circular Queue | Uses circular indexing to reuse empty positions through wrap-around functionality. |
| Priority Queue | Arranges elements according to priority, with lower priority numbers receiving higher priority. |
| Deque | A Double-Ended Queue that supports insertion and deletion from both ends. |

### 2. Supported Operations

- **Enqueue:** Inserts an element into the queue.
- **Dequeue:** Removes an element from the queue.
- **Peek / Front:** Displays the front element without removing it.
- **isEmpty:** Checks whether the queue contains elements.
- **isFull:** Checks whether the queue has reached its maximum capacity.
- **Clear:** Removes all elements and resets the queue.

### 3. Interactive Visualization

- Horizontal queue representation using individual element cells.
- FRONT and REAR pointer indicators.
- Smooth enqueue and dequeue animations.
- Circular SVG visualization for Circular Queue and Deque modes.
- Overflow and underflow detection with visual feedback.
- Adjustable animation speed.

### 4. Information and Logging

- **Live Information Panel:** Displays front index, rear index, current size, capacity, isEmpty, and isFull.
- **Operation Log:** Maintains a chronological history of performed operations.
- **C Code Panel:** Displays the equivalent C implementation of the currently selected operation with syntax highlighting and time complexity information.

---

## 💻 Getting Started

### Prerequisites

- A modern web browser.
- No additional frameworks, build tools, or npm installation required.

### How to Run

1. Clone or download the repository.
2. Navigate to the `Queue` folder.
3. Open `index.html` in your preferred browser.

Alternatively, use the Live Server extension in Visual Studio Code.

**Supported Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari.

---

## 📖 How to Use

### Basic Workflow

1. Select a queue mode: Linear, Circular, Priority, or Deque.
2. Adjust the queue capacity between 3 and 10 if required.
3. Enter a value in the input field.
4. Click **Enqueue** or press Enter to insert an element.
5. Use **Dequeue** to remove an element.
6. Use **Peek Front** to view the front element.
7. Explore the isEmpty, isFull, and Clear operations.
8. Observe how the visualization, information panel, operation log, and C code panel update.

### Priority Queue Input

Priority Queue supports the following input format:

```text
Apple:1
Banana:3
Cherry:2
```

Lower priority numbers indicate higher priority.

Values can also be entered without an explicitly specified priority, in which case the application automatically assigns one.

### Animation Speed

The application provides three animation speed settings:

| Speed | Duration | Purpose |
|---|---|---|
| Slow | 700 ms | Useful for demonstrations and learning. |
| Medium | 400 ms | Default animation speed. |
| Fast | 180 ms | Useful for quick testing. |

---

## 🧠 Code Architecture

The JavaScript implementation is organized into separate classes.

```text
script.js
│
├── LinearQueue
│   └── Array-based linear queue implementation
│
├── CircularQueue
│   └── Circular indexing and wrap-around logic
│
├── PriorityQueue
│   └── Priority-based sorted queue implementation
│
├── Deque
│   └── Double-ended queue implementation
│
├── QueueRenderer
│   └── DOM rendering, animations, SVG, logs, and code panel
│
└── App
    └── Event handling, operation dispatch, and mode switching
```

### Common Queue Interface

The queue implementations expose a common set of methods:

| Method | Purpose |
|---|---|
| enqueue(value) | Inserts an element. |
| dequeue() | Removes an element. |
| front() | Returns the front element. |
| isEmpty() | Checks whether the queue is empty. |
| isFull() | Checks whether the queue is full. |
| getSize() | Returns the current number of elements. |
| clear() | Resets the queue. |
| getState() | Returns the current queue state. |

The operations return status information that allows the application to handle successful operations, overflow, and underflow conditions.

---

## 📊 Time Complexity Analysis

The following table describes the standard expected complexities of the underlying implementations.

| Operation | Linear Queue | Circular Queue | Priority Queue | Deque |
|---|---|---|---|---|
| Enqueue | O(1) | O(1) | O(n) | O(1) |
| Dequeue | O(1) | O(1) | O(1) | O(1) |
| Peek Front | O(1) | O(1) | O(1) | O(1) |
| isEmpty | O(1) | O(1) | O(1) | O(1) |
| isFull | O(1) | O(1) | O(1) | O(1) |

*Complexities assume the implementations use the corresponding array-based operations described in the project architecture. Priority Queue insertion requires O(n) because elements are maintained in sorted order.*

**Space Complexity:** O(N), where N represents the queue's maximum capacity.

---

## 🧪 Testing and Verification

The application has a set of manual test scenarios covering its major functionalities.

| Test | Expected Result |
|---|---|
| Insert elements until capacity is reached | All queue positions are occupied. |
| Insert an additional element | Overflow notification is displayed. |
| Remove elements from a Linear Queue | Removed positions appear as wasted spaces. |
| Remove elements until the queue is empty | Underflow is detected on the next removal. |
| Test Circular Queue wrap-around | REAR pointer moves back to available positions. |
| Peek on a non-empty queue | Front element is highlighted. |
| Peek on an empty queue | Underflow notification is displayed. |
| Clear the queue | All positions are reset. |
| Change queue capacity | Queue is reset and new capacity is rendered. |
| Adjust animation speed | Animation duration changes accordingly. |

---

## 📁 Project Structure

```text
Queue/
│
├── index.html       # Application structure
├── style.css        # Styling, animations, and responsive layout
├── script.js        # Queue implementations and application logic
└── README.md        # Project documentation
```

---

## 🎨 Design System

The application uses a modern dark-themed interface with violet accents and glassmorphism styling.

| Element | Design Specification |
|---|---|
| Background | Deep dark background (`#0f0f1a`) with violet radial gradients |
| Primary Accent | Violet (`#8b5cf6`) |
| Secondary Accent | Light Violet (`#a78bfa`) |
| FRONT Pointer | Emerald Green (`#34d399`) |
| REAR Pointer | Pink (`#f472b6`) |
| Cards | Glassmorphism with blurred backgrounds |
| Fonts | Inter, Poppins, and JetBrains Mono |
| Responsiveness | Supports layouts down to 720px |

---

## 🌐 Browser Compatibility

Designed for modern browsers supporting:

- CSS Custom Properties.
- CSS `backdrop-filter`.
- ES6 JavaScript classes.
- Async/await.
- Modern DOM APIs.

---

## 🎯 Learning Objectives

This visualizer helps learners:

- Understand the FIFO principle.
- Differentiate between Linear and Circular Queues.
- Understand Priority Queue operations.
- Explore Double-Ended Queues.
- Visualize insertion and deletion operations.
- Understand queue overflow and underflow.
- Compare the time complexities of different queue implementations.

---

## 👨‍💻 Project Information

**Project:** DSA Visualizer  
**Module:** Queue Visualizer  
**Category:** Data Structures and Algorithms  
**Technologies:** HTML5, CSS3, JavaScript

---

⭐ If you find this project useful, consider giving the repository a star!

**Learn. Visualize. Understand.**

## 📸 Project Screenshots

### 1. Stack Visualizer
![Stack Visualizer](screenshots/stack.png)

### 2. Queue Visualizer
![Queue Visualizer](screenshots/queue.png)

### 3. Singly Linked List Visualizer
![Singly Linked List](screenshots/singly-linked-list.png)

### 4. Tower of Hanoi 3D
![Tower of Hanoi](screenshots/tower-of-hanoi.png)