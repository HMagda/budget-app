import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import ChartForm from './ChartForm';

describe('ChartForm', () => {
  const mockActionHandler = jest.fn();
  const mockSetCost = jest.fn();
  const mockHeader = 'Test Header';
  const mockCost = 10.99;
  const mockChildren = <div>Mock Children</div>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct header and children', () => {
    render(
      <ChartForm
        actionHandler={mockActionHandler}
        setCost={mockSetCost}
        header={mockHeader}
        cost={mockCost}
      >
        {mockChildren}
      </ChartForm>
    );
    expect(screen.getByText(mockHeader)).toBeInTheDocument();
    expect(screen.getByText('Mock Children')).toBeInTheDocument();
  });

  it('calls the actionHandler when the form is submitted', () => {
    render(
      <ChartForm
        actionHandler={mockActionHandler}
        setCost={mockSetCost}
        header={mockHeader}
        cost={mockCost}
      >
        {mockChildren}
      </ChartForm>
    );
    fireEvent.submit(screen.getByTestId('chart-form'));
    expect(mockActionHandler).toHaveBeenCalledTimes(1);
  });

  it('calls setCost when the cost input is changed', () => {
    render(
      <ChartForm
        actionHandler={mockActionHandler}
        setCost={mockSetCost}
        header={mockHeader}
        cost={mockCost}
      >
        {mockChildren}
      </ChartForm>
    );
    fireEvent.change(screen.getByLabelText('Cost:'), {target: {value: 20.5}});
    expect(mockSetCost).toHaveBeenCalledWith(20.5);
  });
});
