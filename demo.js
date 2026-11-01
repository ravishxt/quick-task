// Hero demo. It copies the extension flow on this page and sends nothing anywhere.
const $ = (id) => document.getElementById(id);
const doc = $('doc');
const popup = $('popup');
const form = $('form');
const task = $('task');
const lines = [...doc.querySelectorAll('.line')];
let chosen = null;
let left = 10;

if (!/Mac|iPhone|iPad/.test(navigator.platform)) $('alt-key').textContent = 'Alt';
if (matchMedia('(pointer: coarse)').matches) $('hint').textContent = 'Tap a sentence, then tap';

function selectLine(line) {
  const range = document.createRange();
  range.selectNodeContents(line);
  const selection = getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function selectNextLine() {
  const next = lines.find((line) => !line.classList.contains('saved'));
  if (next) selectLine(next);
}

function openPopup() {
  for (const key of $('keys').children) key.animate({ transform: ['translateY(2px)', 'translateY(0)'] }, { duration: 160, easing: 'ease-out' });
  popup.classList.remove('leaving');
  const text = chosen ?? lines[0].textContent;
  task.value = text.slice(0, 120);
  form.hidden = false;
  $('created').hidden = true;
  popup.hidden = false;
  $('create').focus({ preventScroll: true });
}

// A short confetti burst from the button when a task lands.
function celebrate(from) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = from.getBoundingClientRect();
  const colors = ['#e2574e', '#f39a6b', '#f2c14e', '#2e8b6f', '#3f7fe0', '#d94f9c'];
  for (let i = 0; i < 18; i += 1) {
    const bit = document.createElement('i');
    bit.className = 'bit';
    bit.style.cssText = `left:${box.left + box.width / 2}px;top:${box.top + box.height / 2}px;background:${colors[i % colors.length]}`;
    document.body.append(bit);
    const angle = Math.random() * Math.PI * 2;
    const reach = 50 + Math.random() * 90;
    bit.animate(
      [{ transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * reach}px,${Math.sin(angle) * reach + 50}px) rotate(${Math.random() * 360}deg) scale(0.6)`, opacity: 0 }],
      { duration: 650 + Math.random() * 250, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    ).onfinish = () => bit.remove();
  }
}

function closePopup() {
  popup.hidden = true;
}

document.addEventListener('selectionchange', () => {
  const selection = getSelection();
  const text = selection.toString().trim().replace(/\s+/g, ' ');
  if (text && doc.contains(selection.anchorNode)) chosen = text;
});

doc.addEventListener('click', (event) => {
  if (getSelection().isCollapsed && event.target.classList.contains('line')) selectLine(event.target);
});

// Keep the page selection when the visitor clicks the keys.
$('keys').addEventListener('mousedown', (event) => event.preventDefault());
$('keys').addEventListener('click', openPopup);

document.addEventListener('keydown', (event) => {
  if (event.altKey && event.shiftKey && event.code === 'KeyA') {
    event.preventDefault();
    openPopup();
  }
  if (event.key === 'Escape') closePopup();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const item = document.createElement('li');
  item.className = 'new';
  item.textContent = task.value;
  const due = document.createElement('small');
  due.textContent = 'Due Thursday';
  item.append(due);
  $('tasks').prepend(item);

  lines.find((line) => line.textContent === task.value)?.classList.add('saved');
  left = Math.max(0, left - 1);
  $('left').textContent = `${left} free ${left === 1 ? 'task' : 'tasks'} left`;

  celebrate($('create'));
  $('keys').classList.remove('nudge');
  form.hidden = true;
  $('created').hidden = false;
  chosen = null;
  getSelection().removeAllRanges();
  selectNextLine();
  setTimeout(() => popup.classList.add('leaving'), 800);
  setTimeout(closePopup, 920);
});

selectNextLine();

$('tasks').addEventListener('click', (event) => event.target.closest('li')?.classList.toggle('done'));
