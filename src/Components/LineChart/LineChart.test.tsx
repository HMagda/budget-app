import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import LineChart from './LineChart';
import {yearArr} from '../../utils';

const formattedLineChartData = {
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Income',
      data: [2000, 2500, 3000],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'Expense',
      data: [1500, 1800, 2100],
      backgroundColor: 'rgba(255,99,132,0.4)',
      borderColor: 'rgba(255,99,132,1)',
    },
  ],
};

const displayDataset = jest.fn();

jest.mock('react-chartjs-2', () => ({
  Line: (props: any) => <div data-testid='line-chart-mock' {...props} />,
}));

describe('LineChart', () => {
  it('renders LineChart component with provided props', () => {
    render(
      <LineChart formattedLineChartData={formattedLineChartData}>
        {yearArr.map((year) => (
          <button
            key={year}
            className='btn-year'
            value={year}
            onClick={() => displayDataset(year)}
          >
            {year}
          </button>
        ))}
      </LineChart>
    );

    expect(screen.getByText('Yearly income and expense')).toBeInTheDocument();

    expect(screen.getByTestId('line-chart-mock')).toBeInTheDocument();

    expect(screen.getByRole('button', {name: '2023'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '2021'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: '2022'})).toBeInTheDocument();
  });

  it('renders the correct number of buttons', () => {
    render(
      <LineChart formattedLineChartData={formattedLineChartData}>
        {yearArr.map((year) => (
          <button
            key={year}
            className='btn-year'
            value={year}
            onClick={() => displayDataset(year)}
          >
            {year}
          </button>
        ))}
      </LineChart>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(yearArr.length);
  });

  it('calls displayDataset function when a year button is clicked', () => {
    render(
      <LineChart formattedLineChartData={formattedLineChartData}>
        {yearArr.map((year) => (
          <button
            key={year}
            className='btn-year'
            value={year}
            onClick={() => displayDataset(year)}
          >
            {year}
          </button>
        ))}
      </LineChart>
    );

    const button2021 = screen.getByText('2021');
    fireEvent.click(button2021);

    expect(displayDataset).toHaveBeenCalledTimes(1);
    expect(displayDataset).toHaveBeenCalledWith(2021);
  });
});
