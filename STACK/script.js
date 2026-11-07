// ==========================================
// STACK DATA STRUCTURE (Pure Logic)
// ==========================================

class Stack {
  constructor(capacity) {
    this._capacity = Math.max(3, Math.min(10, parseInt(capacity, 10) || 6));
    this._arr = [];
    this._top = -1;
  }

  push(value) {
    if (this.isFull()) {
      return { success: false, message: `Stack Overflow! Stack is full (capacity: ${this._capacity})` };
    }
    this._arr[++this._top] = value;
    return {
      success: true,
      message: `Pushed ${value} → size: ${this.getSize()}/${this._capacity}, top index: ${this._top}`
    };
  }

  pop() {
    if (this.isEmpty()) {
      return { success: false, value: null, message: 'Stack Underflow! Stack is empty' };
    }
    const value = this._arr[this._top--];
    this._arr.length = this._top + 1;
    return {
      success: true,
      value,
      message: `Popped ${value} → size: ${this.getSize()}/${this._capacity}, top index: ${this._top}`
    };
  }

  peek() {
    if (this.isEmpty()) {
      return { success: false, value: null, message: 'Stack is empty! Nothing to peek' };
    }
    return {
      success: true,
      value: this._arr[this._top],
      message: `Peek → top is ${this._arr[this._top]}`
    };
  }

  isEmpty() {
    return this._top === -1;
  }

  isFull() {
    return this._top === this._capacity - 1;
  }

  clear() {
    this._arr = [];
    this._top = -1;
  }

  getSize() {
    return this._top + 1;
  }

  getCapacity() {
    return this._capacity;
  }

  toArray() {
    // Returns a copy of elements, top-first
    return this._arr.slice(0, this._top + 1).reverse();
  }
}

// ==========================================
// C CODE SNIPPETS
// ==========================================

const C_CODE = {
  push: `// Push: O(1)
void push(Stack *s, int val) {
    if (s->top == s->capacity - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    s->arr[++s->top] = val;
}`,

  pop: `// Pop: O(1)
int pop(Stack *s) {
    if (s->top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return s->arr[s->top--];
}`,

  peek: `// Peek: O(1)
int peek(Stack *s) {
    if (s->top == -1) {
        printf("Stack is empty!\\n");
        return -1;
    }
    return s->arr[s->top];
}`,

  isEmpty: `// isEmpty: O(1)
int isEmpty(Stack *s) {
    return s->top == -1;
}`,

  isFull: `// isFull: O(1)
int isFull(Stack *s) {
    return s->top == s->capacity - 1;
}`,

  clear: `// Clear: O(1)
void clear(Stack *s) {
    s->top = -1;
}`
};

const C_CODE_LABELS = {
  push:    'Push',
  pop:     'Pop',
  peek:    'Peek',
  isEmpty: 'isEmpty',
  isFull:  'isFull',
  clear:   'Clear'
};

// ==========================================
// SYNTAX HIGHLIGHTER
// ==========================================

function highlightC(code) {
  const KEYWORDS = ['void', 'int', 'if', 'return', 'struct', 'while', 'for', 'else', 'char', 'float', 'double'];

  // Escape HTML first
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process line-by-line to handle comments correctly
  const lines = result.split('\n');
  const processed = lines.map(line => {
    // Check for line comment
    const commentIdx = line.indexOf('//');
    let codePart = line;
    let commentPart = '';

    if (commentIdx !== -1) {
      codePart = line.substring(0, commentIdx);
      commentPart = line.substring(commentIdx);
    }

    // Highlight strings in code part
    codePart = codePart.replace(/"([^"]*)"/g, '<span class="c-str">"$1"</span>');

    // Highlight numbers (standalone integers)
    codePart = codePart.replace(/\b(-?\d+)\b/g, (m) => `<span class="c-num">${m}</span>`);

    // Highlight keywords
    KEYWORDS.forEach(kw => {
      const re = new RegExp(`\\b(${kw})\\b`, 'g');
      codePart = codePart.replace(re, '<span class="c-kw">$1</span>');
    });

    // Highlight function calls (word followed by '(')
    codePart = codePart.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (m, fn) => {
      // Don't re-wrap already-wrapped keywords
      if (KEYWORDS.includes(fn)) return m;
      return `<span class="c-fn">${fn}</span>`;
    });

    // Format comment
    if (commentPart) {
      commentPart = `<span class="c-comment">${commentPart}</span>`;
    }

    return codePart + commentPart;
  });

  return processed.join('\n');
}

// ==========================================
// STACK UI (DOM & Rendering)
// ==========================================

class StackUI {
  constructor() {
    this.stack = new Stack(6);
    this.logEntries = [];
    this.animating = false;

    // DOM refs
    this.stackContainer   = document.getElementById('stack-container');
    this.indexLabels      = document.getElementById('stack-index-labels');
    this.logPanel         = document.getElementById('log-panel');
    this.codeContent      = document.getElementById('code-content');
    this.codeOpBadge      = document.getElementById('code-op-badge');
    this.valueInput       = document.getElementById('value-input');
    this.valueError       = document.getElementById('value-error');
    this.capacityInput    = document.getElementById('capacity-input');
    this.speedSlider      = document.getElementById('speed-slider');

    // Stat elements
    this.statSize      = document.getElementById('stat-size');
    this.statCapacity  = document.getElementById('stat-capacity');
    this.statTopIndex  = document.getElementById('stat-top-index');
    this.statIsEmpty   = document.getElementById('stat-isempty');
    this.statIsFull    = document.getElementById('stat-isfull');

    this._bindEvents();
    this._updateSpeedVar();
    this.render();
  }

  _bindEvents() {
    document.getElementById('push-btn').addEventListener('click', () => this._handlePush());
    document.getElementById('pop-btn').addEventListener('click', () => this._handlePop());
    document.getElementById('peek-btn').addEventListener('click', () => this._handlePeek());
    document.getElementById('isempty-btn').addEventListener('click', () => this._handleIsEmpty());
    document.getElementById('isfull-btn').addEventListener('click', () => this._handleIsFull());
    document.getElementById('clear-btn').addEventListener('click', () => this._handleClear());
    document.getElementById('set-capacity-btn').addEventListener('click', () => this._handleSetCapacity());

    this.valueInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handlePush();
    });

    this.valueInput.addEventListener('input', () => {
      if (this.valueError.textContent) {
        this.valueError.textContent = '';
      }
    });

    this.speedSlider.addEventListener('input', () => this._updateSpeedVar());

    this.capacityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._handleSetCapacity();
    });
  }

  _updateSpeedVar() {
    // Slider: 1 (slow) → 10 (fast)
    // Duration: 1.5s (slow) → 0.2s (fast)
    const val = parseInt(this.speedSlider.value, 10);
    const duration = 1.5 - ((val - 1) / 9) * 1.3;
    document.documentElement.style.setProperty('--anim-duration', duration.toFixed(2) + 's');
  }

  _getAnimDuration() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--anim-duration').trim();
    return parseFloat(raw) * 1000;
  }

  _validateValue() {
    const raw = this.valueInput.value.trim();
    if (!raw) {
      this.valueError.textContent = 'Please enter a value';
      this.valueInput.focus();
      return null;
    }
    const num = parseFloat(raw);
    if (isNaN(num)) {
      this.valueError.textContent = 'Please enter a numeric value';
      this.valueInput.focus();
      return null;
    }
    this.valueError.textContent = '';
    return raw; // Keep original string representation
  }

  // ---------- Operation Handlers ----------

  _handlePush() {
    if (this.animating) return;
    const value = this._validateValue();
    if (value === null) return;

    this._showCode('push');

    if (this.stack.isFull()) {
      // Overflow
      this._addLog('⚠', `Overflow! Stack is full (capacity: ${this.stack.getCapacity()})`, '', 'log-error');
      showToast('Stack Overflow!', '⚠ Cannot push to a full stack.', 'error');
      this._shakeContainer();
      return;
    }

    this.animating = true;
    const result = this.stack.push(value);
    this._addLog('▶', `Pushed ${value}`, `size: ${this.stack.getSize()}/${this.stack.getCapacity()}, top index: ${this.stack._top}`, 'log-push');
    this.valueInput.value = '';
    this.valueError.textContent = '';

    this._renderWithPushAnimation(value);
    this._updateStats();
  }

  _handlePop() {
    if (this.animating) return;
    this._showCode('pop');

    if (this.stack.isEmpty()) {
      this._addLog('⚠', 'Underflow! Stack is empty', '', 'log-error');
      showToast('Stack Underflow!', '⚠ Cannot pop from an empty stack.', 'error');
      this._shakeContainer();
      return;
    }

    this.animating = true;
    const topEl = this.stackContainer.querySelector('.stack-element.top-element');

    if (topEl) {
      topEl.classList.add('lift-out');
      const dur = this._getAnimDuration();

      setTimeout(() => {
        const result = this.stack.pop();
        this._addLog('◀', `Popped ${result.value}`, `size: ${this.stack.getSize()}/${this.stack.getCapacity()}, top index: ${this.stack._top}`, 'log-pop');
        this.render();
        this._updateStats();
        this.animating = false;
      }, dur);
    } else {
      const result = this.stack.pop();
      this._addLog('◀', `Popped ${result.value}`, `size: ${this.stack.getSize()}/${this.stack.getCapacity()}, top index: ${this.stack._top}`, 'log-pop');
      this.render();
      this._updateStats();
      this.animating = false;
    }
  }

  _handlePeek() {
    if (this.animating) return;
    this._showCode('peek');

    if (this.stack.isEmpty()) {
      this._addLog('⚠', 'Underflow! Stack is empty — nothing to peek', '', 'log-error');
      showToast('Stack Underflow!', '⚠ Cannot peek an empty stack.', 'error');
      this._shakeContainer();
      return;
    }

    const result = this.stack.peek();
    this._addLog('👁', `Peek → top is ${result.value}`, '', 'log-peek');

    // Animate the top element with pulse-glow
    const topEl = this.stackContainer.querySelector('.stack-element.top-element');
    if (topEl) {
      this.animating = true;
      topEl.classList.add('pulse-glow');
      const dur = this._getAnimDuration() * 2;
      setTimeout(() => {
        topEl.classList.remove('pulse-glow');
        this.animating = false;
      }, dur + 50);
    }
  }

  _handleIsEmpty() {
    if (this.animating) return;
    this._showCode('isEmpty');
    const result = this.stack.isEmpty();
    this._addLog('✓', `isEmpty → ${result}`, '', 'log-isempty');
  }

  _handleIsFull() {
    if (this.animating) return;
    this._showCode('isFull');
    const result = this.stack.isFull();
    this._addLog('✓', `isFull → ${result}`, '', 'log-isfull');
  }

  _handleClear() {
    if (this.animating) return;
    this._showCode('clear');
    this.stack.clear();
    this._addLog('🗑', 'Stack cleared', '', 'log-clear');
    this.render();
    this._updateStats();
  }

  _handleSetCapacity() {
    const raw = parseInt(this.capacityInput.value, 10);
    if (isNaN(raw) || raw < 3 || raw > 10) {
      showToast('Invalid Capacity', 'Capacity must be between 3 and 10.', 'error');
      return;
    }
    this.stack = new Stack(raw);
    this._addLog('⚙', `Capacity set to ${raw}. Stack reset.`, '', 'log-cap');
    showToast('Capacity Updated', `Capacity set to ${raw}. Stack has been reset.`, 'success');
    this.render();
    this._updateStats();
  }

  // ---------- Animation Helpers ----------

  _renderWithPushAnimation(value) {
    // Render the stack without the new top element first (to get empty slots right)
    // Then add the new element with animation
    this._renderSlots();
    this._renderIndexLabels();

    const capacity = this.stack.getCapacity();
    const topIdx = this.stack._top;
    const elements = this.stack.toArray(); // top-first

    // The newly pushed element is at topIdx in the internal array
    // In our reversed DOM layout (bottom = slot 0), it appears as the top visible element
    // We need to place it at the correct slot position

    // Find the slot at position topIdx (from bottom)
    // Our container is column-reverse, so children go: slot[0] at visual bottom
    const slotEls = this.stackContainer.querySelectorAll('.stack-slot, .stack-element');
    // slot at internal index `topIdx` is at DOM child index `topIdx` (because column-reverse flips display)
    // Actually: column-reverse means last child is at visual bottom (index 0), first child is at top
    // We render capacity children; child index 0 = capacity-1 slot visually on top
    // We need topIdx-th slot from bottom = (capacity - 1 - topIdx)-th child from array start

    const childIndex = capacity - 1 - topIdx;
    const targetSlot = this.stackContainer.children[childIndex];

    if (targetSlot) {
      const newEl = this._createElementNode(String(value), true);
      newEl.classList.add('slide-in');
      targetSlot.replaceWith(newEl);

      const dur = this._getAnimDuration();
      setTimeout(() => {
        newEl.classList.remove('slide-in');
        // Now update all elements (remove TOP badge from old top if any)
        this._refreshTopBadge();
        this.animating = false;
      }, dur + 50);
    } else {
      this.render();
      this.animating = false;
    }
  }

  _refreshTopBadge() {
    const allEls = this.stackContainer.querySelectorAll('.stack-element');
    allEls.forEach(el => {
      el.classList.remove('top-element');
      const badge = el.querySelector('.element-badge');
      if (badge) badge.remove();
    });

    // The visually highest element (lowest child index in column-reverse display) is the top
    // In our rendering: child at (capacity - 1 - topIdx) index is top element
    const capacity = this.stack.getCapacity();
    const topIdx = this.stack._top;
    if (topIdx >= 0) {
      const childIndex = capacity - 1 - topIdx;
      const topChild = this.stackContainer.children[childIndex];
      if (topChild && topChild.classList.contains('stack-element')) {
        topChild.classList.add('top-element');
        const badge = document.createElement('span');
        badge.className = 'element-badge';
        badge.textContent = 'TOP';
        topChild.appendChild(badge);
      }
    }
    this._renderIndexLabels();
  }

  _shakeContainer() {
    const wrapper = document.getElementById('stack-wrapper');
    wrapper.classList.remove('shake', 'danger-flash');
    // Force reflow
    void wrapper.offsetWidth;
    wrapper.classList.add('shake', 'danger-flash');
    const dur = this._getAnimDuration() * 0.8;
    setTimeout(() => {
      wrapper.classList.remove('shake', 'danger-flash');
    }, dur + 50);
  }

  // ---------- Rendering ----------

  _createElementNode(value, isTop) {
    const el = document.createElement('div');
    el.className = 'stack-element' + (isTop ? ' top-element' : '');
    el.dataset.value = value;

    const valSpan = document.createElement('span');
    valSpan.className = 'element-value';
    valSpan.textContent = value;
    el.appendChild(valSpan);

    if (isTop) {
      const badge = document.createElement('span');
      badge.className = 'element-badge';
      badge.textContent = 'TOP';
      el.appendChild(badge);
    }

    return el;
  }

  _createSlotNode(index) {
    const el = document.createElement('div');
    el.className = 'stack-slot';
    el.dataset.index = index;
    el.textContent = 'empty';
    return el;
  }

  _renderSlots() {
    this.stackContainer.innerHTML = '';
    const capacity = this.stack.getCapacity();
    const topIdx = this.stack._top;

    // We render capacity slots. Column-reverse means child[0] = visual top, child[capacity-1] = visual bottom.
    // Internal index mapping: child at position i corresponds to internal stack index (capacity - 1 - i)
    for (let i = 0; i < capacity; i++) {
      const internalIdx = capacity - 1 - i;
      if (internalIdx <= topIdx) {
        const isTop = internalIdx === topIdx;
        const value = this.stack._arr[internalIdx];
        const el = this._createElementNode(String(value), isTop);
        this.stackContainer.appendChild(el);
      } else {
        const slot = this._createSlotNode(internalIdx);
        this.stackContainer.appendChild(slot);
      }
    }
  }

  _renderIndexLabels() {
    this.indexLabels.innerHTML = '';
    const capacity = this.stack.getCapacity();
    const topIdx = this.stack._top;

    // Labels go bottom-to-top (column-reverse), so we push them in order 0..capacity-1
    for (let i = 0; i < capacity; i++) {
      const lbl = document.createElement('div');
      lbl.className = 'index-label' + (i === topIdx ? ' top-index' : '');
      lbl.textContent = i;
      this.indexLabels.appendChild(lbl);
    }
  }

  render() {
    this._renderSlots();
    this._renderIndexLabels();
  }

  _updateStats() {
    this.statSize.textContent = this.stack.getSize();
    this.statCapacity.textContent = this.stack.getCapacity();
    this.statTopIndex.textContent = this.stack._top;

    const empty = this.stack.isEmpty();
    const full  = this.stack.isFull();

    this.statIsEmpty.textContent = empty ? 'Yes' : 'No';
    this.statIsEmpty.className = 'stat-value stat-bool ' + (empty ? 'stat-true' : 'stat-false');

    this.statIsFull.textContent = full ? 'Yes' : 'No';
    this.statIsFull.className = 'stat-value stat-bool ' + (full ? 'stat-true' : 'stat-false');
  }

  // ---------- Log System ----------

  _addLog(icon, text, detail, typeClass) {
    // Remove empty placeholder
    const emptyMsg = this.logPanel.querySelector('.log-empty');
    if (emptyMsg) emptyMsg.remove();

    const entry = document.createElement('div');
    entry.className = `log-entry ${typeClass}`;

    const iconEl = document.createElement('span');
    iconEl.className = 'log-icon';
    iconEl.textContent = icon;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'log-body';

    const textEl = document.createElement('div');
    textEl.className = 'log-text';
    textEl.textContent = text;
    bodyEl.appendChild(textEl);

    if (detail) {
      const detailEl = document.createElement('div');
      detailEl.className = 'log-detail';
      detailEl.textContent = detail;
      bodyEl.appendChild(detailEl);
    }

    entry.appendChild(iconEl);
    entry.appendChild(bodyEl);

    // Insert at top
    this.logPanel.insertBefore(entry, this.logPanel.firstChild);

    // Keep max 50 entries
    this.logEntries.push(entry);
    if (this.logEntries.length > 50) {
      const oldest = this.logEntries.shift();
      if (oldest.parentNode === this.logPanel) {
        this.logPanel.removeChild(oldest);
      }
    }
  }

  // ---------- Code Panel ----------

  _showCode(opKey) {
    const code = C_CODE[opKey];
    if (!code) return;

    this.codeContent.innerHTML = highlightC(code);

    this.codeOpBadge.textContent = `${C_CODE_LABELS[opKey]} — Time: O(1)`;
    this.codeOpBadge.style.display = 'inline-block';
  }
}

// ==========================================
// TOAST SYSTEM
// ==========================================

function showToast(title, message, type) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { error: '⚠', success: '✓', info: 'ℹ' };
  const icon = icons[type] || 'ℹ';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Auto-dismiss after 3s
  const dismissAfter = 3000;
  const animOut = 300;

  setTimeout(() => {
    toast.classList.add('dismissing');
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, animOut);
  }, dismissAfter);
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const ui = new StackUI();

  // Initialize stats on load
  ui._updateStats();
});
