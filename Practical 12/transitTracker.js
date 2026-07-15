// Practical 12 — transitTracker.js (jQuery + DOM + Events + Storage + AJAX)
// Real-time Urban Mobility & Metro Transit Arrival Engine

$(document).ready(function () {
  const $routeGrid = $('#routeGrid');
  const $searchInput = $('#searchInput');
  const $refreshBtn = $('#refreshBtn');
  const $autoPollToggle = $('#autoPollToggle');
  const $sortToggleBtn = $('#sortToggleBtn');
  const $pollStatus = $('#pollStatus');
  const $lastUpdated = $('#lastUpdated');
  const $pinnedList = $('#pinnedList');
  const $offlineNotice = $('#offlineNotice');

  const STORAGE_KEY_PINNED = 'sit_transit_pinned_routes';
  const STORAGE_KEY_SORT = 'sit_transit_sort_mode'; // 'time' or 'type'

  let activeRoutes = [];
  let pollIntervalId = null;
  let sortMode = localStorage.getItem(STORAGE_KEY_SORT) || 'time';
  let pinnedRoutes = JSON.parse(localStorage.getItem(STORAGE_KEY_PINNED) || '[]');

  updateSortButtonText();
  renderPinnedList();

  function updateSortButtonText() {
    $sortToggleBtn.text(`Sort: By ${sortMode === 'time' ? 'Arrival Time' : 'Transit Type'}`);
  }

  function renderPinnedList() {
    $pinnedList.empty();
    if (pinnedRoutes.length === 0) {
      $pinnedList.html('<span class="text-muted text-sm">No pinned routes. Click the star icon to pin favorites.</span>');
      return;
    }
    pinnedRoutes.forEach((routeId) => {
      const chip = $(`
        <span class="pinned-chip">
          ⭐ ${routeId} <span class="unpin-btn" data-id="${routeId}">×</span>
        </span>
      `);
      $pinnedList.append(chip);
    });
  }

  function togglePinned(routeId) {
    const idx = pinnedRoutes.indexOf(routeId);
    if (idx >= 0) {
      pinnedRoutes.splice(idx, 1);
    } else {
      pinnedRoutes.push(routeId);
    }
    localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(pinnedRoutes));
    renderPinnedList();
    renderRouteCards(activeRoutes);
  }

  function renderRouteCards(routes) {
    $routeGrid.empty();
    const query = $searchInput.val().toLowerCase().trim();

    let filtered = routes.filter(
      (r) => r.lineName.toLowerCase().includes(query) || r.type.toLowerCase().includes(query) || r.platform.toLowerCase().includes(query)
    );

    if (sortMode === 'time') {
      filtered.sort((a, b) => a.estimatedArrivalMins - b.estimatedArrivalMins);
    } else {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    }

    if (filtered.length === 0) {
      $routeGrid.html(`
        <div class="card empty-card" style="grid-column: 1 / -1; text-align:center; padding: 40px;">
          <div style="font-size:2rem; margin-bottom:10px;">🔍</div>
          <div style="font-weight:600;">No transit lines match your filter criteria.</div>
        </div>
      `);
      return;
    }

    filtered.forEach((route) => {
      const isPinned = pinnedRoutes.includes(route.id);

      const $card = $(`
        <div class="transit-card ${isPinned ? 'pinned' : ''}" data-id="${route.id}">
          <div class="card-top">
            <span class="route-name">${route.icon} ${route.lineName}</span>
            <button class="btn-pin ${isPinned ? 'active' : ''}" title="Pin Favorite">${isPinned ? '★' : '☆'}</button>
          </div>
          <div class="platform-text">📍 ${route.platform}</div>
          <div class="arrival-display">${route.estimatedArrivalMins} <span style="font-size:1.1rem; font-weight:500;">Mins</span></div>
          <div class="type-badge">${route.type} • Headway: ${route.headwayMins}m</div>

          <div class="metrics-row">
            <div class="metric-item">
              <span class="m-label">Crowd Status</span>
              <span class="m-val ${route.crowdClass}">${route.crowdLevel}</span>
            </div>
            <div class="metric-item">
              <span class="m-label">Capacity</span>
              <span class="m-val">${route.coaches} Coach(es)</span>
            </div>
            <div class="metric-item">
              <span class="m-label">Base Fare</span>
              <span class="m-val">${route.fare}</span>
            </div>
          </div>
          
          <div class="card-footer">
            <span>Status: <strong style="color:#059669;">${route.status}</strong></span>
            <span>Live GPS Polling</span>
          </div>
        </div>
      `);

      $card.find('.btn-pin').on('click', function (e) {
        e.stopPropagation();
        togglePinned(route.id);
      });

      $routeGrid.append($card);
    });
  }

  function fetchTransitUpdates() {
    $pollStatus.text('🔄 Polling live GPS feed via AJAX...');
    $refreshBtn.prop('disabled', true);

    $.ajax({
      url: 'routes.json',
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: function (data) {
        $offlineNotice.hide();
        activeRoutes = data.routes.map((r) => {
          const delta = Math.floor(Math.random() * 2) - 1; // -1, 0, or +1 min
          const newEta = Math.max(1, r.estimatedArrivalMins + delta);
          return { ...r, estimatedArrivalMins: newEta };
        });

        renderRouteCards(activeRoutes);
        const now = new Date();
        $lastUpdated.text(now.toLocaleTimeString());
        $pollStatus.text('🟢 GPS Telemetry Feed Online');
        $refreshBtn.prop('disabled', false);
      },
      error: function (xhr, status, error) {
        console.warn('Transit AJAX error:', status, error);
        $offlineNotice.show();
        $pollStatus.text('🔴 Offline Storage Cache Active');
        $refreshBtn.prop('disabled', false);
      }
    });
  }

  $searchInput.on('input', function () {
    renderRouteCards(activeRoutes);
  });

  $refreshBtn.on('click', function () {
    fetchTransitUpdates();
  });

  $sortToggleBtn.on('click', function () {
    sortMode = sortMode === 'time' ? 'type' : 'time';
    localStorage.setItem(STORAGE_KEY_SORT, sortMode);
    updateSortButtonText();
    renderRouteCards(activeRoutes);
  });

  $autoPollToggle.on('change', function () {
    if ($(this).is(':checked')) {
      $pollStatus.text('⚡ Live Polling Active (5s)');
      pollIntervalId = setInterval(fetchTransitUpdates, 5000);
    } else {
      $pollStatus.text('⏸️ Live Polling Paused');
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
      }
    }
  });

  $(document).on('click', '.unpin-btn', function () {
    const id = $(this).data('id');
    togglePinned(id);
  });

  fetchTransitUpdates();
});
