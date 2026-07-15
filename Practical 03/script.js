// Practical 03 — Grading System
// Demonstrates: if-else, switch, for loop, form validation

document.addEventListener('DOMContentLoaded', () => {
  const subjectList = document.getElementById('subjectList');

  // Add subject row
  document.getElementById('btnAddSubject').addEventListener('click', () => {
    const entry = document.createElement('div');
    entry.className = 'subject-entry fade-in';
    entry.innerHTML = `
      <div class="form-group"><label>Subject</label><input class="input" placeholder="Subject name"></div>
      <div class="form-group"><label>Marks</label><input class="input" type="number" min="0" max="100" placeholder="0-100"></div>
      <button class="remove-sub" title="Remove">✕</button>
    `;
    subjectList.appendChild(entry);
    entry.querySelector('.remove-sub').addEventListener('click', () => entry.remove());
  });

  // Remove subject handlers for initial rows
  subjectList.querySelectorAll('.remove-sub').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.remove());
  });

  // Get letter grade using if-else
  function getLetterGrade(pct) {
    if (pct >= 90) return 'A+';
    else if (pct >= 80) return 'A';
    else if (pct >= 70) return 'B+';
    else if (pct >= 60) return 'B';
    else if (pct >= 50) return 'C';
    else if (pct >= 40) return 'D';
    else return 'F';
  }

  // Get grade color using switch
  function getGradeColor(grade) {
    switch (grade) {
      case 'A+': return '#16A34A';
      case 'A':  return '#22C55E';
      case 'B+': return '#65A30D';
      case 'B':  return '#CA8A04';
      case 'C':  return '#EA580C';
      case 'D':  return '#DC2626';
      case 'F':  return '#991B1B';
      default:   return '#888';
    }
  }

  // Get bar color based on marks
  function getBarColor(marks) {
    if (marks >= 75) return '#22C55E';
    if (marks >= 50) return '#F59E0B';
    if (marks >= 35) return '#EA580C';
    return '#EF4444';
  }

  // Calculate
  document.getElementById('btnCalculate').addEventListener('click', () => {
    const entries = subjectList.querySelectorAll('.subject-entry');
    const studentName = document.getElementById('studentName').value.trim() || 'Kaustubh Kachole';

    // Validation
    if (entries.length === 0) {
      alert('Please add at least one subject.');
      return;
    }

    let subjects = [];
    let valid = true;

    // Using for loop to collect data
    for (let i = 0; i < entries.length; i++) {
      const inputs = entries[i].querySelectorAll('input');
      const name = inputs[0].value.trim();
      const marks = parseInt(inputs[1].value);

      if (!name) {
        alert(`Subject ${i + 1}: Please enter a subject name.`);
        inputs[0].classList.add('shake');
        setTimeout(() => inputs[0].classList.remove('shake'), 500);
        valid = false;
        break;
      }

      if (isNaN(marks) || marks < 0 || marks > 100) {
        alert(`${name}: Marks must be between 0 and 100.`);
        inputs[1].classList.add('shake');
        setTimeout(() => inputs[1].classList.remove('shake'), 500);
        valid = false;
        break;
      }

      subjects.push({ name, marks, passed: marks >= 35 });
    }

    if (!valid) return;

    // Calculate totals using for loop
    let totalMarks = 0;
    for (let i = 0; i < subjects.length; i++) {
      totalMarks += subjects[i].marks;
    }

    const percentage = totalMarks / subjects.length;
    const grade = getLetterGrade(percentage);
    const gpa = (percentage / 10).toFixed(1);
    const allPassed = subjects.every(s => s.passed);

    // Fill results
    document.getElementById('resultName').textContent = studentName;
    document.getElementById('resultPct').textContent = percentage.toFixed(1) + '%';
    document.getElementById('resultGpa').textContent = gpa;

    const statusEl = document.getElementById('resultStatus');
    statusEl.textContent = allPassed ? 'PASS ✅' : 'FAIL ❌';
    statusEl.style.color = allPassed ? '#16A34A' : '#DC2626';

    const gradeCircle = document.getElementById('gradeCircle');
    gradeCircle.textContent = grade;
    gradeCircle.style.background = getGradeColor(grade);

    // Subject-wise breakdown
    const resultsDiv = document.getElementById('subjectResults');
    resultsDiv.innerHTML = subjects.map(sub => `
      <div class="subject-result fade-in">
        <span class="name">${sub.name}</span>
        <span class="marks">${sub.marks}/100</span>
        <div class="bar-wrap">
          <div class="progress-bar">
            <div class="fill" style="width: ${sub.marks}%; background: ${getBarColor(sub.marks)}"></div>
          </div>
        </div>
        <span class="status-badge ${sub.passed ? 'success' : 'danger'}">${sub.passed ? 'Pass' : 'Fail'}</span>
      </div>
    `).join('');

    // Show result card
    const resultCard = document.getElementById('resultCard');
    resultCard.classList.add('show');
    resultCard.scrollIntoView({ behavior: 'smooth' });
  });
});
