const EXTENSION_ID = 'fpibmdaknlnfhgpfigkmcmgkjjlnffla';

// Dodo can add the key to this page's link. It stays in this browser and leaves the address bar.
const key = new URLSearchParams(location.search).get('license_key');

// Only show something shaped like a key, so a crafted link cannot show other text here.
if (key && /^[A-Za-z0-9_-]{8,100}$/.test(key)) {
  document.getElementById('key').textContent = key;
  document.getElementById('key-box').hidden = false;
  document.getElementById('email-step').hidden = true;
  history.replaceState(null, '', location.pathname);

  turnOnUnlimited(key);

  const copy = document.getElementById('copy');
  copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(key);
    copy.textContent = 'Copied';
  });
}

// Chrome lets this page message the extension because the extension lists this site.
function turnOnUnlimited(licenseKey) {
  if (!window.chrome?.runtime?.sendMessage) return;
  const status = document.getElementById('auto-status');
  status.textContent = 'Turning on Unlimited in Quick Task...';
  status.hidden = false;
  try {
    chrome.runtime.sendMessage(EXTENSION_ID, { type: 'activate', key: licenseKey }, (reply) => {
      if (chrome.runtime.lastError || !reply) {
        status.hidden = true;
        return;
      }
      if (reply.ok) {
        document.getElementById('title').textContent = 'Unlimited is on';
        status.textContent = 'Quick Task now has unlimited tasks. You can close this page.';
        status.classList.add('done');
        document.querySelector('.next-steps').hidden = true;
      } else {
        status.textContent = `Could not turn it on automatically: ${reply.error} Follow the steps below.`;
      }
    });
  } catch {
    status.hidden = true;
  }
}
