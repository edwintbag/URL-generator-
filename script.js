// script.js // In-memory store for URL mappings (slug -> original URL) const urlStore = {};

// Utility: generate random alphanumeric slug of length 6 function generateSlug(length = 6) { const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let slug = ''; for (let i = 0; i < length; i++) { slug += chars.charAt(Math.floor(Math.random() * chars.length)); } return slug; }

// Handler for form submission document.getElementById('url-form').addEventListener('submit', function(event) { event.preventDefault();

const originalUrl = document.getElementById('original-url').value.trim(); let alias = document.getElementById('custom-alias').value.trim();

// Validate URL format try { new URL(originalUrl); } catch (_) { alert('Please enter a valid URL.'); return; }

// If alias provided, ensure it's alphanumeric if (alias) { const aliasPattern = /^[a-zA-Z0-9_-]+$/; if (!aliasPattern.test(alias)) { alert('Alias can only contain letters, numbers, hyphens, or underscores.'); return; } if (urlStore[alias]) { alert('Alias already in use. Please choose another or leave blank.'); return; } } else { // Generate unique slug if no alias do { alias = generateSlug(); } while (urlStore[alias]); }

// Store mapping urlStore[alias] = originalUrl;

// Display result const shortUrl = ${window.location.origin}/${alias}; const resultDiv = document.getElementById('result'); const shortUrlLink = document.getElementById('short-url'); shortUrlLink.href = shortUrl; shortUrlLink.textContent = shortUrl; resultDiv.classList.remove('hidden');

// Optionally, reset form document.getElementById('url-form').reset(); });

// Redirect logic for when user visits /:slug if (window.location.pathname.length > 1) { const slug = window.location.pathname.substring(1); const destination = urlStore[slug]; if (destination) { window.location.replace(destination); } }
