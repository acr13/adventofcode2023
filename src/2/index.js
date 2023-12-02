import { readFileSync } from 'node:fs'

const games = readFileSync('./src/2/input.txt', 'utf-8')
  .split(/\r?\n/)
  .map((game) => {
    const [, line] = game.split(': ');
    const games = line.split(';');
    const rounds = games.map(game => game.split(',').map(x => x.trim()));
    return rounds.map(round => {
      return round.map(marble => {
        const [n, c] = marble.split(' ');
        return [parseInt(n), c];
      });
    });
  });

const MAX = {
  'red': 12,
  'green': 13,
  'blue': 14,
};

const p1 = (games) => {
  let sum = 0;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    let valid = true;

    for (const round of game) {
      for (const marble of round) {
        const [n, color] = marble;
        if (MAX[color] < n) {
          valid = false;
        }
      }
    }

    if (valid) {
      sum += (i + 1);
    }
  }

  return sum;
};

const p2 = (games) => {
  let power = 0;

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    let mins = {};

    for (const round of game) {
      for (const marble of round) {
        const [n, color] = marble;
        if (!mins[color]) mins[color] = n;
        if (n > mins[color]) mins[color] = n;
      }
    }

    power += Object.values(mins).reduce((product, val) => product *= val, 1);
  }

  return power;
};

console.log('Part one:', p1(games));
console.log('Part two:', p2(games));
