import { Expense, YyyyMmDd } from '~/types'
import styles from './addExpense.module.css'
import { addExpense } from '~/data'

function getFormData(form: HTMLFormElement) {
    const formData = new FormData(form)
    return Object.fromEntries(formData)
}

export function AddExpense() {
    let popover: HTMLDivElement | undefined
    return (
        <>
            <button popovertarget="add-form" class={styles.cta}>+</button>
            <div popover id="add-form" ref={popover}>
                <article>
                    <form onSubmit={(ev => {
                        ev.preventDefault();
                        const newExpense = getFormData(ev.currentTarget);
                        addExpense(newExpense)
                        popover?.hidePopover()
                    })}>
                        <label>
                            Data
                            <input type="date" value={new YyyyMmDd(new Date()).get()} name="date" />
                        </label>
                        <label>
                            Nome
                            <input type="text" name="name" required />
                        </label>
                        <div class={styles.twoCols}>
                            <label>
                                €
                                <input type="number" name="value" required />
                            </label>
                            <label>
                                Periodo (in mesi)
                                <input type="number" value={1} name="span" />
                            </label>
                        </div>
                        <div class={styles.twoCols}>
                            <label>
                                Categoria
                                <select name="category" required>
                                    <option>casa</option>
                                    <option>auto</option>
                                </select>
                            </label>
                            <label>
                                Sottocategoria
                                <select name="subcategory">
                                    <option>Benzina</option>
                                    <option>autostrada</option>
                                </select>
                            </label>

                        </div>
                        <div class="modal-buttons">
                            <button type="button" class="outline secondary" popovertarget="add-form" popover-action="close">cancel</button>
                            <button>salva</button>
                        </div>
                    </form>
                </article>
            </div>
        </>
    )
}