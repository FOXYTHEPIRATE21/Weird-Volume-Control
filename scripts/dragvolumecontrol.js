
// Weird Volume Control App
// - Drag the dots on the canvas.
// - Shift + click and drag to create a selection box.
// - The system detects how many dots are in the box (0-9) and sets the audio volume.
// - The volume can only be 0, 10, 20, ..., 90%.

document.addEventListener('DOMContentLoaded', function() {
  const board = document.getElementById('board');
  const volumeDisplay = document.getElementById('volume-display');
  const audio = document.getElementById('audio');

  // Create draggable dots
  const dots = [];
  const DOT_COUNT = 20;
  for (let i = 0; i < DOT_COUNT; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.left = Math.random() * 350 + 'px';
    dot.style.top = Math.random() * 350 + 'px';
    board.appendChild(dot);
    makeDraggable(dot);
    dots.push(dot);
  }

  // Variables for selection
  let selecting = false;
  let selectStart = {x: 0, y: 0};
  let selectorBox = null;

  // Dot drag handling
  function makeDraggable(el) {
    let offsetX, offsetY, isDown = false;
    el.addEventListener('mousedown', (e) => {
  if (e.shiftKey) return; // Do not drag if selecting
      isDown = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      el.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', () => {
      isDown = false;
      el.style.cursor = 'grab';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const rect = board.getBoundingClientRect();
      let x = e.clientX - rect.left - offsetX;
      let y = e.clientY - rect.top - offsetY;
      x = Math.max(0, Math.min(rect.width - el.offsetWidth, x));
      y = Math.max(0, Math.min(rect.height - el.offsetHeight, y));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    });
  }

  // Selection with shift + click and drag
  board.addEventListener('mousedown', (e) => {
    if (e.shiftKey) {
      selecting = true;
      const rect = board.getBoundingClientRect();
      selectStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  // Create visual selection box
      selectorBox = document.createElement('div');
      selectorBox.style.position = 'absolute';
      selectorBox.style.border = '2px dashed #0f0';
      selectorBox.style.background = 'rgba(0,255,0,0.1)';
      selectorBox.style.pointerEvents = 'none';
      selectorBox.style.left = selectStart.x + 'px';
      selectorBox.style.top = selectStart.y + 'px';
      selectorBox.style.width = '0px';
      selectorBox.style.height = '0px';
      selectorBox.id = 'selector-box';
      board.appendChild(selectorBox);
    }
  });

  board.addEventListener('mousemove', (e) => {
    if (selecting && selectorBox) {
      const rect = board.getBoundingClientRect();
      const currX = e.clientX - rect.left;
      const currY = e.clientY - rect.top;
      const left = Math.min(selectStart.x, currX);
      const top = Math.min(selectStart.y, currY);
      const width = Math.abs(currX - selectStart.x);
      const height = Math.abs(currY - selectStart.y);
      selectorBox.style.left = left + 'px';
      selectorBox.style.top = top + 'px';
      selectorBox.style.width = width + 'px';
      selectorBox.style.height = height + 'px';
    }
  });

  board.addEventListener('mouseup', (e) => {
    if (selecting && selectorBox) {
      selecting = false;
  // Calculate dots inside the rectangle
      const rect = board.getBoundingClientRect();
      const x1 = parseInt(selectorBox.style.left);
      const y1 = parseInt(selectorBox.style.top);
      const x2 = x1 + parseInt(selectorBox.style.width);
      const y2 = y1 + parseInt(selectorBox.style.height);
      let count = 0;
      dots.forEach(dot => {
  const dx = parseInt(dot.style.left) + 10; // center of the dot
        const dy = parseInt(dot.style.top) + 10;
        if (dx >= x1 && dx <= x2 && dy >= y1 && dy <= y2) {
          count++;
        }
      });
  // Only values 0-9
      let digit = Math.max(0, Math.min(9, count));
  // Set volume
      let volume = digit * 0.1;
      if (audio) audio.volume = volume;
      volumeDisplay.textContent = `Volume: ${digit * 10}%`;
  // Remove selection box
      selectorBox.remove();
      selectorBox = null;
    }
  });
});
