import { readFile } from '../helpers/read.js';

const input = readFile('./src/15/input.txt')[0].split(',');

const hash = (str) => {
  let cur = 0;
  for (let i = 0; i < str.length; i++) {
    cur += str.charCodeAt(i);
    cur *= 17
    cur = cur % 256;
  }

  return cur;
};

const p1 = (input) => input.reduce((sum, str) => sum + hash(str), 0);

const p2 = (input) => {
  const boxes = {};

  for (const step of input) {
    if (step.indexOf('=') > 0) { 
      const [left, lens] = step.split('=')
      const n = hash(left);
      
      if (!boxes[n]) boxes[n] = [];

      let idx = boxes[n].findIndex(([l, _]) => l === left);
      if (idx === -1) {
        boxes[n].push([left, Number(lens)]);
      } else {
        boxes[n][idx] = [left, Number(lens)];
      }
    } else { // -
      const [left] = step.split('-');
      const n = hash(left);

      if (!boxes[n]) boxes[n] = [];
      boxes[n] = boxes[n].filter(([l, _]) => l !== left);
    }
  }

  return Object.entries(boxes).reduce((sum, [box, lenses]) => {
    const b = Number(box) + 1;
    return sum + lenses.reduce((s, [_, f], i) => s + (b * (i + 1) * f), 0);
  }, 0)
};


console.log('Part one:', p1(input));
console.log('Part two:', p2(input));
