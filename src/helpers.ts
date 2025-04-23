export function getFormData(form: HTMLFormElement) {
    const formData = new FormData(form)
    return Object.fromEntries(formData)
}

const eurFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function formatMoney(value: number) {
    return eurFormatter.format(value)
}