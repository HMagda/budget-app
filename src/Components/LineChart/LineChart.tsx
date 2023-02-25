import React, {ReactNode} from 'react';
import Chart from 'chart.js/auto';
import {CategoryScale, LinearScale} from 'chart.js';
import {Line} from 'react-chartjs-2';

import './LineChart.modules.scss';

Chart.register(CategoryScale);
Chart.register(LinearScale);

type LineChartProps = {
  children: ReactNode;
  formattedLineChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
};

const LineChart: React.FC<LineChartProps> = ({
  children,
  formattedLineChartData,
}) => {
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
