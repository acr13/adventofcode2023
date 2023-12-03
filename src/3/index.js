import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/3/input.txt');

const adj = (grid, r, c) => [
    [r - 1, c - 1], [r - 1, c], [r - 1, c + 1],
    [r, c - 1], [r, c + 1],
    [r + 1, c - 1], [r + 1, c], [r + 1, c + 1],
  ]
    .filter(([rr, cc]) => rr >= 0 && rr < grid.length && cc >= 0 && cc < grid[rr].length);

const isPart = (grid, r, c) => {
  return adj(grid, r, c)
    .map(([rr, cc]) => grid[rr][cc])
    .filter(cell => isNaN(Number(cell)))
    .some(cell => cell !== '.');
}

const p1 = (grid) => {
  const parts = [];
  let partStr = '';
  let match = false;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const isNumber = !isNaN(Number(grid[r][c]));

      if (isNumber) {
        partStr += grid[r][c];
        if (isPart(grid, r, c)) match = true;
      } else if (!isNumber || c === grid[r].length) {
        // if we hit a non-number or the end of the row, check and see if we have a part
        if (match) {
          parts.push(Number(partStr));
        }

        partStr = '';
        match = false;
      }
    }
  }

  // if the last possible cells is a number
  if (match) {
    parts.push(Number(partStr));
  }

  // console.log(parts);
  return parts.map(x => Number(x)).reduce((sum, n) => sum + n, 0)
};

const p2 = (grid) => {
  const gears = {};
  let partStr = '';
  let gearsMatch = new Set();

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const isNumber = !isNaN(Number(grid[r][c]));

      if (isNumber) {
        partStr += grid[r][c];
        if (isPart(grid, r, c)) {
          const adjacents = adj(grid, r, c)
            .map(([rr, cc]) => [[rr, cc], grid[rr][cc]]);
          const gear = adjacents.filter(([_, c] ) => c === '*');
          // if the adj symbol is a gear, keep track of this gear coordinate
          // (there can be many adj gears, though)
          if (gear.length > 0) {
            gear.forEach(([coord, _]) => gearsMatch.add(coord.join(',')));
          }
        }
      } else if (!isNumber || c === grid[r].length) {   
        if (gearsMatch.size > 0) {
          gearsMatch.forEach(key => {
            if (!gears[key]) gears[key] = [];
            gears[key].push(Number(partStr));
          });
        }

        partStr = '';
        gearsMatch = new Set();
      }
    }
  }

  return Object.values(gears).filter(numbers => numbers.length === 2)
    .map(([x,y]) => x * y)
    .reduce((sum, val) => sum + val, 0);
};


console.log('Part one:', p1(grid));
console.log('Part two:', p2(grid));
