import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import SummaryCard from './SummaryCard';

const mockDataMonthlyExpense = [
  {sumExpense: 500, month: 'January', id: 1, year: 2023},
  {sumExpense: 600, month: 'February', id: 3, year: 2022},
];

const mockDataMonthlyIncome = [
  {sumIncome: 1000, month: 'January', id: 2, year: 2023},
  {sumIncome: 1200, month: 'February', id: 4, year: 2022},
];

describe('SummaryCard', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (typeof url === 'string') {
        if (url.endsWith('monthly-expense')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockDataMonthlyExpense),
          }) as Promise<Response>;
        } else if (url.endsWith('monthly-income')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockDataMonthlyIncome),
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

  it('renders correctly and fetches data', async () => {
    render(<SummaryCard />);

    expect(screen.getByText(/Total balance in/)).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await waitFor(() => {
      expect(screen.getByTestId('income-sum')).toHaveTextContent('$1000');
    });
    await waitFor(() => {
      expect(screen.getByTestId('expense-sum')).toHaveTextContent('$500');
    });
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  it('changes year correctly', async () => {
    render(<SummaryCard />);
    
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await waitFor(() => {
      expect(screen.getByTestId('income-sum')).toHaveTextContent('$1000');
    });
    await waitFor(() => {
      expect(screen.getByTestId('expense-sum')).toHaveTextContent('$500');
    });
    const select = screen.getByTestId('year-select') as HTMLSelectElement;
    fireEvent.change(select, {target: {value: '2022'}});
    expect(select.value).toBe('2022');
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await waitFor(() => {
      expect(screen.getByTestId('income-sum')).toHaveTextContent('$1200');
    });
    await waitFor(() => {
      expect(screen.getByTestId('expense-sum')).toHaveTextContent('$600');
    });
  });

  it('handles fetch errors', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    global.fetch = jest.fn(() => Promise.reject('API is down'));
    render(<SummaryCard />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(consoleSpy).toHaveBeenCalled();
  });
});
