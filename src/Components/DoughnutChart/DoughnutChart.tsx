import React, {useEffect, useState} from 'react';
import uuid from 'react-uuid';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {RiAddLine, RiEdit2Line, RiDeleteBinLine} from 'react-icons/ri';

import '../../styles/global.scss';
import './DoughnutChart.modules.scss';
import ChartForm from '../ChartForm/ChartForm';
import Popup from '../Popup/Popup';
import {customFetch} from '../../utils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  rawDoughnutChartData: {
    id: number;
    category: string;
    cost: number;
  }[];
  formattedDoughnutChartData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };

  setRawDoughnutChartData: React.Dispatch<
    React.SetStateAction<{id: number; category: string; cost: number}[]>
  >;

  setFormattedDoughnutChartData: React.Dispatch<
    React.SetStateAction<{
      labels: string[];
      datasets: {
        data: number[];
        backgroundColor: string[];
      }[];
    }>
  >;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  rawDoughnutChartData,
  formattedDoughnutChartData,
  setRawDoughnutChartData,
  setFormattedDoughnutChartData,
}) => {
  const [cost, setCost] = useState<number | string>('');
  const [category, setCategory] = useState<string>('');
  const [addedElementId, setAddedElementId] = useState<string>('');

  const [isActive, setActive] = useState<boolean>(true);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);

  useEffect(() => {
    setShowWarning(formattedDoughnutChartData.labels.length >= 8);
  }, [formattedDoughnutChartData.labels.length]);

  function displayAddForm() {
    setShowAddForm(!showAddForm);
  }

  function displayEditForm() {
    setShowEditForm(!showEditForm);
  }

  function displayDeleteForm() {
    setShowDeleteForm(!showDeleteForm);
  }

  const resetForm = () => {
    setCost('');
    setCategory('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);

    const categoryExists = rawDoughnutChartData.some(
      (item) => item.category === e.target.value
    );
    
    categoryExists ? setActive(false) : setActive(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setAddedElementId(newId);
  };

  const handleCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const editedItem = rawDoughnutChartData.find(
      (item) => item.category === category
    );

    let editedElement: {cost: number; category: string; id: number};
    let elementId: number | string;

    if (!editedItem) {
      console.log('Element not found!');
      return;
    }

    const editedItemId = editedItem.id;

    if (editedItemId === undefined) {
      editedElement = {
        cost: Number(cost),
        category,
        id: Number(addedElementId),
      };
      elementId = editedElement.id;
    } else {
      editedElement = {...editedItem, cost: Number(cost), category};
      elementId = editedItemId;
    }

    await customFetch(
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
  };

  const handleCategoryDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const element = rawDoughnutChartData.find(
      (item) => item.category === category
    );

    if (!element) {
      console.log('Element not found!');
      return;
    }

    const id: number = element.id;

    await customFetch(
      `http://localhost:5000/categorized-expense/${id}`,
      'DELETE',
      {}
    );

    const newRawData = rawDoughnutChartData.filter((item) => item.id !== id);
    setRawDoughnutChartData(newRawData);

    const labelIndex = formattedDoughnutChartData.labels.indexOf(category);
    const newLabels = [...formattedDoughnutChartData.labels];
    newLabels.splice(labelIndex, 1);

    const newDatasets = formattedDoughnutChartData.datasets.map((dataset) => {
      return {
        ...dataset,
        data: dataset.data.filter((_, i) => i !== labelIndex),
      };
    });

    setFormattedDoughnutChartData({
      labels: newLabels,
      datasets: newDatasets,
    });

    resetForm();
    setShowDeleteForm(false);
  };

  return (
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
                setShowAddForm={setShowAddForm}
                setShowEditForm={setShowEditForm}
                setShowDeleteForm={setShowDeleteForm}
                resetForm={resetForm}
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
                    onChange={handleCategoryChange}
                  ></input>
                  <button
                    type='submit'
                    disabled={!isActive || showWarning}
                    className='add'
                  >
                    ADD Expense
                  </button>

                  {showWarning && (
                    <p className='warning-text'>
                      You can add up to 8 different categories
                    </p>
                  )}

                  {!isActive && (
                    <p className='warning-text'>This category already exists</p>
                  )}
                </ChartForm>
              </Popup>
            )}

            {showEditForm && (
              <Popup
                setShowAddForm={setShowAddForm}
                setShowEditForm={setShowEditForm}
                setShowDeleteForm={setShowDeleteForm}
                resetForm={resetForm}
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
                        <option key={uuid()} value={label as string}>
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
                setShowAddForm={setShowAddForm}
                setShowEditForm={setShowEditForm}
                setShowDeleteForm={setShowDeleteForm}
                resetForm={resetForm}
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
                          <option key={uuid()} value={label as string}>
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
  );
};

export default DoughnutChart;
