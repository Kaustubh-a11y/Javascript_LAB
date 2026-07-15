// Practical 08 — Gym Admission Form (SaaS Style)
// Demonstrates: form events (input, change, click, submit), preventDefault,
//               live validation, classList, dataset, DOM access

document.addEventListener('DOMContentLoaded', () => {

  // ─── Theme Toggle ───
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('p08_theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('p08_theme', next);
  });

  // ─── Validators ───
  const rules = {
    fullName: v => v.trim().length >= 3,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: v => /^\d{10}$/.test(v.replace(/\s|-/g, '')),
    age: v => { const n = parseInt(v); return n >= 16 && n <= 65; }
  };

  // ─── Live Validation (input event) ───
  function attachValidation(id, hintId, ruleName) {
    const input = document.getElementById(id);
    const hint = document.getElementById(hintId);

    // 'input' event fires on every keystroke
    input.addEventListener('input', () => {
      const val = input.value;
      if (val.length === 0) {
        input.classList.remove('valid', 'invalid');
        hint.classList.remove('show');
        return;
      }
      const ok = rules[ruleName](val);
      input.classList.toggle('valid', ok);
      input.classList.toggle('invalid', !ok);
      hint.classList.toggle('show', !ok);
    });

    // 'blur' event — validate on leaving field
    input.addEventListener('blur', () => {
      if (input.value.trim() && !rules[ruleName](input.value)) {
        hint.classList.add('show');
        input.classList.add('invalid');
      }
    });
  }

  attachValidation('fullName', 'nameHint', 'fullName');
  attachValidation('email', 'emailHint', 'email');
  attachValidation('phone', 'phoneHint', 'phone');
  attachValidation('age', 'ageHint', 'age');

  // ─── BMI Auto-Calculate (change event on height/weight) ───
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');

  function calcBMI() {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);
    const display = document.getElementById('bmiDisplay');

    if (h > 0 && w > 0) {
      const bmi = w / ((h / 100) ** 2);
      let category, color, bg;

      if (bmi < 18.5) { category = 'Underweight'; color = '#3B82F6'; bg = '#DBEAFE'; }
      else if (bmi < 25) { category = 'Normal'; color = '#059669'; bg = '#D1FAE5'; }
      else if (bmi < 30) { category = 'Overweight'; color = '#D97706'; bg = '#FEF3C7'; }
      else { category = 'Obese'; color = '#DC2626'; bg = '#FEE2E2'; }

      document.getElementById('bmiValue').textContent = bmi.toFixed(1);
      const catEl = document.getElementById('bmiCategory');
      catEl.textContent = category;
      catEl.style.background = bg;
      catEl.style.color = color;
      display.style.display = 'flex';
    } else {
      display.style.display = 'none';
    }
  }

  // 'input' event on height and weight
  heightInput.addEventListener('input', calcBMI);
  weightInput.addEventListener('input', calcBMI);

  // ─── Plan Selection (click event + dataset) ───
  document.querySelectorAll('.plan-option').forEach(card => {
    // 'click' event on each plan card
    card.addEventListener('click', () => {
      document.querySelectorAll('.plan-option').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input[type="radio"]').checked = true;
    });
  });

  // ─── Auto-fill Profile Data ───
  document.getElementById('btnFillDemo').addEventListener('click', () => {
    // Fill out demo inputs
    document.getElementById('fullName').value = "Kaustubh Kachole";
    document.getElementById('age').value = 19;
    document.getElementById('email').value = "kaustubh.kachole.batch2024@sitnagpur.siu.edu.in";
    document.getElementById('phone').value = "9999999999";
    document.getElementById('gender').value = "Male";
    document.getElementById('goal').value = "Muscle Gain";
    document.getElementById('height').value = 173;
    document.getElementById('weight').value = 52;
    document.getElementById('terms').checked = true;

    // Trigger validation classes and hide hints
    ['fullName', 'email', 'phone', 'age'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('invalid');
      el.classList.add('valid');
    });

    ['nameHint', 'emailHint', 'phoneHint', 'ageHint'].forEach(id => {
      document.getElementById(id).classList.remove('show');
    });

    // Auto-select Annual plan
    document.querySelectorAll('.plan-option').forEach(c => c.classList.remove('selected'));
    const annualOption = document.querySelector('.plan-option[data-plan="Annual"]');
    annualOption.classList.add('selected');
    annualOption.querySelector('input[type="radio"]').checked = true;

    // Calculate BMI
    calcBMI();

    // Reset Submit Button if disabled
    const submitBtn = document.getElementById('btnSubmit');
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.textContent = 'Submit Admission Form';
    document.getElementById('successBanner').classList.remove('show');
  });

  // ─── Form Submit (submit event + preventDefault) ───
  document.getElementById('gymForm').addEventListener('submit', (e) => {
    // preventDefault stops the default form submission behavior
    e.preventDefault();

    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;
    const terms = document.getElementById('terms').checked;

    // Get selected plan using querySelector
    const selectedPlan = document.querySelector('.plan-option.selected');

    // Validate
    let errors = [];
    if (!rules.fullName(name)) errors.push('Full Name');
    if (!rules.email(email)) errors.push('Email');
    if (!rules.phone(phone)) errors.push('Phone');
    if (!rules.age(age)) errors.push('Age');
    if (!gender) errors.push('Gender');
    if (!goal) errors.push('Fitness Goal');
    if (!selectedPlan) errors.push('Membership Plan');
    if (!terms) errors.push('Terms agreement');

    if (errors.length > 0) {
      alert('Please fix:\n• ' + errors.join('\n• '));
      return;
    }

    // Access plan data via dataset attribute
    const planName = selectedPlan.dataset.plan;
    const planPrice = selectedPlan.dataset.price;

    // Show success
    const banner = document.getElementById('successBanner');
    document.getElementById('successMsg').textContent =
      `${name.trim()}, your ${planName} membership (₹${parseInt(planPrice).toLocaleString()}) application has been submitted successfully.`;
    banner.classList.add('show');
    banner.scrollIntoView({ behavior: 'smooth' });

    // Disable form to prevent double submit
    document.getElementById('btnSubmit').disabled = true;
    document.getElementById('btnSubmit').style.opacity = '0.6';
    document.getElementById('btnSubmit').textContent = 'Submitted ✓';
  });
});
