import test, { describe } from 'node:test';
import assert from 'node:assert';
import { filterExpenses, getTotal } from './helpers.ts';
import { YyyyMmDd } from './types.ts';
import { subMonths, subWeeks } from 'date-fns';

describe('filterExpenses', () => {
  test('expenses with date before starting date are filtered out', (t) => {
    const foo = {
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
    };
    const baz = {
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
    };
    assert.deepEqual(
      filterExpenses([foo, baz], new YyyyMmDd(subMonths(new Date(), 1))),
      [baz],
    );
  });

  test('expenses with date before starting date, but that spans after the starting date are NOT filtered out', (t) => {
    const foo = {
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 2,
      value: 1,
    };
    const baz = {
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
    };
    assert.deepEqual(
      filterExpenses([foo, baz], new YyyyMmDd(subMonths(new Date(), 1))),
      [foo, baz],
    );
  });

  test('expenses with date after end date are filtered out', (t) => {
    const foo = {
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
    };
    const baz = {
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
    };
    assert.deepEqual(
      filterExpenses(
        [foo, baz],
        new YyyyMmDd(subMonths(new Date(), 3)),
        new YyyyMmDd(subMonths(new Date(), 1)),
      ),
      [foo],
    );
  });
});

describe('getTotal', () => {
  test('values are summed up', (t) => {
    const foo = {
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
    };
    const baz = {
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
    };
    assert.deepEqual(getTotal([foo, baz]), 3);
  });

  test('values are divided by span', (t) => {
    const foo = {
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
    };
    const baz = {
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 2,
      value: 2,
    };
    assert.deepEqual(getTotal([foo, baz]), 2);
  });
});
