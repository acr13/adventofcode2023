import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/11/input.txt');

const shortestDistance = (r, c, rr, cc) => Math.abs(r - rr) + Math.abs(c - cc);

const parse = (grid, scale) => {
  const galaxies = [];
  const emptyRows = {};
  // keep track of columns with galaxies
  // and how many 'cells' we have to move them over to the right
  const columnDeltas = {};
  let g = 1;

  // adjust rows
  for (let r = 0; r < grid.length; r++) {
    const hasGalaxyInRow = grid[r].indexOf('#');

    if (hasGalaxyInRow === -1) {
      emptyRows[r] = true;      
    } else {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === '#') {
          columnDeltas[c] = 0;
          const nEmptyRows = Object.keys(emptyRows).length;
          galaxies.push([r + nEmptyRows * (scale - 1), c]);
        }
      } 
    }
  }

  // adjust columns
  let count = 0;
  const C = grid[0].length;
  for (let i = 0; i < C; i++) {
    if (columnDeltas[i] === undefined) { 
      count += scale - 1;
    } else {
      columnDeltas[i] = count;
    }
  }

  // move galaxies over as well
  return galaxies.map(([r, c]) => [r, c + columnDeltas[c]]);
};

const run = (scale) => {
  const galaxies = parse(grid, scale);
  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    const [r, c] = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const [rr, cc] = galaxies[j];
      sum += shortestDistance(r, c, rr, cc);
    }
  }

  return sum;
};

console.log('Part one:', run(2));
console.log('Part two:', run(1000000));
