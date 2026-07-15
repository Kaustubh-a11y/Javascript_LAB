// Practical 01 — External JavaScript File

document.addEventListener('DOMContentLoaded', () => {
  // 1. Welcome Message
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) greeting = 'Good Afternoon';

  document.getElementById('welcomeMsg').textContent = `${greeting}, Welcome!`;
  document.getElementById('welcomeTime').textContent =
    `Current Date & Time: ${new Date().toLocaleString()}`;

  // 2. Environment Info
  const envData = [
    { label: 'Browser', value: navigator.userAgent.split(' ').pop().split('/')[0] || 'Unknown' },
    { label: 'Platform', value: navigator.platform || 'Unknown' },
    { label: 'Language', value: navigator.language || 'Unknown' },
    { label: 'Screen', value: `${screen.width} × ${screen.height}` },
    { label: 'Color Depth', value: `${screen.colorDepth}-bit` },
    { label: 'Online', value: navigator.onLine ? 'Yes ✅' : 'No ❌' },
    { label: 'Cookies', value: navigator.cookieEnabled ? 'Enabled' : 'Disabled' },
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone }
  ];

  const grid = document.getElementById('envGrid');
  envData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `<div class="label">${item.label}</div><div class="value">${item.value}</div>`;
    grid.appendChild(div);
  });

  // Log environment info to console
  console.log('🖥️ User Environment loaded successfully');
  console.table(envData);

  // 3. External JS button
  document.getElementById('btnExternal').addEventListener('click', () => {
    alert('Hello from External JavaScript! (loaded from script.js)');
  });

  // 4. Console method buttons
  document.getElementById('btnLog').addEventListener('click', () => {
    console.log('📝 This is a console.log() message — used for general output.');
  });

  document.getElementById('btnError').addEventListener('click', () => {
    console.error('❌ This is a console.error() message — used to flag errors.');
  });

  document.getElementById('btnTable').addEventListener('click', () => {
    console.table([
      { Method: 'console.log()', Use: 'General logging' },
      { Method: 'console.error()', Use: 'Error messages' },
      { Method: 'console.table()', Use: 'Tabular data' },
      { Method: 'console.trace()', Use: 'Stack traces' }
    ]);
  });

  document.getElementById('btnTrace').addEventListener('click', () => {
    function outerFunction() {
      function innerFunction() {
        console.trace('🔍 Stack trace from innerFunction → outerFunction');
      }
      innerFunction();
    }
    outerFunction();
  });
});
