// Practical 11 — medAlert.js (ES6 Module)
// Encapsulates asynchronous countdown math, periodic interval clocks, and delayed setTimeout reminders

export function calculateRemainingTime(targetTimestamp) {
  const now = Date.now();
  const diffMs = targetTimestamp - now;

  if (diffMs <= 0) {
    return { expired: true, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { expired: false, hours, minutes, seconds, totalSeconds };
}

export function formatTimeDisplay(hours, minutes, seconds) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export class ClinicalTimerEngine {
  constructor(tickCallback, intervalMs = 1000) {
    this.tickCallback = tickCallback;
    this.intervalMs = intervalMs;
    this.intervalId = null;
    this.scheduledAlarms = new Set();
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.tickCallback();
    }, this.intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.clearAllAlarms();
  }

  scheduleDoseReminder(message, delayMs, onTrigger) {
    const timeoutId = setTimeout(() => {
      onTrigger(message);
      this.scheduledAlarms.delete(timeoutId);
    }, delayMs);
    this.scheduledAlarms.add(timeoutId);
    return timeoutId;
  }

  clearAllAlarms() {
    this.scheduledAlarms.forEach((id) => clearTimeout(id));
    this.scheduledAlarms.clear();
  }
}
