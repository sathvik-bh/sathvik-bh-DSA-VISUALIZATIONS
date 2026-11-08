# 🗼 Tower of Hanoi 3D Visualizer

An interactive **3D Tower of Hanoi Visualizer** that demonstrates the classic Tower of Hanoi mathematical puzzle through an immersive three-dimensional environment.

The application allows users to solve the puzzle automatically using recursion or manually by moving disks between three pegs.

Each peg is implemented using a Stack data structure, demonstrating the practical application of stacks and recursive problem-solving.

---

## 📖 About Tower of Hanoi

Tower of Hanoi is a mathematical puzzle consisting of three pegs and a collection of disks of different sizes.

The objective is to move all disks from the source peg to the destination peg while following three rules:

1. Only one disk can be moved at a time.
2. Only the top disk of a peg can be moved.
3. A larger disk cannot be placed on top of a smaller disk.

The puzzle is commonly used to understand recursion and algorithmic problem-solving.

---

## ✨ Features

- **3D Visualization:** Displays the Tower of Hanoi puzzle in an interactive three-dimensional environment.
- **Automatic Solver:** Solves the puzzle using a recursive algorithm.
- **Manual Gameplay:** Allows users to move disks by interacting with the pegs.
- **Stack-Based Implementation:** Each peg is represented using a Stack class.
- **Disk Movement:** Visually demonstrates disk movement between pegs.
- **Rule Validation:** Ensures that disk movements follow the Tower of Hanoi rules.
- **Interactive Learning:** Helps users understand recursion through practical visualization.

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- Active internet connection to load the external 3D library and fonts.

### How to Run

1. Clone or download the repository.
2. Navigate to the `Tower-of-Hanoi` folder.
3. Open `index.html` in a modern web browser.
4. Ensure you have an active internet connection for loading the required external libraries and fonts.

No backend configuration is required.

---

## 🎮 How to Play

### Manual Mode

1. Open the Tower of Hanoi visualizer.
2. Select the top disk from the source peg by clicking it.
3. Select another peg to move the disk.
4. Follow the three Tower of Hanoi rules.
5. Continue moving disks until all disks reach the destination peg.

### Automatic Mode

1. Select the desired number of disks.
2. Start the automatic solving process.
3. The application uses recursion to calculate the required disk movements.
4. Watch the disks move between the three pegs until the puzzle is solved.

---

## 🧠 Understanding the Recursive Algorithm

The Tower of Hanoi problem can be solved using recursion.

For N disks, the recursive algorithm follows these steps:

1. Move the top N-1 disks from the source peg to the auxiliary peg.
2. Move the largest disk from the source peg to the destination peg.
3. Move the N-1 disks from the auxiliary peg to the destination peg.

### Pseudocode

```text id="q2j7sk"
TOH(n, source, auxiliary, destination):

    IF n == 1:
        Move disk from source to destination
        RETURN

    TOH(n-1, source, destination, auxiliary)

    Move disk from source to destination

    TOH(n-1, auxiliary, source, destination)
```

This process continues until all disks have been transferred to the destination peg.

---

## 📊 Complexity Analysis

For N disks:

| Metric | Complexity | Explanation |
|---|---|---|
| Time Complexity | O(2^n) | The algorithm requires 2^n - 1 disk movements. |
| Auxiliary Space | O(n) | Recursive calls use a call stack proportional to the number of disks. |
| Minimum Moves | 2^n - 1 | Minimum