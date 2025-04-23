import { useSearchParams } from "@solidjs/router";
import styles from './PeriodSelection.module.css'

function Button(props: { label: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <button aria-current={searchParams.period === props.label} onClick={() => {
      setSearchParams({ 'period': props.label })
    }}>{props.label}</button>
  )
}


export default function PeriodSelection() {
  const [searchParams, setSearchParams] = useSearchParams<{ period: '1s' | '1m' | '1a' }>();

  if (!searchParams.period) {
    setSearchParams({ period: '1m' })
  }

  const periodLabel = {
    '1s': 'ultima settimana',
    '1m': 'ultimo mese',
    '1a': 'ultimo anno',
  } as const

  return (
    <div class={styles.wrapper}>
      <div class={styles.buttons}>
        {['1s', '1m', '1a'].map(label => <Button label={label} />)}
        <button popovertarget="custom-dates">da/a</button>
        <div popover id="custom-dates">
          <article>
            <form>
              <label>
                da
                <input type="date" />
              </label>
              <label>
                a
                <input type="date" />
              </label>
              <div class="modal-buttons">
                <button type="button" class="outline secondary" popovertarget="custom-dates" popover-action="close">cancel</button>
                <button>salva</button>
              </div>
            </form>
          </article>
        </div>
      </div>
      <p>{searchParams.period && periodLabel[searchParams.period]}</p>
    </div>
  );
}
