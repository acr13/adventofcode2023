import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/23/input.txt');
const R = grid.length;
const C = grid[0].length;

const adj = (grid, r, c, p2) => {
  if (!p2) {
    if (grid[r][c] === '>') {
      return [ [r, c + 1] ];
    } else if (grid[r][c] === '<') {
      return [ [r, c - 1] ];
    } else if (grid[r][c] === '^') {
      return [ [r - 1, c] ];
    } else if (grid[r][c] === 'v') {
      return [ [r + 1, c] ];
    }
  }

  return [
    [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
  ].filter(([rr, cc]) => rr >= 0 && rr < R && cc >= 0 && cc < C && grid[rr][cc] !== '#');
};

const longestPath = (grid, p2) => {
  let max = -1;
  let start = [0, grid[0].findIndex(c => c === '.')];
  const Q = [ [start[0], start[1], 0, new Set([`${start[0]},${start[1]}`])] ];

  while (Q.length) {
    const [r, c, steps, set] = Q.pop();
    set.add(`${r},${c}`);

    if (r === R - 1 && steps > max) {
      console.log(steps);
      max = steps;
    }

    const next = adj(grid, r, c, p2);
    next.forEach(([rr, cc]) => {
      if (!set.has(`${rr},${cc}`)) {
        Q.push([ rr, cc, steps + 1, new Set(set) ]);
      }
    });
  }

  return max;
};

console.log('Part one:', longestPath(grid));
console.log('Part two:', longestPath(grid, true));