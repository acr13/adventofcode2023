import { readFile } from '../helpers/read.js';

const input = readFile('./src/6/input.txt');

const time = input[0].split(' ')
  .filter(x => !isNaN(Number(x)))
  .filter(x => !!x)
  .map(Number);
const distance = input[1].split(' ')
  .filter(x => !isNaN(Number(x)))
  .filter(x => !!x)
  .map(Number);

const race = (t, d) => {
  const faster = [];

  for (let i = 0; i < t; i++) {
    const dd = (i * 1) * (t - i);
    if (dd > d) faster.push(d);
  }

  return faster;
};

const p1 = (time, distance) => {
  const l = time.length;
  const wins = [];

  for (let i = 0; i < l; i++) {
    const win = race(time[i], distance[i]);
    wins.push(win.length);
  }

  return wins.reduce((prod, n) => prod * n, 1);
};

const p2 = (time, distance) => {
  const t = Number(time.join(''));
  const d = Number(distance.join(''));
  const win = race(t, d);
  return win.length;
};

console.log('Part one:', p1(time, distance));
console.log('Part two:', p2(time, distance));