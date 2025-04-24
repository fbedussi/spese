import { filteredDataByCategory, limits } from "~/data";
import { formatMoney } from "~/helpers";

export function LimitTable() {

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
                    {Object.entries(filteredDataByCategory())
                        .map(([key, expenses]) => (<tr>
                            <td>{key}</td>
                            <td>{formatMoney(limits()[key])}</td>
                            <td>{formatMoney(expenses.reduce((tot, expense) => tot + expense.value, 0))}</td>
                        </tr>))}
                </tbody>
            </table>
        </div>
    )

}