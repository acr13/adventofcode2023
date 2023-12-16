import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/16/input.txt');
const R = grid.length;
const C = grid[0].length;

// North, East, South, West = 0, 1, 2, 3
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

const move = (r, c, d) => [r + DR[d], c + DC[d], d];

const SPLITTERS = {
  '/': { 0: 1, 1: 0, 2: 3, 3: 2 },
  '\\': { 0: 3, 1: 2, 2: 1, 3: 0 },
}

const energize = (sr, sc, sd) => {
  let beams = [ [sr, sc, sd] ];
  const SEEN = new Set();
  const SEEN2 = new Set();

  while (true) {
    let newBeams = [];
    if (!beams.length) {
      break;
    }

    for (const [r, c, d] of beams) {
      if (r >= 0 && r < R && c >= 0 && c < C) {
        const key = `${r},${c}`;
        SEEN.add(key);
        if (SEEN2.has(`${key},${d}`)) continue;
        SEEN2.add(`${key},${d}`);

        const cell = grid[r][c];
        if (cell === '.') {
          newBeams.push(move(r, c, d));
        } else if (cell === '/' || cell === '\\') {
          newBeams.push(move(r, c, SPLITTERS[cell][d]));
        } else if (cell === '|') {
          if (d === 0 || d === 2) { // do nothing
            newBeams.push(move(r, c, d));
          } else {
            newBeams.push(move(r, c, 0));
            newBeams.push(move(r, c, 2));
          }
        } else if (cell === '-') {
          if (d === 1 || d === 3) { // pass thru
            newBeams.push(move(r, c, d));
          } else {
            newBeams.push(move(r, c, 1));
            newBeams.push(move(r, c, 3));
          }
        } else {
          throw new Error('????????');
        }
      }
    }

    beams = newBeams;
  }

  return SEEN.size;
};

console.log('Part one:', energize(0,0,1));

let max = -1;
for (let r = 0; r < R; r++) {
  max = Math.max(max, energize(r, 0, 1)); // east
  max = Math.max(max, energize(r, C - 1, 3)); // west
}
for (let c = 0; c < C; c++) {
  max = Math.max(max, energize(0, c, 2)); // south
  max = Math.max(max, energize(R - 1, c, 0)); // north
}
console.log('Part two:', max);