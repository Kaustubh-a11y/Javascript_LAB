// Practical 04 — Palindrome Checker
// Demonstrates: function types, scope, closures, try-catch

// ─── Closure for History ───
// createHistory returns functions that share private 'history' array (closure)
function createHistory() {
  let history = [];  // Private variable — only accessible via returned functions

  return {
    add: function(word, result) {
      history.unshift({ word, result, time: new Date().toLocaleTimeString() });
      if (history.length > 10) history.pop();  // Keep last 10
    },
    getAll: function() {
      return [...history];  // Return copy
    },
    clear: function() {
      history = [];
    }
  };
}

const checker = createHistory();

// ─── Pure function to clean text ───
function cleanText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ─── Function expression for palindrome check ───
const isPalindrome = function(cleaned) {
  // Using try-catch for safety
  try {
    if (typeof cleaned !== 'string') {
      throw new TypeError('Input must be a string');
    }
    if (cleaned.length === 0) {
      throw new Error('Empty string after cleaning');
    }
    return cleaned === cleaned.split('').reverse().join('');
  } catch (error) {
    alert('Error: ' + error.message);
    return null;
  }
};

// ─── Arrow function for rendering ───
const renderCharComparison = (cleaned, result) => {
  const charDisplay = document.getElementById('charDisplay');
  charDisplay.innerHTML = '';

  const chars = cleaned.split('');
  const len = chars.length;

  chars.forEach((char, i) => {
    const box = document.createElement('div');
    box.className = 'char-box';
    box.textContent = char.toUpperCase();

    // Determine match: compare with mirror position
    const mirrorIndex = len - 1 - i;
    if (chars[i] === chars[mirrorIndex]) {
      box.classList.add('match');
    } else {
      box.classList.add('mismatch');
    }

    // Stagger animation
    box.style.animationDelay = `${i * 0.04}s`;
    box.style.opacity = '0';
    box.style.animation = `fadeIn 0.3s ease ${i * 0.04}s forwards`;

    charDisplay.appendChild(box);
  });
};

const renderHistory = () => {
  const list = document.getElementById('historyList');
  const items = checker.getAll();

  if (items.length === 0) {
    list.innerHTML = '<p class="text-muted text-sm">No checks yet.</p>';
    return;
  }

  list.innerHTML = items.map(item => `
    <div class="history-item fade-in">
      <span class="word">"${item.word}"</span>
      <span>
        <span class="status-badge ${item.result ? 'success' : 'danger'}">${item.result ? 'Palindrome' : 'Not'}</span>
        <span class="text-muted text-sm" style="margin-left: 8px;">${item.time}</span>
      </span>
    </div>
  `).join('');
};

// ─── Main Logic ───
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCheck').addEventListener('click', () => {
    const raw = document.getElementById('textInput').value.trim();

    if (!raw) {
      alert('Please enter a word or phrase.');
      return;
    }

    const cleaned = cleanText(raw);
    const result = isPalindrome(cleaned);

    if (result === null) return;  // Error occurred

    // Show cleaned text
    document.getElementById('cleanedText').textContent = `"${raw}" → "${cleaned}"`;

    // Show character comparison
    renderCharComparison(cleaned, result);

    // Show result banner
    const banner = document.getElementById('resultBanner');
    banner.className = `result-banner show ${result ? 'is-palindrome' : 'not-palindrome'}`;
    banner.textContent = result
      ? `✅ "${raw}" is a palindrome!`
      : `❌ "${raw}" is NOT a palindrome.`;

    // Show comparison card
    document.getElementById('comparisonCard').style.display = 'block';

    // Add to history (using closure)
    checker.add(raw, result);
    renderHistory();
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    checker.clear();
    renderHistory();
  });

  // Allow Enter key
  document.getElementById('textInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btnCheck').click();
  });
});
