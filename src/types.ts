export class YyyyMmDd {
  val: string;
  constructor(val: Date | string) {
    this.val = new Date(val).toISOString().split('T')[0];
  }

  get() {
    return this.val;
  }

  getDate() {
    return new Date(this.val);
  }

  gte(other?: YyyyMmDd | string) {
    if (!other) {
      return true;
    }
    const normalizedOther =
      typeof other === 'string' ? new YyyyMmDd(other) : other;
    return this.get() >= normalizedOther.get();
  }

  lte(other?: YyyyMmDd | string) {
    if (!other) {
      return true;
    }
    const normalizedOther =
      typeof other === 'string' ? new YyyyMmDd(other) : other;
    return this.get() <= normalizedOther.get();
  }
}

export type Expense = {
  id: string;
  name: string;
  date: YyyyMmDd;
  category: string;
  subcategory: string;
  // in months
  span: number;
  value: number;
  createdAt: number;
  updatedAt: number;
};

export type SearchParams = {
  period: 'c';
  from: string;
  to: string;
  demo: string;
  disabledCategories: string;
};
