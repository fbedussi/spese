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
  LineElement,
  LinearScale,
  PieController,
  Tooltip,
} from 'chart.js';
import { format } from 'date-fns';
import { createEffect } from 'solid-js';
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

const getOrCreateLegendList = (chart: Chart, id: string) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer?.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = '0';
    listContainer.style.padding = '0';

    legendContainer?.appendChild(listContainer);
  }

  return listContainer;
};

const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(
    chart: Chart,
    args: {
      mode:
        | 'resize'
        | 'reset'
        | 'none'
        | 'hide'
        | 'show'
        | 'default'
        | 'active';
    },
    options: { containerID: string },
  ) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins?.legend?.labels?.generateLabels
      ? chart.options.plugins.legend.labels.generateLabels(chart)
      : [];

    items.forEach((item) => {
      const li = document.createElement('li');
      li.style.alignItems = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.marginLeft = '10px';

      li.onclick = () => {
        const { type } = chart.config as { type: string };
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index || 0);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex || 0,
            !chart.isDatasetVisible(item.datasetIndex || 0),
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle as string;
      boxSpan.style.borderColor = item.strokeStyle as string;
      boxSpan.style.borderWidth = `${item.lineWidth}px`;
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = '0';
      boxSpan.style.height = '20px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '20px';

      // Text
      const textContainer = document.createElement('p');
      textContainer.style.color = item.fontColor as string;
      textContainer.style.margin = '0';
      textContainer.style.padding = '0';
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};

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
          htmlLegend: {
            // ID of the container to put the legend in
            containerID: 'legend-container',
          },
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
  return (
    <div classList={{ main__wrapper: true, [styles.wrapper]: true }}>
      <div id="legend-container" />
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
