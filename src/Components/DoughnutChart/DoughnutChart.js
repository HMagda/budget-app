import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import './DoughnutChart.modules.scss';

import ChartForm from '../ChartForm/ChartForm';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({formattedDoughnutChartData}) => {
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setActive] = useState(true);

  const expense = {cost, category};

  useEffect(() => {
    setActive(formattedDoughnutChartData.labels.length < 8);
  }, [formattedDoughnutChartData.labels.length]);

  const handleCategorySubmit = (e) => {
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

  const handleCategoryEdit = (e) => {
    e.preventDefault();

    function editData(chart, label, data) {
      const indexOfLabel = formattedDoughnutChartData.labels.indexOf(label);

      if (indexOfLabel !== -1) {
        formattedDoughnutChartData.labels.splice(indexOfLabel, 1, label);

        formattedDoughnutChartData.datasets[0].data.splice(
          indexOfLabel,
          1,
          data
        );

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

      <ChartForm
        actionHandler={handleCategorySubmit}
        header={'ADD New Expense'}
        cost={cost}
        setCost={setCost}
      >
        <input
          type='text'
          id='category'
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
      </ChartForm>

      <ChartForm
        actionHandler={handleCategoryEdit}
        header={'EDIT Expense'}
        cost={cost}
        setCost={setCost}
      >
        <select
          id='category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled className='instruction'>
            Click to choose
          </option>
          <option hidden>--Click to choose--</option>

          {formattedDoughnutChartData.labels.map((label) => {
            return (
              <option key={label} value={label}>
                {label}
              </option>
            );
          })}
        </select>
        <button type='submit'>EDIT Expense</button>
      </ChartForm>

    </div>
  );
};

export default DoughnutChart;
