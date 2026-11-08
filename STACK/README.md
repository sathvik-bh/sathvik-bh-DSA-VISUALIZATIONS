# 📚 Stack Visualizer

An interactive and animated **Stack Data Structure Visualizer** built using HTML5, CSS3, and Vanilla JavaScript.

This project provides a visual representation of how a Stack works, allowing users to perform different operations and understand the LIFO (Last In, First Out) principle through real-time animations.

No frameworks or external JavaScript libraries are required.

---

## 🚀 Getting Started

### How to Run

1. Clone or download this repository.
2. Navigate to the `Stack` folder.
3. Open `index.html` in any modern web browser.

Alternatively, use the Live Server extension in Visual Studio Code.

**Supported Browsers:** Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari.

No backend or server configuration is required.

---

## 📋 Stack Operations

A Stack follows the **LIFO (Last In, First Out)** principle, meaning the element inserted last is removed first.

The visualizer supports the following operations:

| Operation | Description | Time Complexity |
|---|---|---|
| Push | Inserts a new element at the top of the stack. | O(1) |
| Pop | Removes the top element from the stack. | O(1) |
| Peek | Displays the top element without removing it. | O(1) |
| isEmpty | Checks whether the stack contains any elements. | O(1) |
| isFull | Checks whether the stack has reached its maximum capacity. | O(1) |
| Clear | Removes all elements and resets the stack. | O(1)* |

*Clear complexity depends on the underlying implementation.*

---

## ✨ Features

- **Animated Stack Operations:** Smooth animations for Push, Pop, and Peek operations.
- **Overflow and Underflow Detection:** Visual error indicators, shake animations, and toast notifications.
- **Adjustable Capacity:** Dynamically change stack capacity between 3 and 10 elements.
- **Animation Speed Control:** Adjust animation speed from 0.2 seconds to 1.5 seconds.
- **Live Information Panel:** Displays current size, capacity, top index, isEmpty, and isFull status.
- **Operation History:** Maintains a scrollable history of the last 50 operations with color-coded entries.
- **C Code Visualization:** Displays equivalent C implementations of stack operations with syntax highlighting.
- **Toast Notifications:** Provides instant feedback for operations, errors, and capacity changes.
- **Modern UI:** Dark-themed glassmorphism interface with teal accents.
- **Responsive Design:** Three-column desktop layout that adapts to tablet and mobile screens.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structures the application and provides semantic elements. |
| CSS3 | Handles styling, animations, layouts, and responsiveness. |
| Vanilla JavaScript | Implements stack logic, DOM manipulation, and interactive functionality. |
| Google Fonts | Uses Inter, Poppins, and JetBrains Mono for typography. |

### Implementation Details

- ES6 JavaScript classes (`Stack` and `StackUI`).
- CSS Grid and Flexbox for responsive layouts.
- CSS custom properties and keyframe animations.
- DOM manipulation and event listeners.
- No external JavaScript frameworks or libraries.

---

## 📁 Project Structure

```text
Stack/
│
├── index.html       # Main application structure
├── style.css        # Styling, animations, and responsive layout
├── script.js        # Stack implementation and UI functionality
└── README.md        # Project documentation
```

---

## 📊 Complexity Analysis

For a stack with a maximum capacity of N elements:

| Operation | Time Complexity | Space Complexity |
|---|---|---|
| Push | O(1) | O(1) |
| Pop | O(1) | O(1) |
| Peek | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
| isFull | O(1) | O(1) |

**Overall Space Complexity:** O(N), where N represents the maximum stack capacity.

---

## 🎨 Design System

The application uses a modern dark-themed interface with a glassmorphism design.

| Element | Design Specification |
|---|---|
| Background | Dark gradient (`#0a0a0f`, `#0d1117`, `#0a0f0a`) |
| Primary Accent | Teal (`#00d4aa`) |
| Danger | Red (`#ff4444`) |
| Warning | Orange (`#ffaa00`) |
| Information | Blue (`#4488ff`) |
| Cards | Transparent backgrounds with blur effects |
| Border Radius | 12