import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import App from './App';
import DoughnutChart from './Components/DoughnutChart/DoughnutChart';
import LineChart from './Components/LineChart/LineChart';

jest.mock('./utils', () => {
  return {
    GraphStyle: jest.fn(),
    updateChart: jest.fn(),
    updateChart2: jest.fn(),
  };
});

jest.mock('./Components/SummaryCard/SummaryCard', () => () => (
  <div>SummaryCard</div>
));

jest.mock('./Components/DoughnutChart/DoughnutChart', () => () => (
  <div>DoughnutChart</div>
));

jest.mock('./Components/LineChart/LineChart', () => () => <div>LineChart</div>);

describe('App', () => {
  it('renders SummaryCard component', () => {
    render(<App />);
    expect(screen.getByText('SummaryCard')).toBeInTheDocument();
  });

  it('renders "Loading..." message instead of DoughnutChart when formattedDoughnutChartData is null', () => {
    render(<App />);
    expect(screen.getByTestId('dougnut-chart-loading')).toBeInTheDocument();
    expect(screen.queryByText('DoughnutChart')).not.toBeInTheDocument();
  });

  it('renders DoughnutChart when formattedDoughnutChartData is not null', async () => {
    const formattedDoughnutChartData = {
      labels: ['A', 'B', 'C'],
      datasets: [{data: [1, 2, 3], backgroundColor: ['red', 'green', 'blue']}],
    };
    const setFormattedDoughnutChartData = jest.fn();

    render(
      <DoughnutChart
        setRawDoughnutChartData={() => {}}
        setFormattedDoughnutChartData={setFormattedDoughnutChartData}
        rawDoughnutChartData={[]}
        formattedDoughnutChartData={formattedDoughnutChartData}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('DoughnutChart')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('dougnut-chart-loading')).not.toBeInTheDocument();
  });

  it('renders "Loading..." message instead of LineChart when formattedLineChartData is null', () => {
    render(<App />);
    expect(screen.getByTestId('line-chart-loading')).toBeInTheDocument();
    expect(screen.queryByText('LineChart')).not.toBeInTheDocument();
  });

  it('renders LineChart when formattedLineChartData is not null', async () => {
    const formattedLineChartData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: 'test',
          data: [1, 2, 3],
          backgroundColor: 'red',
          borderColor: 'black',
        },
      ],
    };

    render(
      <LineChart
        formattedLineChartData={formattedLineChartData}
        children={undefined}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('LineChart')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('line-chart-loading')).not.toBeInTheDocument();
  });
});
