script.js const EXPIRATION_HOURS = 24; let urlStore = JSON.parse(localStorage.getItem('urlStore')) || {};

function saveStore() { localStorage.setItem('urlStore', JSON.stringify(urlStore)); }

function generateSlug(length = 6) { const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let slug = ''; for (let i = 0; i < length; i++) { slug += chars.charAt(Math.floor(Math.random() * chars.length)); } return slug; }

function isExpired(entry) { if (!entry.timestamp) return false; const now = Date.now(); return now - entry.timestamp > EXPIRATION_HOURS * 3600000; }

function cleanupExpired() { for (const slug in urlStore) { if (isExpired(urlStore[slug])) { delete urlStore[slug]; } } saveStore(); }

cleanupExpired();

document.getElementById('url-form').addEventListener('submit', function(event) { event.preventDefault();

const originalUrl = document.getElementById('original-url').value.trim(); let alias = document.getElementById('custom-alias').value.trim();

try { new URL(originalUrl); } catch (_) { alert('Please enter a valid URL.'); return; }

if (alias) { const aliasPattern = /^[a-zA-Z0-9_-]+$/; if (!aliasPattern.test(alias)) { alert('Alias can only contain letters, numbers, hyphens, or underscores.'); return; } if (urlStore[alias]) { alert('Alias already in use. Please choose another.'); return; } } else { do { alias = generateSlug(); } while (urlStore[alias]); }

urlStore[alias] = { target: originalUrl, timestamp: Date.now() }; saveStore();

const shortUrl = ${window.location.origin}${window.location.pathname}#${alias}; const resultDiv = document.getElementById('result'); const shortUrlLink = document.getElementById('short-url'); shortUrlLink.href = shortUrl; shortUrlLink.textContent = shortUrl; resultDiv.classList.remove('hidden');

document.getElementById('url-form').reset(); });

document.getElementById('copy-btn').addEventListener('click', () => { const shortUrl = document.getElementById('short-url').textContent; navigator.clipboard.writeText(shortUrl) .then(() => alert('Copied to clipboard!')) .catch(() => alert('Failed to copy.')); });

window.addEventListener('load', () => { const slug = window.location.hash.replace('#', ''); const entry = urlStore[slug]; if (slug && entry) { if (isExpired(entry)) { delete urlStore[slug]; saveStore(); alert('This short link has expired.'); } else { window.location.replace(entry.target); } } });
