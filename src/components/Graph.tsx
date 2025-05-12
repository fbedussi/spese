import { useSearchParams } from '@solidjs/router';
import {
  ArcElement,
  CategoryScale,
  Chart,
  type ChartType,
  Colors,
  DoughnutController,
  Filler,
  Legend,
  type LegendItem,
  LineElement,
  LinearScale,
  PieController,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { createEffect, createSignal } from 'solid-js';
import { getFilteredDataTotal } from '~/data';
import { formatMoney } from '~/helpers';
import type { SearchParams } from '~/types';
import { filteredDataByCategory } from '../data';
import styles from './graph.module.css';

// Extend Chart.js types to include the custom htmlLegend plugin
declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    htmlLegend?: {
      containerID: string;
    };
  }
}

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
      settimana: 'ultima settimana',
      mese: 'ultimo mese',
      anno: 'ultimo anno',
    } as const;

    return periodLabel[searchParams.period];
  }

  return '';
}

export default function Graph() {
  const [searchParams, setSearchParams] = useSearchParams<SearchParams>();
  const [legendItems, setLegendItems] = createSignal<LegendItem[]>([]);

  const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart: Chart) {
      // Reuse the built-in legendItems generator
      setLegendItems(
        chart.options.plugins?.legend?.labels?.generateLabels
          ? chart.options.plugins.legend.labels.generateLabels(chart)
          : [],
      );
    },
  };

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
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `€ ${context.parsed} • ${Math.round(
                  (context.parsed /
                    context.dataset.data
                      .filter((x) => typeof x === 'number')
                      .reduce((tot, n) => tot + n)) *
                    100,
                )}%`,
            },
          },
        },
      },
      plugins: [htmlLegendPlugin],
    });
  });

  const disabledCategories = () =>
    searchParams.disabledCategories?.split(',') || [];

  createEffect(() => {
    chart?.legend?.legendItems?.forEach((legendItem, index) => {
      if (disabledCategories().includes(legendItem.text)) {
        chart?.hide(0, index);
      } else {
        chart?.show(0, index);
      }
    });
    chart?.update();
  });

  return (
    <div classList={{ main__wrapper: true, [styles.wrapper]: true }}>
      <div>
        <ul class={styles.legend}>
          {legendItems().map((item) => (
            <li
              class={styles.legendItem}
              onclick={() => {
                if (typeof item.index !== 'number') {
                  return;
                }
                const disabledCategories =
                  searchParams.disabledCategories?.split(',') || [];
                const isToDisable = disabledCategories.includes(
                  item.text?.toString(),
                );
                if (isToDisable) {
                  setSearchParams({
                    disabledCategories: disabledCategories
                      .filter((x) => x !== item.text?.toString())
                      .join(','),
                  });
                } else {
                  setSearchParams({
                    disabledCategories: disabledCategories
                      .concat(item.text?.toString())
                      .join(','),
                  });
                }
              }}
            >
              <span
                class={styles.boxSpan}
                style={{
                  background: item.fillStyle as string,
                  'border-color': item.strokeStyle as string,
                  'border-width': `${item.lineWidth}px`,
                }}
              />
              <p
                classList={{
                  [styles.legendText]: true,
                  [styles.legendTextHidden]: disabledCategories().includes(
                    item.text,
                  ),
                }}
              >
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div class={styles.graphAndTotal}>
        <div data-testid="total-for-period" class={styles.totalWrapper}>
          <div class={styles.total}>{formatMoney(getFilteredDataTotal())}</div>
          <div>{getLabel(searchParams)}</div>
        </div>
        <canvas class={styles.canvas} ref={canvas} />
      </div>
    </div>
  );
}
