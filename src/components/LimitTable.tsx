import { filteredDataByCategory, limits, setLimits } from '~/data';
import { formatMoney, getFormData } from '~/helpers';
import styles from './limitTable.module.css';
import { Dialog } from './Dialog';
import { createSignal } from 'solid-js';
import { EditIcon } from './EditIcon';

export function LimitTable() {
  const [limitToEdit, setLimitToEdit] = createSignal('');

  return (
    <div class="main__wrapper">
      <table>
        <thead>
          <tr>
            <td>Categoria</td>
            <td>Limite (del periodo)</td>
            <td>Importo (del periodo)</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(filteredDataByCategory()).map(([key, expenses]) => (
            <tr>
              <td>{key}</td>
              <td
                class={styles.limitCell}
                onClick={() => {
                  setLimitToEdit(key);
                }}
              >
                {formatMoney(limits()[key])}
                <EditIcon />
              </td>
              <td>
                {formatMoney(
                  expenses.reduce((tot, expense) => tot + expense.value, 0),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={!!limitToEdit()} onBackdropClick={() => setLimitToEdit('')}>
        <article>
          <form
            id="set-limit-form"
            onSubmit={(ev) => {
              ev.preventDefault();
              const { limit } = getFormData(ev.currentTarget);
              setLimits((prev) => ({
                ...prev,
                [limitToEdit()]: Number(limit),
              }));
              setLimitToEdit('');
            }}
          >
            <label for="set-limit">limite mensile per {limitToEdit()}</label>
            <fieldset role="group">
              <input
                type="number"
                name="limit"
                id="set-limit"
                value={limits()[limitToEdit()]}
              />
              <button type="submit" form="set-limit-form">salva</button>
            </fieldset>
          </form>
        </article>
      </Dialog>
    </div>
  );
}
