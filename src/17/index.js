import { readFileToGridIntegers } from '../helpers/read.js';

const grid = readFileToGridIntegers('./src/17/input.txt');
const R = grid.length;
const C = grid[0].length;
const DELTAS = [ [-1, 0], [0, 1], [1, 0], [0, -1] ];
// N S E W = 0 1 2 3

const traverse = (grid, p2) => {
  // row, col, heat, dir, steps
  const Q = [ [0, 0, 0, -1, -1] ];
  const SEEN = {};
  let min = Infinity;

  while (Q.length) {
    const [r, c, heat, dir, steps] = Q.pop();
    const key = `${r},${c},${dir},${steps}`;

    if (SEEN[key] !== undefined) continue;
    if (r === R - 1 && c === C - 1) {
      // console.log('AT END', heat);
      if (heat < min) {
        min = heat;
      }
    }

    SEEN[key] = heat;

    for (let i = 0; i < DELTAS.length; i++) {
      const rr = r + DELTAS[i][0];
      const cc = c + DELTAS[i][1];
      const newDirection = i;
      const newSteps = newDirection !== dir ? 1 : steps + 1;
      const isntReverse = ((newDirection + 2) % 4) !== dir;

      const validP1 = newSteps <= 3;
      const validP2 = newSteps <= 10 && (newDirection === dir || steps >= 4 || steps === -1);
      const valid = p2 ? validP2 : validP1;
      const goodMove = valid && isntReverse;

      if (rr >= 0 && rr < R && cc >= 0 && cc < C && goodMove) {
        const cost = Number(grid[rr][cc]);
        const key = `${rr},${cc},${newDirection},${newSteps}`;
        if (SEEN[key] !== undefined) continue;
        Q.push([rr, cc, heat + cost, newDirection, newSteps]);
      }
    }
  }

  return min;
};

console.log('Part one:', traverse(grid, false));
console.log('Part one:', traverse(grid, true));