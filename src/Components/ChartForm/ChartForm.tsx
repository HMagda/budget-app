import React, {ReactNode} from 'react';

import './ChartForm.modules.scss';

type ChartFormProps = {
  actionHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  setCost: React.Dispatch<React.SetStateAction<number | null>>;
  header: string;
  cost: number | null;
  children: ReactNode;
};

const ChartForm: React.FC<ChartFormProps> = ({
  actionHandler,
  setCost,
  header,
  cost,
  children,
}) => {
  return (
    <div className='chart-form-container'>
      <h2>{header}</h2>
      <form onSubmit={actionHandler} data-testid="chart-form">
        <label htmlFor='cost'>Cost:</label>
        <input
          type='number'
          id='cost'
          required
          min='1'
          step='0.01'
          value={cost || ''}
          onChange={(e) => setCost(parseFloat(e.target.value))}
          placeholder="e.g. 10.99"
        ></input>
        <label htmlFor='category'>Category:</label>
        {children}
      </form>
    </div>
  );
};

export default ChartForm;
