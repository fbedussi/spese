import { useSearchParams } from '@solidjs/router';
import {
  ArcElement,
  CategoryScale,
  Chart,
  Colors,
  DoughnutController,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PieController,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { createEffect } from 'solid-js';
import { getFilteredDataTotal } from '~/data';
import { formatMoney } from '~/helpers';
import { Expense, type SearchParams } from '~/types';
import { filteredData, filteredDataByCategory } from '../data';
import styles from './graph.module.css';

Chart.register([
  CategoryScale,
  DoughnutController,
  PieController,
  LineElement,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip,
  Filler,
  Colors,
]);

function getLabel(searchParams: Partial<SearchParams>) {
  if (searchParams.period === 'c' && searchParams.from && searchParams.to) {
    const dateFormat = 'dd/MM/yy';
    return `da ${format(searchParams.from, dateFormat)} a ${format(searchParams.to, dateFormat)}`;
  }

  if (searchParams.period && searchParams.period !== 'c') {
    const periodLabel = {
      '1s': 'ultima settimana',
      '1m': 'ultimo mese',
      '1a': 'ultimo anno',
    } as const;

    return periodLabel[searchParams.period];
  }

  return '';
}

export default function Graph() {
  const [searchParams] = useSearchParams<SearchParams>();

  let canvas: HTMLCanvasElement | undefined;
  let chart: Chart | undefined;

  createEffect(() => {
    if (!canvas) {
      return;
    }
    const labels = Object.keys(filteredDataByCategory());
    const data = Object.values(filteredDataByCategory()).map((expenses) =>
      expenses.reduce((tot, expense) => tot + expense.value, 0),
    );
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `€ ${context.parsed} • ${Math.round((context.parsed / context.dataset.data.reduce((tot, n) => tot + n)) * 100)}%`,
            },
          },
        },
      },
    });
  });
  return (
    <div classList={{ main__wrapper: true, [styles.wrapper]: true }}>
      <div data-testid="total-for-period" class={styles.totalWrapper}>
        <div class={styles.total}>{formatMoney(getFilteredDataTotal())}</div>
        <div>{getLabel(searchParams)}</div>
      </div>
      <canvas class={styles.canvas} ref={canvas} />
    </div>
  );
}
