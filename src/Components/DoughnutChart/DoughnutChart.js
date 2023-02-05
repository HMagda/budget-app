import React, {useEffect, useState} from 'react';
import uuid from 'react-uuid';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

import './DoughnutChart.modules.scss';
import ChartForm from '../ChartForm/ChartForm';

ChartJS.register(ArcElement, Tooltip, Legend);

function customFetch(url, method, data) {
  fetch(url, {
    method: method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  })
    .then(() => {
      console.log('fetch', method);
    })
    .catch((error) => console.log(error));
}

const DoughnutChart = ({rawDoughnutChartData, formattedDoughnutChartData}) => {
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setActive] = useState(true);

  const expense = {cost, category};
  const empty = {};

  useEffect(() => {
    setActive(formattedDoughnutChartData.labels.length < 8);
  }, [formattedDoughnutChartData.labels.length]);

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    function addData(label, data) {
      formattedDoughnutChartData.labels.push(label);
      formattedDoughnutChartData.datasets[0].data.push(data);

      customFetch(
        'http://localhost:5000/categorized-expense/',
        'POST',
        expense
      );
    }

    addData(category, cost);

    setCost('');
    setCategory('');
  };

  const handleCategoryEdit = (e) => {
    e.preventDefault();

    function editData(label, data) {
      const indexOfLabel = formattedDoughnutChartData.labels.indexOf(label);
      formattedDoughnutChartData.labels.splice(indexOfLabel, 1, label);
      formattedDoughnutChartData.datasets[0].data.splice(indexOfLabel, 1, data);

      const editedItem = rawDoughnutChartData.find(
        (item) => item.category === label
      );
      const editedItemId = editedItem.id;

      customFetch(
        `http://localhost:5000/categorized-expense/${editedItemId}`,
        'PUT',
        expense
      );
    }

    editData(category, cost);

    setCost('');
    setCategory('');
  };

  const handleCategoryDelete = (e) => {
    e.preventDefault();

    function deleteData(label) {
      const indexOfLabel = formattedDoughnutChartData.labels.indexOf(label);
      formattedDoughnutChartData.labels.splice(indexOfLabel, 1);
      formattedDoughnutChartData.datasets[0].data.splice(indexOfLabel, 1);

      const deletedItem = rawDoughnutChartData.find(
        (item) => item.category === label
      );
      const deletedItemId = deletedItem.id;

      customFetch(
        `http://localhost:5000/categorized-expense/${deletedItemId}`,
        'DELETE',
        empty
      );
    }

    deleteData(category);

    setCost('');
    setCategory('');
  };

  return (
    <div className='categories-section-wrapper'>
      <h1>Expenses this month</h1>
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
          required
          className='select-category'
          id='category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value='' hidden>
            --Click to choose--
          </option>
          <option disabled className='instruction'>
            Click to choose
          </option>

          {formattedDoughnutChartData.labels.map((label) => {
            return (
              <option key={uuid()} value={label}>
                {label}
              </option>
            );
          })}
        </select>
        <button type='submit'>EDIT Expense</button>
      </ChartForm>

      <div className='chart-form-container'>
        <h2>DELETE Expense</h2>
        <form onSubmit={handleCategoryDelete}>
          <label htmlFor='category'>Category:</label>
          <select
            required
            className='selet-category'
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value='' hidden className='instruction'>
              --Click to choose--
            </option>
            <option disabled className='instruction'>
              Click to choose
            </option>

            {formattedDoughnutChartData.labels.map((label) => {
              return (
                <option key={uuid()} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
          <button type='submit'>DELETE Category</button>
        </form>
      </div> 
    </div>
  );
};

export default DoughnutChart;
