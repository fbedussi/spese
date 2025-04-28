export class YyyyMmDd {
    val: Date
    constructor(val: Date | string) {
        this.val = (new Date(val))
    }

    get() {
        return this.val.toISOString().split('T')[0]
    }

    getDate() {
        return this.val
    }

    gte(other?: YyyyMmDd | string) {
        if (!other) {
            return true
        }
        const normalizedOther = typeof other === 'string' ? new YyyyMmDd(other) : other
        return this.get() >= normalizedOther.get()
    }

    lte(other?: YyyyMmDd | string) {
        if (!other) {
            return true
        }
        const normalizedOther = typeof other === 'string' ? new YyyyMmDd(other) : other
        return this.get() <= normalizedOther.get()
    }
}

export type Expense = {
    name: string
    date: YyyyMmDd
    category: string
    subcategory: string
    // in months
    span: number
    value: number
}

export type SearchParams = {
    period: 'c',
    from: string,
    to: string,
    demo: string
}