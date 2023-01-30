import React, {useEffect, useState} from 'react';
import 'normalize.css';
import './styles/global.scss';
import SummaryCard from './Components/SummaryCard/SummaryCard';
import DoughnutChart from './Components/DoughnutChart/DoughnutChart';

const GraphStyle = class {
  constructor(label, borderWidth, borderColor, backgroundColor) {
    this.label = label;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
  }
};

const App = () => {
  const [formattedDoughnutChartData, setFormattedDoughnutChartData] =
    useState(null);

  const updateChart = (setter, keyword, xname, yname, style) => {
    fetch('http://localhost:5000/' + keyword)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const x = data.map(function (dataArr) {
          return dataArr[xname];
        });

        const y = data.map(function (dataArr) {
          return dataArr[yname];
        });

        let formattedChartData = {
          labels: x,
          datasets: [y].map(function (value) {
            return {
              label: style.label,
              data: value,
              borderWidth: style.borderWidth,
              borderColor: style.borderColor,
              backgroundColor: style.backgroundColor,
            };
          }),
        };
        setter(formattedChartData);
      });
  };

  useEffect(() => {
    const doughnutChartStyle = new GraphStyle('Cost', 0, '', [
      'black',
      'red',
      'green',
      'pink',
      'blue',
    ]);
    updateChart(
      setFormattedDoughnutChartData,
      'categorized-expense',
      'category',
      'cost',
      doughnutChartStyle
    );
  }, []);

  return (
    <>
      <div className='wrapper'>
        <SummaryCard />
        <div>
          {formattedDoughnutChartData && (
            <DoughnutChart
              formattedDoughnutChartData={formattedDoughnutChartData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
