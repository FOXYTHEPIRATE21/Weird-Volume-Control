# Weird Volume Control

This project is an interactive exploration of unconventional volume controls using JavaScript and HTML. It lets you experiment with two different approaches to manipulate the volume of a song by arranging draggable points on a canvas.

#Warning
The app is just for fun and its pretty simple, the heuristic is using a matrix(5 rows and 3 columns), so u have to drag the points and paint he number like this:
Row 1: X X X
Row 2: X   X
Row 3: X   X
Row 4: X   X
Row 5: X X X

Row 1:   X
Row 2: X X
Row 3:   X
Row 4:   X
Row 5: X X X

Row 1: X X X
Row 2:     X
Row 3: X X X
Row 4: X
Row 5: X X X

If you dont draw the numbers like this, probably it wont work, have fun!

## Available Modes

### 1. Normal Mode (`dragvolumecontrol.js`)
- Creates a canvas with several points (balls) that you can freely drag around.
- There is no pattern recognition: you simply move the points for fun or to experiment with the interface.
- Serves as a base to understand how to make drag & drop elements in the DOM using pure JavaScript.

### 2. Heuristic Mode (`dragvolumecontrolwithheuristics.js`)
- In addition to dragging points, you can select a group of them by drawing a rectangle with Shift + click and drag.
- The system detects the "constellation" of selected points and normalizes it to a 5x3 grid.
- It compares that grid to digit templates (0-9) using a distance heuristic.
- If the shape resembles a number, it sets the audio volume to that value (e.g., if it recognizes a "3", the volume will be 30%).
- This is an example of simple pattern recognition (without machine learning) in the browser.

## Main Files
- `dragvolumecontrol.html`: HTML structure and audio player.
- `styles/dragvolumecontrol.css`: Visual styles for the canvas and points.
- `scripts/dragvolumecontrol.js`: Logic for the normal mode (drag & drop only).
- `scripts/dragvolumecontrolwithheuristics.js`: Logic for the heuristic mode (pattern detection).

## How to Use
1. Open `dragvolumecontrol.html` in your browser.
2. Change the script in the HTML to use the mode you want:
   - For normal mode: `<script src="scripts/dragvolumecontrol.js"></script>`
   - For heuristic mode: `<script src="scripts/dragvolumecontrolwithheuristics.js"></script>`
3. Drag the points and experiment!

---

**Author:** FOXY_THEPIRATE21

Have fun exploring new ways to control the volume!
