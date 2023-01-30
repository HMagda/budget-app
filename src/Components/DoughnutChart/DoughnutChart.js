import React, {useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import './DoughnutChart.modules.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({formattedDoughnutChartData}) => {
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');

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
    <div>
      <div className='doughnut-chart-container'>
        <Doughnut
          data={formattedDoughnutChartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'right',
                labels: {
                  color: 'black',
                },
              },
            },
          }}
        />
      </div>

      <div className='add-categories'>
        <h2>Add New Expense</h2>
        <form onSubmit={handleExpenseSubmit}>
          <label>Cost:</label>
          <textarea
            required
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          ></textarea>
          <label>Category:</label>
          <textarea
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></textarea>
          <button type='submit'>Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default DoughnutChart;
