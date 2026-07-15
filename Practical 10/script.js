// Practical 10 — JSON Data Table
// Demonstrates: fetch() API, jQuery $.getJSON(), JSON parsing, dynamic table rendering

let allData = [];
let sortKey = 'id';
let sortAsc = true;
let loadMethod = 'fetch';

document.addEventListener('DOMContentLoaded', () => {

  // ── Load Method Buttons ──
  document.getElementById('btnFetch').addEventListener('click', () => {
    setActiveMethod('fetch');
    loadWithFetch();
  });

  document.getElementById('btnJquery').addEventListener('click', () => {
    setActiveMethod('jquery');
    loadWithJQuery();
  });

  function setActiveMethod(method) {
    loadMethod = method;
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(method === 'fetch' ? 'btnFetch' : 'btnJquery').classList.add('active');
    showLoading();
  }

  function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('tableWrap').style.display = 'none';
    document.getElementById('tableFooter').style.display = 'none';
    document.getElementById('noResults').classList.add('hidden');
  }

  function showTable() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('tableWrap').style.display = 'block';
    document.getElementById('tableFooter').style.display = 'flex';
  }

  // ── Method 1: fetch() API ──
  function loadWithFetch() {
    fetch('data.json')
      .then(response => {
        if (!response.ok) throw new Error('HTTP error ' + response.status);
        return response.json();
      })
      .then(data => {
        allData = data;
        setTimeout(() => {  // Simulate brief loading for visual effect
          renderTable();
          showTable();
          document.getElementById('footerMethod').textContent = 'Loaded via: fetch() API';
        }, 600);
      })
      .catch(error => {
        alert('Error loading data: ' + error.message);
        document.getElementById('loadingState').innerHTML =
          '<p class="text-muted text-center">❌ Failed to load data. Make sure you\'re running from a local server.</p>';
      });
  }

  // ── Method 2: jQuery $.getJSON ──
  function loadWithJQuery() {
    $.getJSON('data.json')
      .done(function(data) {
        allData = data;
        setTimeout(() => {
          renderTable();
          showTable();
          document.getElementById('footerMethod').textContent = 'Loaded via: jQuery $.getJSON()';
        }, 600);
      })
      .fail(function(jqXHR, textStatus, error) {
        alert('jQuery error: ' + textStatus + ' — ' + error);
      });
  }

  // ── Render Table ──
  function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase();

    // Filter
    let filtered = allData.filter(row =>
      row.name.toLowerCase().includes(search) ||
      row.email.toLowerCase().includes(search) ||
      row.role.toLowerCase().includes(search)
    );

    // Sort
    filtered.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === 'id') {
        return sortAsc ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    // Update sort header icons
    document.querySelectorAll('.sort-header').forEach(th => {
      th.classList.remove('asc', 'desc');
      const icon = th.querySelector('.sort-icon');
      if (th.dataset.key === sortKey) {
        th.classList.add(sortAsc ? 'asc' : 'desc');
        icon.textContent = sortAsc ? '↑' : '↓';
      } else {
        icon.textContent = '↕';
      }
    });

    // Build table body
    const tbody = document.getElementById('tableBody');

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      document.getElementById('noResults').classList.remove('hidden');
    } else {
      document.getElementById('noResults').classList.add('hidden');

      tbody.innerHTML = filtered.map(row => `
        <tr class="fade-in">
          <td>${row.id}</td>
          <td><strong>${row.name}</strong></td>
          <td>${row.email}</td>
          <td><span class="role-badge role-${getRoleClass(row.role)}">${row.role}</span></td>
          <td><span class="status-badge ${getStatusClass(row.status)}">${row.status}</span></td>
          <td>${formatDate(row.joined)}</td>
        </tr>
      `).join('');
    }

    // Footer info
    document.getElementById('rowCount').textContent = `${filtered.length} rows`;
    document.getElementById('footerInfo').textContent = `Showing ${filtered.length} of ${allData.length}`;
  }

  function getRoleClass(role) {
    const map = { 'Developer': 'developer', 'Designer': 'designer', 'Manager': 'manager', 'QA Tester': 'qa', 'DevOps': 'devops' };
    return map[role] || 'developer';
  }

  function getStatusClass(status) {
    if (status === 'Active') return 'success';
    if (status === 'Inactive') return 'danger';
    return 'warning';
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ── Sort on header click ──
  document.querySelectorAll('.sort-header').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) {
        sortAsc = !sortAsc;
      } else {
        sortKey = key;
        sortAsc = true;
      }
      renderTable();
    });
  });

  // ── Search ──
  document.getElementById('searchInput').addEventListener('input', () => {
    renderTable();
  });

  // Auto-load with fetch on page load
  loadWithFetch();
});
