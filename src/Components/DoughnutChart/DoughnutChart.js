import React, {useEffect, useState} from 'react';
import uuid from 'react-uuid';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {RiAddLine, RiEdit2Line, RiDeleteBinLine} from 'react-icons/ri';

import '../../styles/global.scss';
import './DoughnutChart.modules.scss';
import ChartForm from '../ChartForm/ChartForm';
import Popup from '../Popup/Popup';

import {customFetch} from '../../utils.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  rawDoughnutChartData,
  formattedDoughnutChartData,
  setRawDoughnutChartData,
  setFormattedDoughnutChartData,
}) => {
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setActive] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [isPopupShown, setIsPopupShown] = useState(false);

  const [addedElementId, setAddedElementId] = useState('');

  useEffect(() => {
    setActive(formattedDoughnutChartData.labels.length < 8);
  }, [formattedDoughnutChartData.labels.length]);

  function displayAddForm() {
    setShowAddForm(!showAddForm);
    setIsPopupShown(true);
  }

  function displayEditForm() {
    setShowEditForm(!showEditForm);
    setIsPopupShown(true);
  }

  function displayDeleteForm() {
    setShowDeleteForm(!showDeleteForm);
    setIsPopupShown(true);
  }

  const resetForm = () => {
    setCost('');
    setCategory('');
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    const newElement = {cost, category};

    const response = await fetch('http://localhost:5000/categorized-expense', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newElement),
    });
    const createdElement = await response.json();

    const newId = createdElement.id;

    setRawDoughnutChartData((prevData) => [...prevData, createdElement]);
    setFormattedDoughnutChartData((prevData) => ({
      ...prevData,
      labels: [...prevData.labels, createdElement.category],
      datasets: [
        {
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, createdElement.cost],
        },
      ],
    }));

    resetForm();
    setShowAddForm(false);
    setIsPopupShown(false);
    setAddedElementId(newId);
  };

  const handleCategoryEdit = (e) => {
    e.preventDefault();

    const editedItem = rawDoughnutChartData.find(
      (item) => item.category === category
    );

    const editedItemId = editedItem.id;
    let editedElement;
    let elementId;

    if (editedItemId === undefined) {
      editedElement = {cost, category, id: addedElementId};
      elementId = editedElement.id;
    } else {
      editedElement = {...editedItem, cost, category};
      elementId = editedItemId;
    }

    customFetch(
      `http://localhost:5000/categorized-expense/${elementId}`,
      'PUT',
      editedElement
    );

    const updatedElements = [...rawDoughnutChartData];
    const elementIndex = updatedElements.findIndex(
      (element) => element.id === elementId
    );
    updatedElements[elementIndex] = editedElement;

    setRawDoughnutChartData(updatedElements);

    const labelIndex = formattedDoughnutChartData.labels.indexOf(category);

    const newLabels = [...formattedDoughnutChartData.labels];
    newLabels.splice(labelIndex, 1, category);

    const newDatasets = [
      {
        ...formattedDoughnutChartData.datasets[0],
        data: formattedDoughnutChartData.datasets[0].data.map((cost, i) =>
          i === labelIndex ? Number(editedElement.cost) : cost
        ),
      },
    ];

    setFormattedDoughnutChartData({
      labels: newLabels,
      datasets: newDatasets,
    });

    resetForm();
    setShowEditForm(false);
    setIsPopupShown(false);
  };

  const handleCategoryDelete = (e) => {
    e.preventDefault();

    const element = rawDoughnutChartData.find(
      (item) => item.category === category
    );

    if (!element) {
      console.log('Element not found!');
      return;
    }

    const id = element.id;

    customFetch(
      `http://localhost:5000/categorized-expense/${id}`,
      'DELETE',
      {}
    );

    const newRawData = rawDoughnutChartData.filter((item) => item.id !== id);
    setRawDoughnutChartData(newRawData);

    const labels = formattedDoughnutChartData.labels;
    const labelIndex = labels.indexOf(category);
    const newLabels = [...labels];
    newLabels.splice(labelIndex, 1);
    setFormattedDoughnutChartData((prevData) => ({
      ...prevData,
      labels: newLabels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: prevData.datasets[0].data.filter((_, i) => i !== labelIndex),
        },
      ],
    }));

    resetForm();
    setShowDeleteForm(false);
    setIsPopupShown(false);
  };

  return (
    <>
      <div className='categories-section-wrapper'>
        <div className='doughnut-chart-container'>
          <h1>Expenses this month</h1>
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

          <div className='chart-options-wrapper'>
            <div className='chart-btns-container'>
              <button
                className='chart-btn + add'
                type='button'
                onClick={displayAddForm}
              >
                <RiAddLine />
              </button>
              <button
                className='chart-btn + edit'
                type='button'
                onClick={displayEditForm}
              >
                <RiEdit2Line />
              </button>
              <button
                className='chart-btn + delete'
                type='button'
                onClick={displayDeleteForm}
              >
                <RiDeleteBinLine />
              </button>
            </div>

            <div className='chart-form-wrapper'>
              {showAddForm && (
                <Popup
                  setIsPopupShown={setIsPopupShown}
                  isPopupShown={isPopupShown}
                  setShowAddForm={setShowAddForm}
                  setShowEditForm={setShowEditForm}
                  setShowDeleteForm={setShowDeleteForm}
                >
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
                    <button type='submit' disabled={!isActive} className='add'>
                      ADD Expense
                    </button>
                    {!isActive && (
                      <p className='warning-text'>
                        You can add up to 8 different categories
                      </p>
                    )}
                  </ChartForm>
                </Popup>
              )}

              {showEditForm && (
                <Popup
                  setIsPopupShown={setIsPopupShown}
                  isPopupShown={isPopupShown}
                  setShowAddForm={setShowAddForm}
                  setShowEditForm={setShowEditForm}
                  setShowDeleteForm={setShowDeleteForm}
                >
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
                    <button type='submit' className='edit'>
                      EDIT Expense
                    </button>
                  </ChartForm>
                </Popup>
              )}

              {showDeleteForm && (
                <Popup
                  setIsPopupShown={setIsPopupShown}
                  isPopupShown={isPopupShown}
                  setShowAddForm={setShowAddForm}
                  setShowEditForm={setShowEditForm}
                  setShowDeleteForm={setShowDeleteForm}
                >
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
                      <button type='submit' className='delete'>
                        DELETE Category
                      </button>
                    </form>
                  </div>
                </Popup>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoughnutChart;
