// Practical 06 — String & Regex Analyzer
// Demonstrates: string functions (trim, split, replace, toUpperCase, indexOf, slice) and regex patterns

document.addEventListener('DOMContentLoaded', () => {

  // Regex patterns
  const patterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    hashtag: /#[a-zA-Z0-9_]+/g,
    url: /https?:\/\/[^\s]+/g
  };

  document.getElementById('btnAnalyze').addEventListener('click', () => {
    const text = document.getElementById('textArea').value;

    if (text.trim().length === 0) {
      alert('Please enter some text to analyze.');
      return;
    }

    // ── Text Statistics (using string functions) ──
    const trimmed = text.trim();
    const chars = trimmed.length;
    const words = trimmed.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readTime = Math.max(1, Math.ceil(words / 200));  // ~200 wpm

    document.getElementById('charCount').textContent = chars;
    document.getElementById('wordCount').textContent = words;
    document.getElementById('sentenceCount').textContent = sentences;
    document.getElementById('readTime').textContent = readTime;
    document.getElementById('statsCard').style.display = 'block';

    // ── Extract Data with Regex ──
    const emails = text.match(patterns.email) || [];
    const phones = text.match(patterns.phone) || [];
    const hashtags = text.match(patterns.hashtag) || [];
    const urls = text.match(patterns.url) || [];

    const extractResults = document.getElementById('extractResults');
    let extractHTML = '';

    const sections = [
      { label: '📧 Emails', items: emails, tagClass: 'tag-email', pattern: patterns.email.source },
      { label: '📱 Phone Numbers', items: phones, tagClass: 'tag-phone', pattern: patterns.phone.source },
      { label: '#️⃣ Hashtags', items: hashtags, tagClass: 'tag-hashtag', pattern: patterns.hashtag.source },
      { label: '🔗 URLs', items: urls, tagClass: 'tag-url', pattern: patterns.url.source }
    ];

    sections.forEach(section => {
      extractHTML += `<div class="extracted-section">
        <h4>${section.label} <span class="text-muted text-sm">(${section.items.length} found)</span></h4>`;

      if (section.items.length > 0) {
        extractHTML += section.items.map(item =>
          `<span class="tag ${section.tagClass}">${item}</span>`
        ).join('');
        extractHTML += `<div class="pattern-display">Pattern: /${section.pattern}/g</div>`;
      } else {
        extractHTML += '<p class="text-muted text-sm">None found</p>';
      }

      extractHTML += '</div>';
    });

    extractResults.innerHTML = extractHTML;
    document.getElementById('extractCard').style.display = 'block';

    // ── Highlighted View (using replace with regex) ──
    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Replace emails with highlighted spans
    highlighted = highlighted.replace(patterns.email, match =>
      `<span class="hl-email">${match}</span>`
    );

    // Replace phones
    highlighted = highlighted.replace(patterns.phone, match =>
      `<span class="hl-phone">${match}</span>`
    );

    // Replace hashtags
    highlighted = highlighted.replace(patterns.hashtag, match =>
      `<span class="hl-hashtag">${match}</span>`
    );

    // Preserve line breaks
    highlighted = highlighted.replace(/\n/g, '<br>');

    document.getElementById('highlightedText').innerHTML = highlighted;
    document.getElementById('highlightCard').style.display = 'block';

    // Scroll to results
    document.getElementById('statsCard').scrollIntoView({ behavior: 'smooth' });
  });
});
