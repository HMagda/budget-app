import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import './DoughnutChart.modules.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({formattedDoughnutChartData}) => {
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    setActive(formattedDoughnutChartData.labels.length < 8);
  }, [formattedDoughnutChartData.labels.length]);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const expense = {cost, category};

    fetch('http://localhost:5000/categorized-expense/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(expense),
    }).then(() => {
      console.log('new income added');
    });

    function addData(chart, label, data) {
      formattedDoughnutChartData.labels.push(label);
      formattedDoughnutChartData.datasets.forEach((dataset) => {
        dataset.data.push(data);
      });
    }

    addData(DoughnutChart, category, cost);

    setCost('');
    setCategory('');
  };

  return (
    <div className='categories-section-wrapper'>
      <div className='doughnut-chart-container'>
        <Doughnut
          data={formattedDoughnutChartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'left',
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
      </div>

      <div className='add-categories'>
        <h2>Add New Expense</h2>
        <form onSubmit={handleExpenseSubmit}>
          <label htmlFor='new-cost'>Cost:</label>
          <input
            type='number'
            id='new-cost'
            required
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          ></input>
          <label htmlFor='new-category'>Category:</label>
          <input
            type='text'
            id='new-category'
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></input>
          <button type='submit' disabled={!isActive}>
            Add Expense
          </button>
          {!isActive && (
            <p className='warning-text'>
              You can add up to 8 different categories
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DoughnutChart;
