import React from 'react';
import './ChartForm.modules.scss';

const ChartForm = ({actionHandler, setCost, header, cost, children}) => {
  return (
    <div className='chart-form-container'>
      <h2>{header}</h2>
      <form onSubmit={actionHandler}>
        <label htmlFor='cost'>Cost:</label>
        <input
          type='number'
          id='cost'
          required
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        ></input>
        <label htmlFor='category'>Category:</label>
        {children}
      </form>
    </div>
  );
};

export default ChartForm;
