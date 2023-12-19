import { readFile } from '../helpers/read.js';

const input = readFile('./src/19/input.txt');
const rules = {};
const parts = [];

let parseRules = true;

for (let i = 0; i < input.length; i++) {
  if (input[i] === '') {
    parseRules = false;
    continue;
  }

  if (parseRules) {
    const [name, ruleString] = input[i].replaceAll('{', ' ').replaceAll('}', '').split(' ');
    const ruleList = [];
    const rs = ruleString.split(',');

    rs.forEach(r => {
      const [left, right] = r.split(':');
      let check = null;
      let op = null;
      let value = null;
      let go = right;

      if (left.includes('>')) {
        op = 'gt';
        const [l, r] = left.split('>');
        check = l;
        value = Number(r);
      } else if (left.includes('<')) {
        op = 'lt';
        const [l, r] = left.split('<');
        check = l;
        value = Number(r);
      }

      if (!right) {
        go = left;
      }
      
      ruleList.push({ check, op, value, go })
    });
    
    rules[name] = ruleList;
  } else {
    const xmas = input[i]
      .replaceAll('{', '').replaceAll('}', '')
      .split(',').reduce((acc, val) => {
        const [c, v] = val.split('=');
        acc[c] = Number(v);
        return acc;
      }, {});
    parts.push(xmas);
  }
}

const isAccepted = (rules, part) => {
  let r = 'in';

  while (true) {
    const rs = rules[r];

    for (let i = 0; i < rs.length; i++) {
      const rule = rs[i];

      if (!rule.check && !rule.op && !rule.value) {
        if (rule.go === 'A') {
          return true;
        } else if (rule.go === 'R') {
          return false;
        }

        r = rule.go;
        break;
      }

      if (rule.op === 'lt') {
        if (part[rule.check] < rule.value) {
          if (rule.go === 'A') {
            return true;
          } else if (rule.go === 'R') {
            return false;
          }

          r = rule.go;
          break;
        }
      } else if (rule.op === 'gt') {
        if (part[rule.check] > rule.value) {
          if (rule.go === 'A') {
            return true;
          } else if (rule.go === 'R') {
            return false;
          }

          r = rule.go;
          break;
        }
      } else {
        console.log('UNKNOWN OP', rule);
        throw new Error('??');
      }
    }
  }

  return false;
};

const score = parts.filter(part => isAccepted(rules, part))
  .reduce((sum, part) => sum + part.x + part.m + part.a + part.s, 0);
console.log('Part one:', score);


const newRange = (op, val, lo, hi) => {
  if (op === 'lt') {
    hi = Math.min(hi, val - 1);
  } else if (op === 'gt') {
    lo = Math.max(lo, val + 1);
  } else if (op === '>=') {
    lo = Math.max(lo, val);
  } else if (op === '<=') {
    hi = Math.min(hi, val);
  }

  return [lo, hi];
};

const newRanges = (check, op, val, xl, xh, ml, mh, al, ah, sl, sh) => {
  if (check === 'x') {
    const nr = newRange(op, val, xl, xh);
    xl = nr[0];
    xh = nr[1];
  } else if (check === 'm') {
    const nr = newRange(op, val, ml, mh);
    ml = nr[0];
    mh = nr[1];
  } else if (check === 'a') {
    const nr = newRange(op, val, al, ah);
    al = nr[0];
    ah = nr[1];
  } else if (check ==='s') {
    const nr = newRange(op, val, sl, sh);
    sl = nr[0];
    sh = nr[1];
  }

  return [xl, xh, ml, mh, al, ah, sl, sh];
};


const p2 = (rules) => {
  let score = 0;
  const Q = [ ['in', 1, 4000, 1, 4000, 1, 4000, 1, 4000] ];

  while (Q.length) {
    let [r, xl, xh, ml, mh, al, ah, sl, sh] = Q.pop();

    if (xl > xh || ml > mh || al > ah || sl > sh) continue;
    if (r === 'R') continue;
    if (r === 'A') {
      score += (xh - xl + 1) * (mh - ml + 1) * (ah - al + 1) * (sh - sl + 1);
      continue;
    } else {
      const rs = rules[r];
      let nextR = null;

      for (let i = 0; i < rs.length; i++) {
        const rule = rs[i];
        nextR = rule.go;

        // base case, go to next rule
        if (!rule.check && !rule.op && !rule.value) {
          Q.push( [nextR, xl, xh, ml, mh, al, ah, sl, sh] );
          break;
        }

        // append the parts that pass this rule, AND the parts that don't (go to the next rule)
        const n = newRanges(rule.check, rule.op, rule.value, xl, xh, ml, mh, al, ah, sl, sh);
        Q.push([nextR, ...n]);

        const [xxl, xxh, mml, mmh, aal, aah, ssl, ssh] = newRanges(rule.check, rule.op === '>' ? '<=' : '>=', rule.value, xl, xh, ml, mh, al, ah, sl, sh);
        xl = xxl;
        xh = xxh;
        ml = mml;
        mh = mmh;
        al = aal;
        ah = aah;
        sl = ssl;
        sh = ssh;
      }
    }
  }

  return score;
};

console.log('Part two:', p2(rules));