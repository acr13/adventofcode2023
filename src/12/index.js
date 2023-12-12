import { readFile } from '../helpers/read.js';

const input = readFile('./src/12/input.txt');

// i == curr index of spring
// ti == curr index of target
// groupLen == curr length of the current block of '#'
const solveDP = (spring, target, i, ti, groupLen) => {
  const key = `${i},${ti},${groupLen}`;
  if (DP[key]) return DP[key];

  if (i === spring.length) {
    if (ti === target.length && groupLen === 0) {
      return 1;
    } else if (ti === target.length - 1 && target[ti] === groupLen) {
      return 1;
    } else {
      return 0;
    }
  }

  let sum = 0;
  ['.', '#'].forEach(c => {
    if (spring[i] === c || spring[i] === '?') {
      if (c === '.' && groupLen === 0) {
        sum += solveDP(spring, target, i + 1, ti, 0);
      } else if (c == '.' && groupLen > 0 && ti < target.length && target[ti] === groupLen) {
        sum += solveDP(spring, target, i + 1, ti + 1, 0);
      } else if (c === '#') {
        sum += solveDP(spring, target, i+1, ti, groupLen + 1);
      }
    }
  });

  DP[key] = sum;
  return sum;
};

const p1 = () => {
  let sum = 0;

  for (const line of input) {
    const [left, right] = line.split(' ');

    DP = {};
    const spring = left.split('');
    const target = right.split(',').map(Number);
    sum += solveDP(spring, target, 0, 0, 0);
  }

  return sum;
};

const p2 = () => {
  let sum = 0;

  for (const line of input) {
    const [left, right] = line.split(' ');

    DP = {};
    let spring = [left, left, left, left, left].join('?').split('');
    let target = right.split(',').map(Number);
    target = [target, target, target, target, target].flat().map(Number);
    sum += solveDP(spring, target, 0, 0, 0);
  }

  return sum;
};

let DP = {};
console.log('Part one:', p1()); // 7705
DP = {};
console.log('Part two:', p2()); // 50338344809230