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

type Categories = {
    car: 'insurance' | 'buy' | 'tax' | 'wheels' | 'maintenance' | 'toll'
    motorbike: 'insurance' | 'buy' | 'tax' | 'wheels' | 'maintenance'
    food: 'food',
    restaurant: 'take away pizza' | 'bologna js' | 'xpug' | 'family'
}

export type Category = keyof Categories

export type Subcategory<C extends Category> = Categories[C]


export type Expense<C extends Category = Category> = {
    name: string
    date: YyyyMmDd
    category: C
    subcategory: Subcategory<C>
    // in months
    span: number
    value: number
}

export type SearchParams = { period: 'c', from: string, to: string }