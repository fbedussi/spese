import { format } from "date-fns";
import { filteredData } from "~/data";
import { formatMoney } from "~/helpers";

export function ExpensesList() {
    return (
        <table>
            <thead>
                <tr>
                    <td>Data</td>
                    <td>Nome</td>
                    <td>Importo</td>
                </tr>
            </thead>
            <tbody>
                {filteredData()
                    .sort((a, b) => a.date.gte(b.date) ? -1 : 1)
                    .map(({ name, date, value, category, subcategory, span }) => (<tr>
                        <td>{format(date.getDate(), 'dd/MM')}</td>
                        <td>{name}</td>
                        <td>{formatMoney(value)}</td>

                    </tr>))}
            </tbody>
        </table>
    )

}