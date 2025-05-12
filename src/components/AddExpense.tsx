import { createSignal } from 'solid-js';
import { addExpense } from '~/data';
import { getFormData } from '~/helpers';
import { YyyyMmDd } from '~/types';
import { Dialog } from './Dialog';
import { PlusIcon } from './PlusIcon';
import { SelectCategory } from './SelectCategory';
import { SelectSubCategory } from './SelectSubCategory';
import styles from './addExpense.module.css';

export function AddExpense() {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [selectedCategory, setSelectedCategory] = createSignal('');

  let form: HTMLFormElement | undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        class={styles.cta}
        aria-label="aggiungi spesa"
        data-testid="add-expense"
      >
        <PlusIcon />
      </button>
      <Dialog
        open={dialogOpen()}
        id="add-expense-dialog"
        onBackdropClick={() => setDialogOpen(false)}
      >
        <article data-testid="add-expense-dialog">
          <form
            ref={form}
            id="add-expense-form"
            data-testid="add-expense-form"
            onSubmit={(ev) => {
              ev.preventDefault();
              const newExpense = getFormData(ev.currentTarget);
              addExpense(newExpense);
              setDialogOpen(false);
              form?.reset();
              // biome-ignore lint: to fix
              (form!.elements['date' as any] as HTMLInputElement).value =
                new YyyyMmDd(new Date()).get();
            }}
          >
            <label>
              Data
              <input
                type="date"
                value={new YyyyMmDd(new Date()).get()}
                name="date"
                data-testid="date-input"
              />
            </label>
            <label>
              Nome
              <input type="text" name="name" required />
            </label>
            <div class="twoCols">
              <label>
                €
                <input type="number" name="value" required />
              </label>
              <label>
                Periodo (in mesi)
                <input type="number" value={1} name="span" />
              </label>
            </div>
            <div class="twoCols">
              <SelectCategory onSelect={setSelectedCategory} />
              <SelectSubCategory selectedCategory={selectedCategory()} />
            </div>
            <div class="twoCols">
              <a href="/categories">Gestisci categorie</a>
            </div>
          </form>
          <footer>
            <button
              type="button"
              class="outline secondary"
              onClick={() => setDialogOpen(false)}
            >
              cancel
            </button>
            <button type="submit" form="add-expense-form" data-testid="save">
              salva
            </button>
          </footer>
        </article>
      </Dialog>
    </>
  );
}
