import { readFile } from '../helpers/read.js';

const input = readFile('./src/5/input.txt');

// const KEYS = [];

const parse = (input) => {
  const state = {
    seeds: input[0].split(': ')[1].split(' ').map(x => parseInt(x)),
  };

  let key = '';

  for (let i = 1; i < input.length; i++) {
    const line = input[i];
    if (line === '') continue;

    if (line.startsWith('seed-to-soil')) {
      key = 'seedToSoil'; continue;
    } else if (line.startsWith('soil-to-fertilizer')) {
      key = 'soilToFert'; continue;
    } else if (line.startsWith('fertilizer-to-water')) {
      key = 'fertToWater'; continue;
    } else if (line.startsWith('water-to-light')) {
      key = 'waterToLight'; continue;
    } else if (line.startsWith('light-to-temperature')) {
      key = 'lightToTemp'; continue;
    } else if (line.startsWith('temperature-to-humidity')) {
      key = 'tempToHumidity'; continue;
    } else if (line.startsWith('humidity-to-location')) {
      key = 'hunidityToLocation'; continue;
    }

    if (!state[key]) {
      state[key] = [];
    };

    const [dest, source, diff] = line.split(' ').map(Number);
    state[key].push( [source, source + (diff - 1), dest] );
  }

  return state;
};

const mapSeedToLocation = (seed, state) => {
  const keys = Object.keys(state).filter(k => k !== 'seeds');
  let n = seed;

  for (const key of keys) {
    let mapped = false;
    for (const [low, high, dest] of state[key]) {
      if (mapped) continue;

      if (n >= low && n <= high) {
        n = dest + (n - low);
        mapped = true;
      }
    }
  }

  return n;
};

const lowestLocation = (state) => {
  let min = Infinity;
  const { seeds } = state;

  for (const seed of seeds) {
    const loc = mapSeedToLocation(seed, state);
    if (loc < min) min = loc;
  }

  return min;
};

let state = parse(input);
const p1 = lowestLocation(state);
console.log('Part one:', p1)

const p2 = (state) => {
  let min = Infinity;

  for (let i = 0; i < state.seeds.length; i++) {
    const start = state.seeds[i];
    const diff = state.seeds[i + 1];
  
    for (let n = start; n < (start + diff); n++) {
      const loc = mapSeedToLocation(n, state);
      if (loc < min) min = loc;
    }
    i++;
  }
};

console.log('Part two:', p2(state));
