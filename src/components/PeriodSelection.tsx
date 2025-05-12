import { useSearchParams } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { getFormData } from '~/helpers';
import { type SearchParams, YyyyMmDd } from '~/types';
import { Dialog } from './Dialog';
import styles from './PeriodSelection.module.css';

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
        {['settimana', 'mese', 'anno'].map((label) => (
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
    </div>
  );
}
