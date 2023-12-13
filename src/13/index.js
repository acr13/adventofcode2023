import { readFile } from '../helpers/read.js';

const input = readFile('./src/13/input.txt');
const grids = [ [] ];

for (let i = 0; i < input.length; i++) {
  if (input[i] === '') {
    grids.push([]);
  } else {
    grids[grids.length - 1].push([...input[i].split('')]);
  }
}

const findMirrorScore = (grid, p2) => {
  const R = grid.length;
  const C = grid[0].length;

  for (let c = 0; c < C - 1; c++) {
    let bad = 0;

    for (let dc = 0; dc < C; dc++) {
      let left = c - dc;
      let right = c + 1 + dc;

      if (left >= 0 && right < C) {
        for (let r = 0; r < R; r++) {
          if (grid[r][left] !== grid[r][right]) {
            bad++;
          }
        }
      }
    }

    if (!p2 && bad === 0) {
      return c + 1;
    } else if (p2 && bad === 1) {
      return c + 1;
    }
  }

  for (let r = 0; r < R - 1; r++) {
    let bad = 0;

    for (let dr = 0; dr < R; dr++) {
      let up = r - dr;
      let down = r + 1 + dr;

      if (up >= 0 && down < R) {
        for (let c = 0; c < C; c++) {
          if (grid[up][c] !== grid[down][c]) {
            bad++;
          }
        }
      }
    }

    if (!p2 && bad === 0) {
      return (r+1) * 100;
    } else if (p2 && bad === 1) {
      return (r+1) * 100;
    }
  }

  // console.log('NO MATCHES WHAT THE FUCK');
  // console.log(grid);
  // console.log('n =', idx);
  throw new Error('wtf');
};

const p1 = grids.reduce((sum, grid) => sum + findMirrorScore(grid, false), 0);
const p2 = grids.reduce((sum, grid) => sum + findMirrorScore(grid, true), 0);

console.log('Part one:', p1);
console.log('Part two:', p2);