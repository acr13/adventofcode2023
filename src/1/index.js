import { readFileSync } from 'node:fs'

const DIGITS = {
  'one' : 'o1e',
  'two' : 't2o',
  'three' : 't3e',
  'four' : 'f4r',
  'five' : 'f5e',
  'six' : 's6x',
  'seven' : 's7n',
  'eight' : 'e8t',
  'nine' : 'n9e',
};

const input = readFileSync('./src/1/input.txt', 'utf-8').split(/\r?\n/);

const p1 = input.reduce((sum, line) => {
  const digits = line.split('')
    .filter(c => !isNaN(Number(c)))
    .map(c => Number(c));
  return sum + parseInt(`${digits[0]}${digits[digits.length - 1]}`);
}, 0);

const replaceWordsInLine = (line) => {
  let l = line;
  for (const [k, v] of Object.entries(DIGITS)) {
    l = l.replaceAll(k, v);
  }
  return l;
}

const p2 = input.reduce((sum, line) => {
  const l = replaceWordsInLine(line);
  const digits = l.split('')
    .filter(c => !isNaN(Number(c)))
    .map(c => Number(c));
  return sum + parseInt(`${digits[0]}${digits[digits.length - 1]}`);
}, 0);

console.log('Part one:', p1);
console.log('Part two:', p2);