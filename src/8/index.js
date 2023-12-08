import { readFile } from '../helpers/read.js';

const input = readFile('./src/8/input.txt');

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const gcm = (a, b) => (a * b) / gcd(a, b);

const parse = (input) => {
  const instr = input[0].split('');
  const map = {};

  for (let i = 2; i < input.length; i++) {
    const [pos, parts] = input[i].split(' = ');
    const [left, right] = parts.replaceAll('(', '').replaceAll(')', '').split(', ');
    map[pos] = [left, right]
  }

  return { instr, map  };
};

const traverse = (start, state, target, findCycle) => {
  const { instr, map } = state;
  let idx = 0;
  let steps = 0;
  let curr = start;
  let endStep = -1;

  while (true) {
    const currentInstr = instr[idx];
    const next = map[curr];
    curr = currentInstr === 'L' ? next[0] : next[1];
    steps++;

    if (findCycle) {
      // p2
      if (curr.endsWith('Z')) {
        if (endStep === -1) {
          endStep = steps;
        } else {
          return endStep;
        }
      }
    } else {
      // p1
      if (curr === target) {
        return steps;
      }
    }

    idx = (idx + 1) % instr.length;
  }
};

const state = parse(input);
console.log('Part one:', traverse('AAA', state, 'ZZZ'));

const starts = Object.keys(state.map).filter(key => key.endsWith('A'));
const cycles = starts.map(start => traverse(start, state, 'ZZZ', true));
const p2 = cycles.reduce((a, b) => gcm(a, b));
console.log('Part two:', p2);
