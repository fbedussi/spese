import { YyyyMmDd } from '~/types'
import styles from './addExpense.module.css'
import { addExpense } from '~/data'
import { getFormData } from '~/helpers'
import { createSignal } from 'solid-js'
import { Dialog } from './Dialog'

export function AddExpense() {
    const [dialogOpen, setDialogOpen] = createSignal(false)

    return (
        <>
            <button onClick={() => setDialogOpen(true)} class={styles.cta} aria-label="aggiungi spesa" data-testid="add-expense">+</button>
            <Dialog open={dialogOpen()} id="add-expense-dialog" onBackdropClick={() => setDialogOpen(false)} >
                <article data-testid="add-expense-dialog">
                    <form id="add-expense-form" onSubmit={(ev => {
                        ev.preventDefault();
                        const newExpense = getFormData(ev.currentTarget);
                        addExpense(newExpense)
                        setDialogOpen(false)
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
                    </form>
                    <footer>
                        <button class="outline secondary" onClick={() => setDialogOpen(false)}>cancel</button>
                        <button form="add-expense-form" data-testid="save">salva</button>
                    </footer>
                </article>
            </Dialog>
        </>
    )
}
