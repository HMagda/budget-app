import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import './DoughnutChart.modules.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({formattedDoughnutChartData}) => {
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setActive] = useState(true);

  const expense = {cost, category};

  useEffect(() => {
    setActive(formattedDoughnutChartData.labels.length < 8);
  }, [formattedDoughnutChartData.labels.length]);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/categorized-expense/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(expense),
    }).then(() => {
      console.log('new EXPENSE added');
    });

    function addData(chart, label, data) {
      formattedDoughnutChartData.labels.push(label);

      formattedDoughnutChartData.datasets[0].data.push(data);
    }

    addData(DoughnutChart, category, cost);

    setCost('');
    setCategory('');
  };

  const handleEdit = (e) => {
    e.preventDefault();

    function editData(chart, label, data) {
      const indexOfLabel = formattedDoughnutChartData.labels.indexOf(label);

      if (indexOfLabel !== -1) {
        formattedDoughnutChartData.labels.splice(indexOfLabel, 1, label);

        formattedDoughnutChartData.datasets[0].data.splice(indexOfLabel, 1, data);

        const objId = indexOfLabel + 1;

        fetch(`http://localhost:5000/categorized-expense/${objId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(expense),
        }).then(() => {
          console.log('CATEGORY EDITED');
        });
      }
    }

    editData(DoughnutChart, category, cost);

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
        <h2>ADD New Expense</h2>
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
            ADD Expense
          </button>
          {!isActive && (
            <p className='warning-text'>
              You can add up to 8 different categories
            </p>
          )}
        </form>
      </div>

      <div className='edit-categories'>
        <h2>EDIT Expense</h2>
        <form onSubmit={handleEdit}>
          <label htmlFor='edited-cost'>Cost:</label>
          <input
            type='number'
            id='edited-cost'
            required
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          ></input>
          <label htmlFor='category'>Category:</label>
          <select
            id='edited-category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option disabled className='instruction'>
              Click to choose
            </option>
            <option hidden>Click to choose</option>

            {formattedDoughnutChartData.labels.map((label) => {
              return (
                <option key={label} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
          <button type='submit'>EDIT Expense</button>
        </form>
      </div>
    </div>
  );
};

export default DoughnutChart;
