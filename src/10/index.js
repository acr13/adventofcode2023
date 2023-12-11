import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/10/input.txt');
const R = grid.length;
const C = grid[0].length;

// build a "copy" map 3x as large
const copy = [];
for (let r = 0; r < R*3; r++) {
  copy[r] = [];
  for (let c = 0; c < C*3; c++) {
    copy[r][c] = ".";
  }
}

let start = [-1, -1];
for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    if (grid[r][c] === 'S') {
      start = [r, c];
    }
  }
}

// deltas
let rr = 1;
let cc = 0;
// current
let r = start[0];
let c = start[1];
let steps = 0;

do {
  steps++;
  r += rr;
  c += cc;

  // swap r and c?
  copy[3 * r + 1][3 * c + 1] = '#'
  copy[3 * r + 1 - rr][3 * c + 1 - cc] = '#'
  const curr = grid[r][c];  

  if (curr === 'J' || curr === 'F') {
    [rr, cc] = [-cc, -rr];
  } else if (curr === '7' || curr === 'L') {
    [rr, cc] = [cc, rr];
  }
  copy[3 * r + 1 + rr][3 * c + 1 + cc] = '#'
} while (r !== start[0] || c !== start[1]);

console.log('Part one:', steps / 2);

let queue = [[0,0]];

while (queue.length > 0) {
  let [r,c] = queue.pop();
  copy[r][c] = " "
  
  if (r > 0 && copy[r - 1][c] === '.') queue.push([r - 1,c]);
  if (c>0 && copy[r][c - 1] === '.') queue.push([r,c - 1]);
  if (r < copy.length - 1 && copy[r + 1][c] === '.') queue.push([r + 1,c]);
  if (c < copy[0].length - 1 && copy[r][c+1] === '.') queue.push([r,c + 1]);
}
  
  let p2 = 0;
  for (let y = 1;y < copy.length; y +=3 ) {
    for (let x = 1; x < copy[0].length; x += 3) {
      if (copy[y][x] === '.') p2++;
    }
  }

console.log('Part two:', p2);
