import { useSearchParams } from '@solidjs/router';
import { format } from 'date-fns';
import { Show, createSignal } from 'solid-js';
import { delExpense, filteredData, updateExpense } from '~/data';
import { formatMoney, getFormData } from '~/helpers';
import { type Expense, type SearchParams, YyyyMmDd } from '~/types';
import { DeleteIcon } from './DeleteIcon';
import { Dialog } from './Dialog';
import { EditIcon } from './EditIcon';
import { SelectCategory } from './SelectCategory';
import { SelectSubCategory } from './SelectSubCategory';

export function ExpensesList() {
  const [expenseToEdit, setExpenseToEdit] = createSignal<Expense | null>(null);
  const [_, setSelectedCategory] = createSignal('');

  const [searchParams] = useSearchParams<SearchParams>();
  const disabledCategories = () =>
    searchParams.disabledCategories?.split(',') || [];

  return (
    <div class="main__wrapper">
      <table data-testid="expense-list">
        <thead>
          <tr>
            <td>Data</td>
            <td>Nome</td>
            <td>Importo</td>
            <td />
          </tr>
        </thead>
        <tbody>
          {filteredData()
            .sort((a, b) => (a.date.gte(b.date) ? -1 : 1))
            .filter(({ category }) => !disabledCategories().includes(category))
            .map((expense) => (
              <tr>
                <td>{format(expense.date.getDate(), 'dd/MM')}</td>
                <td>{expense.name}</td>
                <td>{formatMoney(expense.value)}</td>
                <td>
                  <button
                    type="button"
                    aria-label="modifica spesa"
                    data-testid="edit-expense-btn"
                    class="outline"
                    onClick={() => setExpenseToEdit(expense)}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Dialog
        open={!!expenseToEdit()}
        onBackdropClick={() => setExpenseToEdit(null)}
      >
        <Show when={expenseToEdit()}>
          {(expenseToEdit) => (
            <article data-testid="edit-expense-dialog">
              <form
                id="edit-expense-form"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  const formData = getFormData(ev.currentTarget);
                  const expenseToUpdate = {
                    ...expenseToEdit(),
                    name:
                      typeof formData.name === 'string'
                        ? formData.name
                        : expenseToEdit().name,
                    date:
                      typeof formData.date === 'string'
                        ? new YyyyMmDd(formData.date)
                        : expenseToEdit().date,
                    category:
                      typeof formData.category === 'string'
                        ? formData.category
                        : expenseToEdit().category,
                    subcategory:
                      typeof formData.category === 'string'
                        ? formData.category
                        : expenseToEdit().category,
                    span:
                      typeof formData.span === 'string'
                        ? Number(formData.span)
                        : expenseToEdit().span,
                    value:
                      typeof formData.value === 'string'
                        ? Number(formData.value)
                        : expenseToEdit().value,
                  };
                  updateExpense(expenseToUpdate);
                  setExpenseToEdit(null);
                }}
              >
                <label>
                  Data
                  <input
                    type="date"
                    name="date"
                    value={expenseToEdit().date.get()}
                  />
                </label>
                <label>
                  Nome
                  <input
                    type="text"
                    name="name"
                    required
                    value={expenseToEdit().name}
                  />
                </label>
                <div class="twoCols">
                  <label>
                    €
                    <input
                      type="number"
                      name="value"
                      required
                      value={expenseToEdit().value}
                    />
                  </label>
                  <label>
                    Periodo (in mesi)
                    <input
                      type="number"
                      name="span"
                      value={expenseToEdit().span}
                    />
                  </label>
                </div>
                <div class="twoCols">
                  <SelectCategory
                    selectedCategory={expenseToEdit().category}
                    onSelect={(category) => setSelectedCategory(category)}
                  />
                  <SelectSubCategory
                    selectedCategory={expenseToEdit().category}
                    selectedSubCategory={expenseToEdit().subcategory}
                  />
                </div>
                <div class="twoCols">
                  <a href="/categories">Gestisci categorie</a>
                </div>
              </form>
              <footer style="display: flex; justify-content: space-between">
                <button
                  type="button"
                  class="outline"
                  data-testid="del-expense-btn"
                  onClick={() => {
                    delExpense(expenseToEdit().id);
                    setExpenseToEdit(null);
                  }}
                >
                  <DeleteIcon />
                </button>
                <div style="display: flex; gap: 1rem">
                  <button
                    type="button"
                    class="outline secondary"
                    onClick={() => setExpenseToEdit(null)}
                  >
                    cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-expense-form"
                    data-testid="save"
                  >
                    salva
                  </button>
                </div>
              </footer>
            </article>
          )}
        </Show>
      </Dialog>
    </div>
  );
}
