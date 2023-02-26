import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import uuid from 'react-uuid';
import 'normalize.css';

import './styles/global.scss';
import {GraphStyle, updateChart, updateChart2} from './utils';
import SummaryCard from './Components/SummaryCard/SummaryCard';
import DoughnutChart from './Components/DoughnutChart/DoughnutChart';
import LineChart from './Components/LineChart/LineChart';

const yearArr = [2021, 2022, 2023];
const currentYear = new Date().getFullYear();

const App = () => {
  const [formattedLineChartData, setFormattedLineChartData] = useState(null);

  const [rawDoughnutChartData, setRawDoughnutChartData] = useState<
    {id: number; category: string; cost: number}[]
  >([]);

  const [formattedDoughnutChartData, setFormattedDoughnutChartData] = useState<{
    labels: string[];
    datasets: {data: number[]; backgroundColor: string[]}[];
  } | null>(null);

  const [rawLineChartData, setRawLineChartData] = useState<
    Array<Record<string, any>>
  >([]);

  const [chosenYear, setChosenYear] = useState(currentYear);

  const displayDataset = (year: number) => {
    setChosenYear(year);
  };

  useEffect(() => {
    const doughnutChartStyle = new GraphStyle('Cost', 0, '', [
      '#E69F00',
      '#56B4E9',
      '#009E73',
      '#F0E442',
      '#0072B2',
      '#D55E00',
      '#CC79A7',
      '#5D1E9A',
    ]);

    updateChart(
      setRawDoughnutChartData,
      setFormattedDoughnutChartData,
      'categorized-expense',
      'category',
      'cost',
      doughnutChartStyle
    );
  }, []);

  useEffect(() => {
    const incomeStyle = new GraphStyle('Income', 1, '#57a773', ['#57a773']);
    const expenseStyle = new GraphStyle('Expense', 1, 'red', ['red']);

    const styles = [incomeStyle, expenseStyle];
    const keywords = [
      'monthly-income?year=' + chosenYear,
      'monthly-expense?year=' + chosenYear,
    ];
    const ynames = ['sumIncome', 'sumExpense'];
    updateChart2(
      setRawLineChartData,
      setFormattedLineChartData,
      keywords,
      'month',
      ynames,
      styles
    );
  }, [chosenYear]);

  return (
    <>
      <div className='wrapper'>
        <SummaryCard />
        <div>
          {formattedDoughnutChartData && (
            <DoughnutChart
              setRawDoughnutChartData={setRawDoughnutChartData}
              setFormattedDoughnutChartData={
                setFormattedDoughnutChartData as Dispatch<
                  SetStateAction<{
                    labels: string[];
                    datasets: {data: number[]; backgroundColor: string[]}[];
                  }>
                >
              }
              rawDoughnutChartData={rawDoughnutChartData}
              formattedDoughnutChartData={formattedDoughnutChartData}
            />
          )}
        </div>
        <div>
          {rawLineChartData && (
            <LineChart
              formattedLineChartData={
                formattedLineChartData ?? {
                  labels: [],
                  datasets: [
                    {label: '', data: [], backgroundColor: '', borderColor: ''},
                  ],
                }
              }
            >
              {yearArr &&
                yearArr.map((year) => {
                  return (
                    <button
                      key={uuid()}
                      className='btn-year'
                      value={year}
                      onClick={() => displayDataset(year)}
                    >
                      {year}
                    </button>
                  );
                })}
            </LineChart>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
