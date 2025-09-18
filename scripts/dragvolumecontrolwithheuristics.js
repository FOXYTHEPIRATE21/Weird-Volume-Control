
// Weird Volume Control App with heuristic pattern recognition
// - Drag the dots on the canvas.
// - Shift + click and drag to create a selection box.
// - The system recognizes the shape (0-9) formed by the dots in the box and sets the audio volume.
// - The volume can only be 0, 10, 20, ..., 90%.

document.addEventListener('DOMContentLoaded', function() {
  // DOM element references
  const audio = document.getElementById('audio');
  const board = document.getElementById('board');
  const volumeDisplay = document.getElementById('volume-display');


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
  let selecting = false; // Indicates if selecting
  let selectStart = {x: 0, y: 0}; // Initial drag point
  let selectorBox = null; // Visual selection box

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
      const x1 = parseInt(selectorBox.style.left);
      const y1 = parseInt(selectorBox.style.top);
      const x2 = x1 + parseInt(selectorBox.style.width);
      const y2 = y1 + parseInt(selectorBox.style.height);

  // Get the selected dots and their positions
      const selectedDots = [];
      dots.forEach(dot => {
  const dx = parseInt(dot.style.left) + 10; // center of the dot
        const dy = parseInt(dot.style.top) + 10;
        if (dx >= x1 && dx <= x2 && dy >= y1 && dy <= y2) {
          selectedDots.push({x: dx, y: dy});
        }
      });


  // If there are too few dots, do not try to recognize
      let digit = 0;
      if (selectedDots.length >= 2) {
  // Use the real bounding box of the selected dots to normalize (creates the smallest possible box containing all dots)
        let minX = Math.min(...selectedDots.map(p => p.x));
        let maxX = Math.max(...selectedDots.map(p => p.x));
        let minY = Math.min(...selectedDots.map(p => p.y));
        let maxY = Math.max(...selectedDots.map(p => p.y));
  const grid = pointsToGrid( //calls function that turns selection into a 5x3 grid / 5 rows and 3 columns matrix
          selectedDots,
          {left: minX, top: minY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY)}
        );
  // Find the most similar digit
        let minDist = Infinity;
        for (let i = 0; i < DIGIT_TEMPLATES.length; i++) {
          const dist = gridDistance(grid, DIGIT_TEMPLATES[i]);
          if (dist < minDist) {
            minDist = dist;
            digit = i;
          }
        }
      }

  // Set volume
      let volume = digit * 0.1;
      if (audio) audio.volume = volume;
      volumeDisplay.textContent = `Volume: ${digit * 10}% (Reconocido: ${digit})`;

  // Remove selection box
      selectorBox.remove();
      selectorBox = null;
    }
  });

});

// Digit templates 0-9 in 5x3 grid
const DIGIT_TEMPLATES = [
  [ // 0
    [1,1,1],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,1,1]
  ],
  [ // 1
    [0,1,0],
    [1,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1]
  ],
  [ // 2
    [1,1,1],
    [0,0,1],
    [1,1,1],
    [1,0,0],
    [1,1,1]
  ],
  [ // 3
    [1,1,1],
    [0,0,1],
    [1,1,1],
    [0,0,1],
    [1,1,1]
  ],
  [ // 4
    [1,0,1],
    [1,0,1],
    [1,1,1],
    [0,0,1],
    [0,0,1]
  ],
  [ // 5
    [1,1,1],
    [1,0,0],
    [1,1,1],
    [0,0,1],
    [1,1,1]
  ],
  [ // 6
    [1,1,1],
    [1,0,0],
    [1,1,1],
    [1,0,1],
    [1,1,1]
  ],
  [ // 7
    [1,1,1],
    [0,0,1],
    [1,1,1],
    [0,0,1],
    [0,0,1]
  ],
  [ // 8
    [1,1,1],
    [1,0,1],
    [1,1,1],
    [1,0,1],
    [1,1,1]
  ],
  [ // 9
    [1,1,1],
    [1,0,1],
    [1,1,1],
    [0,0,1],
    [1,1,1]
  ]
];

// Converts the selected dots to a 5x3 grid
// Calculates if a dot is at a coordinate (x, y), then given the rectangle containing them (rect), calculates in which cell of the 5x3 grid the dot falls and marks that cell as occupied (1)
function pointsToGrid(selectedDots, rect, gridRows = 5, gridCols = 3) {
  const grid = Array.from({length: gridRows}, () => Array(gridCols).fill(0));
  selectedDots.forEach(dot => {
    const gx = Math.floor(((dot.x - rect.left) / rect.width) * gridCols);
    const gy = Math.floor(((dot.y - rect.top) / rect.height) * gridRows);
    if (gx >= 0 && gx < gridCols && gy >= 0 && gy < gridRows) {
      grid[gy][gx] = 1;
    }
  });
  return grid;
}

// Calculates the "distance" between two grids (how many cells differ between the two matrices)
function gridDistance(a, b) {
  let dist = 0;
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < a[0].length; x++) {
      if (a[y][x] !== b[y][x]) dist++;
    }
  }
  return dist;
}