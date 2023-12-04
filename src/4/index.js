import { readFile } from '../helpers/read.js';

const input = readFile('./src/4/input.txt');

const cards = input.map(line => {
  const numbers = line.split(': ')[1];
  const sides = numbers.split(' | ');

  const left = new Set(sides[0].split(' ').filter(n => !!n).map(x => parseInt(x)));
  const right = sides[1].split(' ').filter(n => !!n).map(x => parseInt(x));

  return right.reduce((sum, val) => left.has(val) ? sum + 1 : sum, 0)
});

const p1 = cards.reduce((sum, val) => {
  if (val === 0) return sum;
  else if (val === 1) {
    return sum + val;
  }

  return sum + Math.pow(2, val - 1);
}, 0);

const p2 = (orig) => {
  const cards = orig.map((score, idx) => [idx, score]);

  for (let i = 0; i < cards.length; i++) {
    const [idx, score] = cards[i];

    if (score > 0) {
      let j = idx + 1;
      let i = 0;
      while (i < score) {
        cards.push( [j, cards[j][1]] );
        j++; i++;
      }
    }
  }

  return cards.length;
};

console.log('Part one:', p1);
console.log('Part two:', p2(cards));