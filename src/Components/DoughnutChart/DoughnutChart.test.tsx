import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import DoughnutChart from './DoughnutChart';

const mockRawDoughnutChartData = [
  {id: 1, category: 'Groceries', cost: 100},
  {id: 2, category: 'Entertainment', cost: 50},
];

const mockFormattedDoughnutChartData = {
  labels: ['Groceries', 'Entertainment'],
  datasets: [
    {
      data: [100, 50],
      backgroundColor: ['#00ff00', '#ff0000'],
    },
  ],
};

// jest.mock('react-chartjs-2', () => ({
//   Doughnut: () => null,
// }));

jest.mock('react-chartjs-2', () => ({
  Doughnut: (props: any) => <div data-testid="doughnut-chart-mock" {...props} />,
}));

jest.mock('../Popup/Popup', () => (props: any) => <div>{props.children}</div>);

describe('DoughnutChart', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (typeof url === 'string') {
        if (url.endsWith('monthly-expense')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockRawDoughnutChartData),
          }) as Promise<Response>;
        } else if (url.endsWith('monthly-income')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockFormattedDoughnutChartData),
          }) as Promise<Response>;
        } else {
          return Promise.reject('Invalid URL');
        }
      } else {
        return Promise.reject('Invalid URL');
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders DoughnutChart component and displays the correct title', async () => {
    render(
      <DoughnutChart
        rawDoughnutChartData={mockRawDoughnutChartData}
        formattedDoughnutChartData={mockFormattedDoughnutChartData}
        setRawDoughnutChartData={() => {}}
        setFormattedDoughnutChartData={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Expenses this month')).toBeInTheDocument();
    });


    expect(screen.getByTestId('doughnut-chart-mock')).toBeInTheDocument();



  });

  it('renders the correct number of chart options buttons', () => {
    render(
      <DoughnutChart
        rawDoughnutChartData={mockRawDoughnutChartData}
        formattedDoughnutChartData={mockFormattedDoughnutChartData}
        setRawDoughnutChartData={() => {}}
        setFormattedDoughnutChartData={() => {}}
      />
    );

 

    const chartBtns = screen.getAllByRole('button', {
      name: /(Add|Edit|Delete)/i,
    });
    expect(chartBtns.length).toBe(3);
  });

  it('clicking the "Add" button opens the "Add New Expense" form', () => {
    render(
      <DoughnutChart
        rawDoughnutChartData={mockRawDoughnutChartData}
        formattedDoughnutChartData={mockFormattedDoughnutChartData}
        setRawDoughnutChartData={() => {}}
        setFormattedDoughnutChartData={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText('Add'));

    expect(
      screen.getByRole('heading', {name: /ADD New Expense/i})
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /DELETE Category/i})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /EDIT Expense/i})
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {name: 'ADD Expense'})
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', {name: 'EDIT Expense'})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'DELETE Category'})
    ).not.toBeInTheDocument();
  });

  it('clicking the "Edit" button opens the "EDIT Expense" form', () => {
    render(
      <DoughnutChart
        rawDoughnutChartData={mockRawDoughnutChartData}
        formattedDoughnutChartData={mockFormattedDoughnutChartData}
        setRawDoughnutChartData={() => {}}
        setFormattedDoughnutChartData={() => {}}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit'));

    expect(
      screen.getByRole('heading', {name: /EDIT Expense/i})
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /DELETE Category/i})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /ADD Expense/i})
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {name: 'EDIT Expense'})
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', {name: 'ADD Expense'})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'DELETE Category'})
    ).not.toBeInTheDocument();
  });

  it('clicking the "Delete" button opens the "DELETE Category" form', () => {
    render(
      <DoughnutChart
        rawDoughnutChartData={mockRawDoughnutChartData}
        formattedDoughnutChartData={mockFormattedDoughnutChartData}
        setRawDoughnutChartData={() => {}}
        setFormattedDoughnutChartData={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText('Delete'));

    expect(
      screen.getByRole('heading', {name: /DELETE Category/i})
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /ADD Expense/i})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {name: /EDIT Expense/i})
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {name: 'DELETE Category'})
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'ADD Expense'})
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'EDIT Expense'})
    ).not.toBeInTheDocument();
  });
});
