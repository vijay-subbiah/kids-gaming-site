// scripts.js
// Loads branding, theme, and games data, and populates the DOM accordingly.

async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

async function applyBranding() {
  const branding = await loadJSON('data/branding.json');
  // Logo
  document.getElementById('logo').src = branding.logo || '';
  // Slogan
  document.getElementById('slogan').textContent = branding.slogan || '';
  // Favicon
  if (branding.favicon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = branding.favicon;
  }
  // Social Media
  const social = branding.socialMedia || {};
  const icons = {
    linkedin: '🔗',
    instagram: '📸',
    github: '🐙',
    x: '✖️',
    youtube: '▶️',
    blog: '📝'
  };
  const socialIcons = document.getElementById('social-icons');
  socialIcons.innerHTML = '';
  Object.entries(social).forEach(([key, url]) => {
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = key.charAt(0).toUpperCase() + key.slice(1);
      a.textContent = icons[key] || key;
      socialIcons.appendChild(a);
    }
  });
  // Contact Info
  const contact = branding.contact || {};
  const contactInfo = document.getElementById('contact-info');
  contactInfo.innerHTML = `
    <a href="mailto:${contact.email}">${contact.email}</a> |
    <a href="tel:${contact.mobile}">${contact.mobile}</a>
  `;
  // Theme
  if (branding.theme && branding.theme.colors) {
    Object.entries(branding.theme.colors).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--${k}`, v);
    });
  }
  if (branding.theme && branding.theme.font) {
    document.documentElement.style.setProperty('--font', branding.theme.font);
  }
  // TODO: student exercise: Add chatbot avatar to UI
}

async function applyGames() {
  const gamesData = await loadJSON('data/games.json');
  document.getElementById('site-title').textContent = gamesData.siteTitle || '';
  // Hero tagline
  // Already handled by branding.slogan
  // Games
  const gamesContainer = document.getElementById('games-container');
  gamesContainer.innerHTML = '';
  (gamesData.games || []).forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${game.thumb}" alt="${game.name} thumbnail" style="width:100%;border-radius:8px;" />
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <span>Difficulty: ${game.difficulty}</span><br>
      <a class="btn" href="${game.url}" target="_blank">Play</a>
    `;
    gamesContainer.appendChild(card);
  });
  // TODO: student exercise: Add search/filter functionality for games
}

function applyCountdown() {
  loadJSON('data/games.json').then(gamesData => {
    const target = new Date(gamesData.countdownTarget);
    const countdownEl = document.getElementById('countdown');
    function updateCountdown() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        countdownEl.textContent = 'Event started!';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyBranding();
  applyGames();
  applyCountdown();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// TODO: student exercise: Add accessibility improvements
