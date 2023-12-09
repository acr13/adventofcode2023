import { readFile } from '../helpers/read.js';

const input = readFile('./src/9/input.txt');

let p1 = 0;
let p2 = 0;

const f = (numbers, p2) => {
  const D = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    D.push(numbers[i + 1] - numbers[i]);
  }

  if (D.every(x => x === 0)) {
    return numbers[numbers.length - 1];
  } else {
    return p2 ?
      numbers[0] - f(D, p2) :
      numbers[numbers.length - 1] + f(D, p2);
  }
};

input.forEach(line => {
  const numbers = line.split(' ').map(Number);
  p1 += f(numbers, false);
  p2 += f(numbers, true);
});

console.log('Part one:', p1);
console.log('Part two:', p2);