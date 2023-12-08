import { readFile } from '../helpers/read.js';

const input = readFile('./src/7/input.txt');

const NUMBER_CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T'];
const FACE_CARDS = ['Q', 'K', 'A'];
const CARDS = [...NUMBER_CARDS, 'J', ...FACE_CARDS]
const CARDS_P2 = ['J', ...NUMBER_CARDS, ...FACE_CARDS];

const getScore = (hand, p2) => {
  const cards = hand.split('');
  const buckets = {};
  let jokers = 0;

  for (const card of cards) buckets[card] = (buckets[card] || 0) + 1;
  if (p2) {
    jokers = buckets['J'] || 0;
    delete buckets['J'];
  }
  const [max = 0, second = 0] = [...Object.values(buckets)].sort((a, b) => b - a);
  return (max + jokers) * 3 + second;
};

const convertToValues = (cards, p2) => cards.split('').map(c => p2 ? CARDS_P2.indexOf(c) : CARDS.indexOf(c));

const parse = (input, p2) => {
  return input.map(line => {
    const [hand, bid] = line.split(' ');
    return [getScore(hand, p2), convertToValues(hand, p2), Number(bid)];
  });
};

const compareHands = (left, right) => {
  const [scoreA, a] = left;
  const [score, b] = right;
  if (scoreA !== score) return scoreA - score;
  for (let i = 0; ; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
};

const p1 = parse(input).sort(compareHands)
  .map(([_, __, bid], i) => bid * (i + 1))
  .reduce((sum, num) => sum + num);

const p2 = parse(input, true).sort(compareHands)
  .map(([_, __, bid], i) => bid * (i + 1))
  .reduce((sum, num) => sum + num);

console.log('Part one:', p1);
console.log('Part two:', p2);