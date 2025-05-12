import { useSearchParams } from '@solidjs/router';
import styles from './PeriodSelection.module.css';
import { type SearchParams, YyyyMmDd } from '~/types';
import { formatMoney, getFormData } from '~/helpers';
import { format } from 'date-fns';
import { createSignal } from 'solid-js';
import { Dialog } from './Dialog';
import { getFilteredDataTotal } from '~/data';

function Button(props: { label: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <button
      type="button"
      aria-current={searchParams.period === props.label}
      onClick={() => {
        setSearchParams({
          period: props.label,
          from: undefined,
          to: undefined,
        });
      }}
    >
      {props.label}
    </button>
  );
}

export default function PeriodSelection() {
  const [searchParams, setSearchParams] = useSearchParams<SearchParams>();
  const [dialogOpen, setDialogOpen] = createSignal(false);

  if (!searchParams.period) {
    setSearchParams({ period: '1m' });
  }

  return (
    <div class={styles.wrapper}>
      <div class={styles.buttons}>
        {['1s', '1m', '1a'].map((label) => (
          <Button label={label} />
        ))}
        <button type="button" onClick={() => setDialogOpen(true)}>
          da/a
        </button>
        <Dialog
          id="custom-dates"
          open={dialogOpen()}
          onBackdropClick={() => setDialogOpen(false)}
        >
          <article>
            <form
              id="set-dates-form"
              data-testid="set-dates-form"
              method="dialog"
              onSubmit={(ev) => {
                ev.preventDefault();
                const data = getFormData(ev.currentTarget);
                setSearchParams({
                  period: 'c',
                  from: data.from.toString(),
                  to: data.to.toString(),
                });
                setDialogOpen(false);
              }}
            >
              <label>
                da
                <input type="date" name="from" required />
              </label>
              <label>
                a
                <input
                  type="date"
                  name="to"
                  value={new YyyyMmDd(new Date()).get()}
                  required
                />
              </label>
            </form>
            <footer>
              <button
                type="reset"
                form="set-dates-form"
                class="outline secondary"
                onClick={() => setDialogOpen(false)}
              >
                cancel
              </button>
              <button type="submit" form="set-dates-form">
                salva
              </button>
            </footer>
          </article>
        </Dialog>
      </div>
      {/* <p data-testid="total-for-period">
        {getLabel(searchParams)}: {formatMoney(getFilteredDataTotal())}
      </p> */}
    </div>
  );
}
