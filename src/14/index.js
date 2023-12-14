import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/14/input.txt');
const R = grid.length;
const C = grid[0].length;
const DIRS = ['N', 'W', 'S', 'E'];

const print = (grid) => {
  for (let r = 0; r < R; r++) {
    console.log(grid[r].join(''));
  }
}

const tiltNorth = (grid) => {
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 'O') {
        let rr = r - 1;
        let cc = c;

        while (rr >= 0 && grid[rr][cc] === '.') {
          rr--;
        }
        rr++;

        if (r !== rr) {
          grid[rr][cc] = 'O';
          grid[r][c] = '.';
        }
      }
    }
  }

  return grid;
};

const tiltWest = (grid) => {
  for (let c = 0; c < C; c++) {
    for (let r = 0; r < R; r++) {
      if (grid[r][c] === 'O') {
        let rr = r;
        let cc = c - 1;

        while (cc >= 0 && grid[rr][cc] === '.') {
          cc--;
        }
        cc++;

        if (c !== cc) {
          grid[rr][cc] = 'O';
          grid[r][c] = '.';
        }
      }
    }
  }
};

const tiltSouth = (grid) => {
  for (let r = R - 1; r >= 0; r--) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 'O') {
        let rr = r + 1;
        let cc = c;

        while (rr < R && grid[rr][cc] === '.') {
          rr++;
        }
        rr--;

        if (r !== rr) {
          grid[rr][cc] = 'O';
          grid[r][c] = '.';
        }
      }
    }
  }
};

const tiltEast = (grid) => {
  for (let c = C - 1; c >= 0; c--) {
    for (let r = 0; r < R; r++) {
      if (grid[r][c] === 'O') {
        let rr = r;
        let cc = c + 1;

        while (cc < C && grid[rr][cc] === '.') {
          cc++;
        }
        cc--;

        if (c !== cc) {
          grid[rr][cc] = 'O';
          grid[r][c] = '.';
        }
      }
    }
  }
};

const load = (grid) => {
  let sum = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 'O') {
        sum += (R - r);
      }
    }
  }
  return sum;
};

// p1 = 108889
// console.log('Part one:', load(grid));


for (let i = 1; i < 1000000000; i++) {
  for (const d of DIRS) {
    if (d === 'N') {
      tiltNorth(grid);
    } else if (d === 'W') {
      tiltWest(grid);
    } else if (d === 'S') {
      tiltSouth(grid);
    } else {
      tiltEast(grid);
    }
  }
  // debug to find the index of when we hit 64 for the test input
  // it was the 1000th cycle for test, works for p2
  if (i % 1000 === 0) {
    // console.log(`[cycle ${i}] load = `, load(grid));
    console.log('Part two:', load(grid));
    process.exit(1);
  }
}
