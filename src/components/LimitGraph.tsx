import { filteredData, limits } from '../data'
import { createEffect } from "solid-js";
import { Expense } from "~/types";
import { CategoryScale, Chart, LinearScale, BarController, LineElement, BarElement, Legend, Tooltip, Filler, Colors } from 'chart.js';
import styles from './graph.module.css'

Chart.register([
    CategoryScale,
    BarController,
    LineElement,
    LinearScale,
    BarElement,
    Legend,
    Tooltip,
    Filler,
    Colors,
]);

export default function LimitGraph() {
    let canvas: HTMLCanvasElement | undefined
    let chart: Chart | undefined

    createEffect(() => {
        const expensesByCategory = filteredData()?.reduce((result, item) => {
            result[item.category] = (result[item.category] || []).concat(item)
            return result
        }, {} as Record<string, Expense[]>) || {}
        if (!canvas) {
            return
        }
        const labels = Object.keys(expensesByCategory);
        const data = Object.values(expensesByCategory).map(expenses => expenses.reduce((tot, expense) => tot + expense.value, 0))
        if (!chart) {
            chart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: "pianificate",
                        data: Object.values(limits())
                    }, {
                        label: "spese",
                        data,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },

                    }
                },
            });
        } else {
            chart.data.datasets[0].data = data
            chart.data.labels = labels
            chart.update()
        }
    })
    return (
        <div class="main__wrapper">
            <canvas class={styles.canvas} ref={canvas}></canvas>
        </div>
    )
}