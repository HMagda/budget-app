import React from 'react';
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

import './LineChart.modules.scss';

const LineChart = ({children, formattedLineChartData}) => {
  return (
    <div className='line-chart-wrapper'>
      <div className='line-chart-container'>
        <h1>Yearly income and expense</h1>
        <Line
          data={formattedLineChartData}
          options={{
            maintainAspectRatio: true,

            scales: {
              y: {
                beginAtZero: true,

                border: {
                  color: '#fbf5f3cc',
                },

                ticks: {
                  color: '#fbf5f3cc',

                  font: {
                    size: 14,
                    family: 'Poppins, sans-serif',
                  },
                },
              },
              x: {
                border: {
                  color: '#fbf5f3cc',
                },

                ticks: {
                  color: '#fbf5f3cc',
                  font: {
                    size: 14,
                    family: 'Poppins, sans-serif',
                  },
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: '#fbf5f3cc',
                  font: {
                    size: 14,
                    family: 'Poppins, sans-serif',
                  },
                },
              },
            },
          }}
        />

        <div className='year-btns-container'>{children}</div>
      </div>
    </div>
  );
};

export default LineChart;
