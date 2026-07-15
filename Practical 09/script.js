// Practical 09 — Storage & Preferences
// Demonstrates: localStorage (setItem, getItem, removeItem, clear, key, length)
//               sessionStorage (same API, session-only)

document.addEventListener('DOMContentLoaded', () => {

  // ── Load saved preferences from localStorage ──
  function loadPreferences() {
    // Username
    const savedName = localStorage.getItem('gym_username');
    if (savedName) {
      document.getElementById('greetingMsg').textContent = `Welcome back, ${savedName}!`;
      document.getElementById('greetingInfo').textContent = 'Your preferences are loaded from localStorage.';
      document.getElementById('usernameInput').value = savedName;
    }

    // Font size
    const savedSize = localStorage.getItem('gym_fontSize') || '16';
    document.body.style.fontSize = savedSize + 'px';
    document.querySelectorAll('#fontSizeGroup .pref-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === savedSize);
    });

    // Theme
    const savedTheme = localStorage.getItem('gym_theme') || 'warm';
    applyTheme(savedTheme);
    const toggle = document.getElementById('themeToggle');
    toggle.classList.toggle('on', savedTheme === 'cool');

    // Session counter
    const count = parseInt(sessionStorage.getItem('gym_sessionCount')) || 0;
    document.getElementById('sessionCount').textContent = count;
  }

  function applyTheme(theme) {
    if (theme === 'cool') {
      document.documentElement.style.setProperty('--accent', '#4A8FBF');
      document.documentElement.style.setProperty('--accent-soft', '#E8F4FB');
    } else {
      document.documentElement.style.setProperty('--accent', '#B07D4B');
      document.documentElement.style.setProperty('--accent-soft', '#FFF5E8');
    }
  }

  function refreshInspector() {
    // localStorage inspector
    const localView = document.getElementById('localStorageView');
    if (localStorage.length === 0) {
      localView.innerHTML = '<div style="color:#8A94A6;">Empty</div>';
    } else {
      let html = '';
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        html += `<div class="kv-row">
          <span class="kv-key">${key}</span>
          <span class="kv-val">${val}</span>
          <span class="kv-type">local</span>
        </div>`;
      }
      localView.innerHTML = html;
    }

    // sessionStorage inspector
    const sessionView = document.getElementById('sessionStorageView');
    if (sessionStorage.length === 0) {
      sessionView.innerHTML = '<div style="color:#8A94A6;">Empty</div>';
    } else {
      let html = '';
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const val = sessionStorage.getItem(key);
        html += `<div class="kv-row">
          <span class="kv-key">${key}</span>
          <span class="kv-val">${val}</span>
          <span class="kv-type">session</span>
        </div>`;
      }
      sessionView.innerHTML = html;
    }
  }

  // ── Save Username ──
  document.getElementById('btnSaveUsername').addEventListener('click', () => {
    const name = document.getElementById('usernameInput').value.trim();
    if (!name) {
      alert('Please enter a username.');
      return;
    }
    localStorage.setItem('gym_username', name);
    document.getElementById('greetingMsg').textContent = `Welcome, ${name}!`;
    document.getElementById('greetingInfo').textContent = 'Username saved to localStorage.';
    refreshInspector();
  });

  // ── Font Size ──
  document.querySelectorAll('#fontSizeGroup .pref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.size;
      document.body.style.fontSize = size + 'px';
      localStorage.setItem('gym_fontSize', size);

      document.querySelectorAll('#fontSizeGroup .pref-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      refreshInspector();
    });
  });

  // ── Theme Toggle ──
  document.getElementById('themeToggle').addEventListener('click', () => {
    const toggle = document.getElementById('themeToggle');
    const isOn = toggle.classList.toggle('on');
    const theme = isOn ? 'cool' : 'warm';

    localStorage.setItem('gym_theme', theme);
    applyTheme(theme);
    refreshInspector();
  });

  // ── Session Counter ──
  document.getElementById('btnIncrement').addEventListener('click', () => {
    let count = parseInt(sessionStorage.getItem('gym_sessionCount')) || 0;
    count++;
    sessionStorage.setItem('gym_sessionCount', count.toString());
    document.getElementById('sessionCount').textContent = count;
    refreshInspector();
  });

  document.getElementById('btnResetSession').addEventListener('click', () => {
    sessionStorage.setItem('gym_sessionCount', '0');
    document.getElementById('sessionCount').textContent = '0';
    refreshInspector();
  });

  // ── Clear All ──
  document.getElementById('btnClearAll').addEventListener('click', () => {
    if (confirm('Clear all stored data?')) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  });

  // Initialize
  loadPreferences();
  refreshInspector();
});
