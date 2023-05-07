import React, {useEffect, useState} from 'react';

import './SummaryCard.modules.scss';

type MonthlyExpense = {
  sumExpense: number;
  month: string;
  id: number;
  year: number;
};

type MonthlyIncome = {
  sumIncome: number;
  month: string;
  id: number;
  year: number;
};

const currentYear = new Date().getFullYear();

const SummaryCard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<MonthlyIncome[]>([]);
  const [allYearsArr, setAllYearsArr] = useState<number[]>([]);

  const fetchMonthlyData = (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    fetch(`http://localhost:5000/${endpoint}`)
      .then((res) => res.json())
      .then((data: any[]) => {
        setter(data);
        const years = data.map((item) => item.year);
        const uniqueYears = Array.from(new Set(years));
        setAllYearsArr(uniqueYears);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchMonthlyData('monthly-expense', setMonthlyExpenses);
    fetchMonthlyData('monthly-income', setMonthlyIncome);
  }, []);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const calculateSum = (items: any[], key: string) => {
    const filteredItems = items.filter((item) => item.year === selectedYear);
    if (filteredItems.length === 0) {
      return 0;
    }

    const sum = filteredItems.reduce(
      (accumulator, current) => accumulator + current[key],
      0
    );
  
    return sum;
  };

  return (
    <div className='summary-card'>
      <h1>
        Total balance in &nbsp;
        <select
          id='year-select'
          value={selectedYear}
          onChange={handleYearChange}
          className='year-select'
          data-testid='year-select'
        >
          {allYearsArr &&
            allYearsArr.map((year, i) => {
              return (
                <option key={i} value={year} className='year-option'>
                  {year}
                </option>
              );
            })}
        </select>
      </h1>
      <div className='detail-info'>
        <h2>Income</h2>
        <h2>Expense</h2>
      </div>
      <div className='detail-info'>
        <h2 data-testid='income-sum'>${calculateSum(monthlyIncome, 'sumIncome')}</h2>
        <h2 data-testid='expense-sum'>${calculateSum(monthlyExpenses, 'sumExpense')}</h2>
      </div>
    </div>
  );
};

export default SummaryCard;
