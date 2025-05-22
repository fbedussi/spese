import assert from 'node:assert';
import test, { describe } from 'node:test';
import { subMonths } from 'date-fns';
import { filterExpenses, getTotal } from './helpers.ts';
import { YyyyMmDd } from './types.ts';

describe('filterExpenses', () => {
  test('expenses with date before starting date are filtered out', (t) => {
    const foo = {
      id: '1',
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const baz = {
      id: '2',
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
      createdAt: 1,
      updatedAt: 1,
    };
    assert.deepEqual(
      filterExpenses([foo, baz], new YyyyMmDd(subMonths(new Date(), 1))),
      [baz],
    );
  });

  test('expenses with date before starting date, but that spans after the starting date are NOT filtered out', (t) => {
    const foo = {
      id: '1',
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 2,
      value: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const baz = {
      id: '2',
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
      createdAt: 1,
      updatedAt: 1,
    };
    assert.deepEqual(
      filterExpenses([foo, baz], new YyyyMmDd(subMonths(new Date(), 1))),
      [foo, baz],
    );
  });

  test('expenses with date after end date are filtered out', (t) => {
    const foo = {
      id: '1',
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const baz = {
      id: '2',
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
      createdAt: 1,
      updatedAt: 1,
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
      id: '1',
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const baz = {
      id: '2',
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 2,
      createdAt: 1,
      updatedAt: 1,
    };
    assert.deepEqual(getTotal([foo, baz]), 3);
  });

  test('values are divided by span', (t) => {
    const foo = {
      id: '1',
      name: 'foo',
      date: new YyyyMmDd(subMonths(new Date(), 2)),
      category: 'one',
      subcategory: 'subone',
      span: 1,
      value: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const baz = {
      id: '2',
      name: 'baz',
      date: new YyyyMmDd(new Date()),
      category: 'one',
      subcategory: 'subone',
      span: 2,
      value: 2,
      createdAt: 1,
      updatedAt: 1,
    };
    assert.deepEqual(getTotal([foo, baz]), 2);
  });
});
