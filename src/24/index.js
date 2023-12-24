import { readFile } from '../helpers/read.js';

const input = readFile('./src/24/input.txt');

const stones = input.map(line => {
  const [left, right] = line.split(' @ ');
  const [px, py, pz] = left.split(', ').map(Number);
  const [vx, vy, vz] = right.split(', ').map(Number);

  return [px,py,pz,vx,vy,vz];
});

let p1 = 0;

for (let i = 0; i < stones.length; i++) {
  for (let j = i + 1; j < stones.length; j++) {
    const x1 = stones[i][0]
    const x2 = stones[i][0]+stones[i][3]
    const x3 = stones[j][0]
    const x4 = stones[j][0]+stones[j][3]
    const y1 = stones[i][1]
    const y2 = stones[i][1]+stones[i][4]
    const y3 = stones[j][1]
    const y4 = stones[j][1]+stones[j][4]

    const den = ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4));
    if (den !== 0) {
      const px = ((x1*y2 - y1*x2)*(x3-x4) - (x1-x2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
      const py = ((x1*y2 - y1*x2)*(y3-y4) - (y1-y2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
      const validA = (px>x1)==(x2>x1)
      const validB = (px>x3)==(x4>x3)

      if (200000000000000 <= px <= 400000000000000 && 200000000000000 <= py <= 400000000000000 && validA && validB) {
        p1++;
      }
    }
  }
}
console.log('Part one:', p1);

// wtf
import { init } from 'z3-solver/build/node.js';
const { Context } = await init();
const { Solver, Real } = Context('main');
const solver = new Solver();

let vars = {};
for (const v of ['x', 'y', 'z', 'vx', 'vy', 'vz']) vars[v] = Real.const(v);

for (let i = 0; i < 3; i++) {
  const tk = Real.const('tk' + i);
 
  solver.add(tk.mul(stones[i][3]).add(stones[i][0]).eq(tk.mul(vars.vx).add(vars.x)));
  solver.add(tk.mul(stones[i][4]).add(stones[i][1]).eq(tk.mul(vars.vy).add(vars.y)));
  solver.add(tk.mul(stones[i][5]).add(stones[i][2]).eq(tk.mul(vars.vz).add(vars.z)));
}

const solved = await solver.check(); // Actually solves the thing
if (solved === 'unsat') throw new Error('Unable to solve equation');
const model = solver.model();

function parseRatNum(expr) {
  const value = (expr).value();
  const num = Number(value.numerator.toString().replace('n', ''));
  const denom = Number(value.denominator.toString().replace('n', ''));
  return num / denom;
}

const p2 = parseRatNum(model.eval(vars.x.add(vars.y).add(vars.z)));
console.log('Part two:', p2);
process.exit(0);