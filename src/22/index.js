import { readFile } from '../helpers/read.js';

const input = readFile('./src/22/input.txt');

const bricks = [];
for (let i = 0; i < input.length; i++) {
  const [left, right] = input[i].split('~');
  const [sx, sy, sz] = left.split(',').map(Number);
  const [ex, ey, ez] = right.split(',').map(Number);
  const brick = [];

  if (sx === ex && sy === ey) {
    for (let z = sz; z < ez + 1; z++) {
      brick.push([sx,sy,z]);
    }
  } else if (sx === ex && sz === ez) {
    for (let y = sy; y < ey + 1; y++) {
      brick.push([sx,y,sz]);
    }
  } else if (sy === ey && sz === ez) {
    for (let x = sx; x < ex + 1; x++) {
      brick.push([x,sy,sz]);
    }
  }

  bricks.push(brick);
}

let SEEN = new Set();
for (const brick of bricks) {
  for (const [x,y,z] of brick) {
    SEEN.add(`${x},${y},${z}`);
  }
}


while (true) {
  let any = false;

  for (let i = 0; i < bricks.length; i++) {
    let ok = true;
    for (const [x,y,z] of bricks[i]) {
      if (z === 1) {
        ok = false;
      }
      if (SEEN.has(`${x},${y},${z-1}`) && !bricks[i].includes([x,y,z-1])) {
        ok = false;
      }
    }

    if (ok) {
      any = true;
      for (const [x,y,z] of bricks[i]) {
        SEEN.delete(`${x},${y},${z}`);
        SEEN.add(`${x},${y},${z-1}`);
      }

      bricks[i] = bricks[i].map(([x,y,z]) => [x,y,z-1])
    }
  }

  if (!any) {
    break;
  }
}

const OLD_SEEN = new Set([...SEEN]);
const OLD_BRICKS = [];
bricks.forEach(brick => OLD_BRICKS.push([...brick]));

let p1 = 0;
let p2 = 0;

for (let i = 0; i < bricks.length; i++) {
  const B = bricks[i];
  const BS = [];
  SEEN = new Set([...OLD_SEEN]);
  OLD_BRICKS.forEach(brick => BS.push([...brick]));

  for (const [x,y,z] of B) {
    SEEN.delete(`${x},${y},${z}`);
  }

  const FALL = new Set();
  while (true) {
    let any = false;

    for (let j = 0; j < BS.length; j++) {
      const C = BS[j];
      if (j === i) continue;
      let ok = true;

      for (const [x,y,z] of C) {
        if (z === 1) {
          ok = false;
        }
        if (SEEN.has(`${x},${y},${z-1}`) && !C.includes([x,y,z-1])) {
          ok = false;
        }
      }

      if (ok) {
        FALL.add(j);
        for (const [x,y,z] of C) {
          SEEN.delete(`${x},${y},${z}`);
          SEEN.add(`${x},${y},${z-1}`);
        }

        BS[j] = C.map(([x,y,z]) => [x,y,z-1]);
        any = true;
      }
    }

    if (!any) {
      break;
    }
  }

  if (FALL.size === 0) {
    p1 += 1;
  }
  p2 += FALL.size;
}

console.log('Part one:', p1);
console.log('Part two:', p2);
