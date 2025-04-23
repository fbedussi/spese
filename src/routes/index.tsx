import { AddExpense } from "~/components/AddExpense";
import { ExpensesList } from "~/components/ExpensesList";
import Graph from "~/components/Graph";
import PeriodSelection from "~/components/PeriodSelection";

export default function Home() {
  return (
    <main>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

      <PeriodSelection />
      <Graph />
      <AddExpense />
      <ExpensesList />
    </main>
  );
}
