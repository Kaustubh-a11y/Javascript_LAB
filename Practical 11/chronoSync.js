// Practical 11 — chronoSync.js (Main ES6 Module)
import { PrescriptionManager } from './prescriptionData.js';
import { ClinicalTimerEngine, calculateRemainingTime, formatTimeDisplay } from './medAlert.js';

document.addEventListener('DOMContentLoaded', () => {
  const manager = new PrescriptionManager();
  const scheduleContainer = document.getElementById('medicationGrid');
  const liveClockEl = document.getElementById('liveClock');
  const alertBanner = document.getElementById('alertBanner');
  const addRoutineForm = document.getElementById('addRoutineForm');
  const testAlarmBtn = document.getElementById('testAlarmBtn');
  const alarmStatus = document.getElementById('alarmStatus');

  const sessionStartTime = Date.now();
  const items = manager.getAll().map((item) => ({
    ...item,
    targetTimestamp: sessionStartTime + item.targetOffsetMinutes * 60 * 1000,
    initialDurationSeconds: item.targetOffsetMinutes * 60
  }));

  function updateLiveClock() {
    const now = new Date();
    liveClockEl.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  function renderCards() {
    scheduleContainer.innerHTML = '';
    items.forEach((item) => {
      const remaining = calculateRemainingTime(item.targetTimestamp);
      const isDueSoon = remaining.totalSeconds > 0 && remaining.totalSeconds <= 1200; // < 20 mins
      const isPast = remaining.expired;

      const progressPercent = isPast
        ? 100
        : Math.min(100, Math.max(0, ((item.initialDurationSeconds - remaining.totalSeconds) / item.initialDurationSeconds) * 100));

      const card = document.createElement('div');
      card.className = `med-card ${isDueSoon ? 'due-soon' : ''} ${isPast ? 'completed' : ''}`;
      card.style.borderLeftColor = item.color;

      card.innerHTML = `
        <div class="card-header">
          <span class="badge" style="background:${item.color}20; color:${item.color}; border:1px solid ${item.color}40">
            ${item.category}
          </span>
          <span class="unit-pill">${item.doseUnit}</span>
        </div>
        <h3 class="med-title">${item.medication}</h3>
        <p class="generic-sub">${item.genericName}</p>
        <p class="doctor-sub">Physician: <strong>${item.doctor}</strong></p>
        <p class="instructions-sub">📋 ${item.intakeInstructions}</p>
        <div class="time-row">
          <span>Scheduled: <strong>${item.scheduledTime}</strong></span>
        </div>
        <div class="countdown-box ${isPast ? 'expired' : ''}">
          <span class="cd-label">${isPast ? 'Compliance' : 'Next Dose In'}</span>
          <span class="cd-digits">${isPast ? '✅ Dose Taken' : formatTimeDisplay(remaining.hours, remaining.minutes, remaining.seconds)}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${progressPercent}%; background:${item.color}"></div>
        </div>
      `;

      scheduleContainer.appendChild(card);
    });
  }

  function showAlert(message, durationMs = 4000) {
    alertBanner.textContent = `🔔 CLINICAL ALERT: ${message}`;
    alertBanner.style.display = 'block';
    timerEngine.scheduleDoseReminder('hide', durationMs, () => {
      alertBanner.style.display = 'none';
    });
  }

  const timerEngine = new ClinicalTimerEngine(() => {
    updateLiveClock();
    renderCards();
  }, 1000);

  timerEngine.start();
  updateLiveClock();
  renderCards();

  timerEngine.scheduleDoseReminder(
    'Clinical ChronoSync Initialized. Dose countdown timers active at 1000ms polling.',
    800,
    (msg) => showAlert(msg)
  );

  addRoutineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const medication = document.getElementById('inputMedication').value.trim();
    const genericName = document.getElementById('inputGeneric').value.trim();
    const doctor = document.getElementById('inputDoctor').value.trim();
    const minutes = parseInt(document.getElementById('inputMinutes').value, 10);
    const category = document.getElementById('inputCategory').value;

    if (!medication || isNaN(minutes) || minutes <= 0) return;

    items.push({
      id: `rx_${Date.now()}`,
      medication,
      genericName,
      doctor,
      scheduledTime: `${minutes}m from now`,
      intakeInstructions: 'Take with water as directed',
      targetOffsetMinutes: minutes,
      targetTimestamp: Date.now() + minutes * 60 * 1000,
      initialDurationSeconds: minutes * 60,
      category,
      color: '#0D9488',
      doseUnit: '1 Dose'
    });

    addRoutineForm.reset();
    showAlert(`Registered prescription "${medication}" successfully.`);
    renderCards();
  });

  testAlarmBtn.addEventListener('click', () => {
    testAlarmBtn.disabled = true;
    alarmStatus.textContent = '⏳ Clinical timer test running (10s delay)...';
    let count = 10;
    const intervalNotice = setInterval(() => {
      count -= 1;
      if (count > 0) {
        alarmStatus.textContent = `⏳ Dose reminder countdown: ${count}s remaining...`;
      } else {
        clearInterval(intervalNotice);
      }
    }, 1000);

    timerEngine.scheduleDoseReminder('Medication intake window reached!', 10000, () => {
      alarmStatus.textContent = '✅ Alarm callback fired via setTimeout!';
      testAlarmBtn.disabled = false;
      showAlert('Medication alert: Please administer prescribed dose now.');
    });
  });
});
