import React, {useEffect, useState} from 'react';
import uuid from 'react-uuid';
import 'normalize.css';

import './styles/global.scss';
import SummaryCard from './Components/SummaryCard/SummaryCard';
import DoughnutChart from './Components/DoughnutChart/DoughnutChart.tsx';
import LineChart from './Components/LineChart/LineChart';

import {updateChart, updateChart2} from './utils';

const GraphStyle = class {
  constructor(label, borderWidth, borderColor, backgroundColor) {
    this.label = label;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
  }
};

const yearArr = ['2021', '2022', '2023'];
const currentYear = new Date().getFullYear();

const App = () => {
  const [rawDoughnutChartData, setRawDoughnutChartData] = useState(null);
  const [formattedDoughnutChartData, setFormattedDoughnutChartData] =
    useState(null);

  const [rawLineChartData, setRawLineChartData] = useState(null);
  const [formattedLineChartData, setFormattedLineChartData] = useState(null);

  const [chosenYear, setChosenYear] = useState(currentYear);

  const displayDataset = (e) => {
    const targetYear = e.target.value;
    setChosenYear(targetYear);
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
    const incomeStyle = new GraphStyle('Income', 1, '#57a773', '#57a773');
    const expenseStyle = new GraphStyle('Expense', 1, 'red', 'red');
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
              setFormattedDoughnutChartData={setFormattedDoughnutChartData}
              rawDoughnutChartData={rawDoughnutChartData}
              formattedDoughnutChartData={formattedDoughnutChartData}
            />
          )}
        </div>

        <div>
          {rawLineChartData && (
            <LineChart formattedLineChartData={formattedLineChartData}>
              {yearArr &&
                yearArr.map((year) => {
                  return (
                    <button
                      key={uuid()}
                      className='btn-year'
                      value={year}
                      onClick={displayDataset}
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
