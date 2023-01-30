import React from 'react';
import './SummaryCard.modules.scss';

const SummaryCard = () => {
  return (
    <div className='summary-card'>
      <h1>Total balance</h1>

      <div className='detail-info'>
        <h2>Income</h2>
        <h2>Expense</h2>
      </div>
    </div>
  );
};

export default SummaryCard;
