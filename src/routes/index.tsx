import { AddExpense } from '~/components/AddExpense';
import { ExpensesList } from '~/components/ExpensesList';
import Graph from '~/components/Graph';
import LimitGraph from '~/components/LimitGraph';
import { LimitTable } from '~/components/LimitTable';
import PeriodSelection from '~/components/PeriodSelection';
import { Slider } from '~/components/Slider';

export default function Home() {
  return (
    <main class="home" data-testid="home-page">
      <script src="https://cdn.jsdelivr.net/npm/chart.js" />

      <PeriodSelection />
      <Slider>
        <div>
          <Graph />
          <ExpensesList />
        </div>
        <div>
          <LimitGraph />
          <LimitTable />
        </div>
      </Slider>
      <AddExpense />
    </main>
  );
}
