import { filteredData } from '../data'
import { createEffect } from "solid-js";
import { Expense } from "~/types";
import { CategoryScale, Chart, LinearScale, PieController, LineElement, ArcElement, Legend, Tooltip, Filler, Colors } from 'chart.js';
import styles from './graph.module.css'

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
                type: 'pie',
                data: {
                    labels,
                    datasets: [{
                        data,
                        hoverOffset: 4,
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
        <canvas class={styles.canvas} ref={canvas}></canvas>
    )
}