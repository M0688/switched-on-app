/* Keeps an unfinished lesson on this device, so leaving the screen doesn't lose answers.
   Stored per lesson; cleared once the lesson is saved. Old drafts expire after 3 days. */
const PREFIX = 'switched-on-draft:';
const MAX_AGE = 3 * 24 * 3600 * 1000;

export function loadDraft(key) {
  try {
    const d = JSON.parse(localStorage.getItem(PREFIX + key));
    if (d && Date.now() - d.at < MAX_AGE) return d;
  } catch { /* storage unavailable or bad data */ }
  return null;
}
export function saveDraft(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify({ ...value, at: Date.now() })); } catch { /* ignore */ }
}
export function clearDraft(key) {
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}
