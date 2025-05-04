import { format } from "date-fns";
import { delExpense, filteredData, updateExpense } from "~/data";
import { formatMoney, getFormData } from "~/helpers";
import { EditIcon } from "./EditIcon";
import { Dialog } from "./Dialog";
import { createSignal, Show } from "solid-js";
import { Expense, YyyyMmDd } from "~/types";
import { SelectCategory } from "./SelectCategory";
import { SelectSubCategory } from "./SelectSubCategory";

export function ExpensesList() {
    const [expenseToEdit, setExpenseToEdit] = createSignal<Expense | null>(null)
    const [selectedCategory, setSelectedCategory] = createSignal('')

    return (
        <div class="main__wrapper">
            <table data-testid="expense-list">
                <thead>
                    <tr>
                        <td>Data</td>
                        <td>Nome</td>
                        <td>Importo</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {filteredData()
                        .sort((a, b) => a.date.gte(b.date) ? -1 : 1)
                        .map((expense) => (<tr>
                            <td>{format(expense.date.getDate(), 'dd/MM')}</td>
                            <td>{expense.name}</td>
                            <td>{formatMoney(expense.value)}</td>
                            <td>
                                <button aria-label="modifica spesa" data-testid="edit-expense-btn" class="outline" onClick={() => setExpenseToEdit(expense)}>
                                    <EditIcon />
                                </button>
                            </td>
                        </tr>))}
                </tbody>
            </table>
            <Dialog open={!!expenseToEdit()} onBackdropClick={() => setExpenseToEdit(null)}>
                <Show when={expenseToEdit()}>
                    {(expenseToEdit) => (
                        <article data-testid="edit-expense-dialog">
                            <form id="edit-expense-form" onSubmit={(ev => {
                                ev.preventDefault();
                                const formData = getFormData(ev.currentTarget);
                                const expenseToUpdate = {
                                    id: expenseToEdit().id,
                                    name: typeof formData.name === 'string' ? formData.name : expenseToEdit().name,
                                    date: typeof formData.date === 'string' ? new YyyyMmDd(formData.date) : expenseToEdit().date,
                                    category: typeof formData.category === 'string' ? formData.category : expenseToEdit().category,
                                    subcategory: typeof formData.category === 'string' ? formData.category : expenseToEdit().category,
                                    span: typeof formData.span === 'string' ? Number(formData.span) : expenseToEdit().span,
                                    value: typeof formData.value === 'string' ? Number(formData.value) : expenseToEdit().value,
                                }
                                updateExpense(expenseToUpdate)
                                setExpenseToEdit(null)
                            })}>
                                <label>
                                    Data
                                    <input type="date" name="date" value={expenseToEdit().date.get()} />
                                </label>
                                <label>
                                    Nome
                                    <input type="text" name="name" required value={expenseToEdit().name} />
                                </label>
                                <div class="twoCols">
                                    <label>
                                        €
                                        <input type="number" name="value" required value={expenseToEdit().value} />
                                    </label>
                                    <label>
                                        Periodo (in mesi)
                                        <input type="number" name="span" value={expenseToEdit().span} />
                                    </label>
                                </div>
                                <div class="twoCols">
                                    <SelectCategory selectedCategory={expenseToEdit().category} onSelect={category => setSelectedCategory(category)} />
                                    <SelectSubCategory selectedCategory={expenseToEdit().category} selectedSubCategory={expenseToEdit().subcategory} />
                                </div>
                            </form>
                            <footer style="display: flex; justify-content: space-between">
                                <button class="outline" data-testid="del-expense-btn" onClick={() => {
                                    delExpense(expenseToEdit().id)
                                    setExpenseToEdit(null)
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                                        <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
                                    </svg>
                                </button>
                                <div style="display: flex; gap: 1rem">
                                    <button class="outline secondary" onClick={() => setExpenseToEdit(null)}>cancel</button>
                                    <button form="edit-expense-form" data-testid="save">salva</button>
                                </div>
                            </footer>
                        </article>
                    )}
                </Show>
            </Dialog>
        </div>
    )

}