import { filteredData, filteredDataByCategory } from '../data';
import { createEffect } from 'solid-js';
import { Expense } from '~/types';
import {
  CategoryScale,
  Chart,
  LinearScale,
  PieController,
  LineElement,
  ArcElement,
  Legend,
  Tooltip,
  Filler,
  Colors,
} from 'chart.js';
import styles from './graph.module.css';

Chart.register([
  CategoryScale,
  PieController,
  LineElement,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip,
  Filler,
  Colors,
]);

export default function Graph() {
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
      type: 'pie',
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
              label: function (context) {
                return `€ ${context.parsed} • ${Math.round((context.parsed / context.dataset.data.reduce((tot, n) => tot + n)) * 100)}%`;
              },
            },
          },
        },
      },
    });
    // } else {
    //     chart.data.datasets[0].data = data
    //     chart.data.labels = labels
    //     chart.update()
    // }
  });
  return (
    <div class="main__wrapper">
      <canvas class={styles.canvas} ref={canvas}></canvas>
    </div>
  );
}
