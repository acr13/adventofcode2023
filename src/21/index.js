import { readFileToGrid } from '../helpers/read.js';

const grid = readFileToGrid('./src/21/input.txt');
const R = grid.length;
const C = grid[0].length;

const key = (x, y, z) => (z * 1000 + x) * 1000 + y;

const getStart = (grid) => {
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 'S') {
        return [r, c];
      }
    }
  }
};

const adj = (grid, r, c) => [
    [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
  ].filter(([rr, cc]) => rr >= 0 && rr < R && cc >= 0 && cc < C && grid[rr][cc] !== '#');

// fuck me what the fuck
// const p1 = (grid, start, N) => {
//   // let curr = [...start];
//   let Q = [ start ];
//   let seen;

//   for (let i = 0; i < N; i++) {
//     // console.log('step:', i);
//     // console.log(Q.length);

//     let nextQ = [];
//     seen = new Set();

//     while (Q.length) {
//       const [r, c] = Q.pop();
//       const next = adj(grid, r, c);
//       console.log(next);

//       next.forEach(([rr, cc]) => {
//         nextQ.push([rr, cc]);
//         seen.add(`${rr},${cc}`);
//       });
//     }

//     Q = nextQ;
//     console.log(seen.size);
//   }  

//   return seen.size;
// }

const p1Recursive = (grid, x, y, maxSteps, visited, distance) => {
  const k = key(x, y, distance);

  if (visited.has(k)) return 0;
  visited.add(k);
  if (distance === maxSteps) return 1;

  let count = 0;
  const next = adj(grid, x, y);
  next.forEach(([nx, ny]) => {
      count += p1Recursive(grid, nx, ny, maxSteps, visited, distance + 1);
  });

  return count;
};

export const p2 = (grid, steps, start) => {
  const startY = start[0]
  const startX = start[1];
  const gardenGridDiameter = ~~(steps / R) - 1;

  const oddGardens = (~~(gardenGridDiameter / 2) * 2 + 1) ** 2;
  const evenGardens = (~~((gardenGridDiameter + 1) / 2) * 2) ** 2;

  const oddGardenPlots = p1Recursive(grid, startX, startY, R * 2 + 1, new Set(), 0);
  const evenGardenPlots = p1Recursive(grid, startX, startY, R * 2,new Set(), 0);

  const northPlots = p1Recursive(grid, startX, R - 1, R - 1, new Set(), 0);
  const eastPlots = p1Recursive(grid, 0, startY, R - 1, new Set(), 0);
  const southPlots = p1Recursive(grid, startX, 0, R - 1, new Set(), 0);
  const westPlots = p1Recursive(grid, R - 1, startY, R - 1, new Set(), 0);

  const smallSteps = ~~(R / 2) - 1;

  const NEPlotsSM = p1Recursive(grid, 0, R - 1, smallSteps, new Set(), 0);
  const NWPlotsSM = p1Recursive(grid, R - 1, R - 1, smallSteps, new Set(), 0);
  const SEPlotsSM = p1Recursive(grid, 0, 0, smallSteps, new Set(), 0);
  const SWPlotsSM = p1Recursive(grid, R - 1, 0, smallSteps, new Set(), 0);

  const largeSteps = ~~((R * 3) / 2) - 1;

  const NEPlotsLG = p1Recursive(grid, 0, R - 1, largeSteps, new Set(), 0);
  const NWPlotsLG = p1Recursive(grid, R - 1, R - 1, largeSteps, new Set(), 0);
  const SEPlotsLG = p1Recursive(grid, 0, 0, largeSteps, new Set(), 0);
  const SWPlotsLG = p1Recursive(grid, R - 1, 0, largeSteps, new Set(), 0);

  const mainGardenPlots = oddGardens * oddGardenPlots + evenGardens * evenGardenPlots;
  const smallSidePlots =(gardenGridDiameter + 1) * (SEPlotsSM + SWPlotsSM + NWPlotsSM + NEPlotsSM);
  const largeSidePlots = gardenGridDiameter * (SEPlotsLG + SWPlotsLG + NWPlotsLG + NEPlotsLG);

  return (
    mainGardenPlots +
    smallSidePlots +
    largeSidePlots +
    northPlots +
    eastPlots +
    southPlots +
    westPlots
  );
};

const start = getStart(grid);
console.log('Part one:', p1Recursive(grid, start[0], start[1], 64, new Set(), 0));
console.log('Part two:', p2(grid, 26501365, start));