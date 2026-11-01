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
  const text = chosen ?? lines[0].textContent;
  task.value = text.slice(0, 120);
  form.hidden = false;
  $('created').hidden = true;
  popup.hidden = false;
  $('create').focus({ preventScroll: true });
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

  form.hidden = true;
  $('created').hidden = false;
  chosen = null;
  getSelection().removeAllRanges();
  selectNextLine();
  setTimeout(closePopup, 900);
});

selectNextLine();
