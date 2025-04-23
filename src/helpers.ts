export function getFormData(form: HTMLFormElement) {
    const formData = new FormData(form)
    return Object.fromEntries(formData)
}