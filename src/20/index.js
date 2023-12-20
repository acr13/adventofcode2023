import { readFile } from '../helpers/read.js';

const input = readFile('./src/20/input.txt');

const gcd = (a, b) => {
  var t = 0;
  a < b && ((t = b), (b = a), (a = t));
  t = a % b;
  return t ? gcd(b, t) : b;
};
const lcm = (a, b) => (a / gcd(a, b)) * b;

const parse = (input) => {
  const mods = {};
  const inputs = {};

  input.forEach(line => {
    const { groups: { t, k, m } } = line.match(/(?<t>[%&]?)(?<k>.+) -> (?<m>.+)/);
    mods[k] = { t, to: m.split(", "), s: 0 };
    m.split(", ").forEach((m) => {
      inputs[m] ??= {};
      inputs[m][k] = 0;
    });
  })

  return [mods, inputs];
};

const process = (mods, inputs) => {
  const sum = [0, 0];
  const res = [];
  const queue = [];
  const parents = Object.keys(inputs.rx).flatMap((k) => Object.keys(inputs[k]));

  for (let i = 1; i < Infinity; i++) {
    sum[0]++;
    queue.push(["button", "broadcaster", 0]);
    while (queue.length) {
      const [from, mod, pulse] = queue.shift();
      if (!mods[mod]) continue;
      const { t, to, s } = mods[mod];
      if (mod === "broadcaster") {
        for (const m of to) queue.push([mod, m, pulse]), sum[pulse]++;
        continue;
      }
      if (t === "%" && pulse === 0) {
        mods[mod].s = s ? 0 : 1;
        const nPulse = s ? 0 : 1;
        for (const m of mods[mod].to)
          queue.push([mod, m, nPulse]), sum[nPulse]++;
        continue;
      }
      if (t === "&") {
        inputs[mod][from] = pulse;
        const nPulse = Object.values(inputs[mod]).every(Boolean) ? 0 : 1;
        if (nPulse === 1 && parents.includes(mod))
          parents[parents.indexOf(mod)] = i;
        for (const m of to) queue.push([mod, m, nPulse]), sum[nPulse]++;
        continue;
      }
    }
    if (i === 1000) res[0] = sum[0] * sum[1];
    if (parents.every((e) => typeof e === "number")) break;
  }
  res[1] = parents.reduce((acc, cur) => lcm(acc, cur), 1);
  return res;
};

const [mods, inputs] = parse(input);
const [p1, p2] = process(mods, inputs);
console.log('Part one:', p1);
console.log('Part two:', p2);
