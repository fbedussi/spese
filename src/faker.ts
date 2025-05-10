import { type Expense, YyyyMmDd } from './types';

const names = ['foo', 'baz', 'bar'];

export const categories: (keyof typeof subcategories)[] = [
  'other',
  'car',
  'motorbike',
  'food',
  'restaurant',
];

export const subcategories: Record<string, string[]> = {
  other: ['other'],
  car: ['insurance', 'buy', 'tax', 'wheels', 'toll'],
  motorbike: ['insurance', 'buy', 'tax', 'wheels', 'maintenance'],
  food: ['food'],
  restaurant: ['take away pizza', 'bologna js', 'xpug', 'family'],
};

const spans = [1, 12];

export function getRandomNumber(max: number) {
  return Math.round(Math.random() * max);
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[getRandomNumber(arr.length - 1)];
}

export function fakeExpense(): Expense {
  const category = pickRandom(categories);
  return {
    id: crypto.randomUUID(),
    name: pickRandom(names),
    date: new YyyyMmDd(
      `2025-${getRandomNumber(4) + 1}-${getRandomNumber(29) + 1}`,
    ),
    category,
    subcategory: pickRandom(subcategories[category]),
    span: pickRandom(spans),
    value: getRandomNumber(1000) + 1,
  };
}

export function fakeExpenses(n: number) {
  return new Array(n).fill(null).map(fakeExpense);
}
