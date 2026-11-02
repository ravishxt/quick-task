// Dodo can add the key to this page's link. It stays in this browser and leaves the address bar.
const key = new URLSearchParams(location.search).get('license_key');

if (key) {
  document.getElementById('key').textContent = key;
  document.getElementById('key-box').hidden = false;
  document.getElementById('email-step').hidden = true;
  history.replaceState(null, '', location.pathname);

  const copy = document.getElementById('copy');
  copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(key);
    copy.textContent = 'Copied';
  });
}
