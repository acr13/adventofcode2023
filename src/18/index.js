import { readFile } from '../helpers/read.js';

const DELTAS = { 'U': [-1,0], 'D': [1, 0], 'R': [0, 1], 'L': [0, -1] };

const input = readFile('./src/18/input.txt');
const steps = input.map(line => {
  const [dir, n, c] = line.split(' ');
  const color = c.replaceAll('(#', '').replace(')', '');
  return [DELTAS[dir], Number(n), color]
});

// https://gist.github.com/tnraro/f6c0bf3daa711721d3ce0dea1c37124a
const area = (polygon) => {
  const length = polygon.length;
  let sum = 0;

  for (let i = 0; i < length; i += 2) {
    sum += polygon[i] * polygon[(i + 3) % length] - polygon[i + 1] * polygon[(i + 2) % length];
  }

  return Math.abs(sum) * 0.5;
};

const p1 = (steps) => {
  const polygon = [0,0];
  let nPoints = 0;
  let curr = [0,0];

  for (const [delta, n, c] of steps) {
    nPoints += n;
    curr = [curr[0] + (n * delta[0]), curr[1] + (n * delta[1])];
    polygon.push(curr[0], curr[1]);
  }

  const A = area(polygon);
  const b = nPoints;
  const I = A + 1 - (Math.floor(b / 2));
  return I + b;
}

const p2 = (steps) => {
  const DIR_MAP = { 0: 'R', 1: 'D', 2: 'L', 3: 'U' };
  const polygon = [0,0];
  let nPoints = 0;
  let curr = [0,0];

  for (const [_, __, color] of steps) {
    const n = parseInt(color.substring(0, 5), 16);
    const d = color.substring(5);
    const delta = DELTAS[DIR_MAP[d]];

    nPoints += n;
    curr = [curr[0] + (n * delta[0]), curr[1] + (n * delta[1])];
    polygon.push(curr[0], curr[1]);
  }

  const A = area(polygon);
  const b = nPoints;
  const I = A + 1 - (Math.floor(b / 2));
  return I + b;
};

console.log('Part one:', p1(steps));
console.log('Part two:', p2(steps));