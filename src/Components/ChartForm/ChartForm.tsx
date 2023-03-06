import React, {ReactNode} from 'react';

import './ChartForm.modules.scss';

type ChartFormProps = {
  actionHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  setCost: React.Dispatch<React.SetStateAction<number | string>>;
  header: string;
  cost: number | string;
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
      <form onSubmit={actionHandler}>
        <label htmlFor='cost'>Cost:</label>
        <input
          type='number'
          id='cost'
          required
          min='1'
          value={cost}
          onChange={(e) => setCost(e.target.valueAsNumber)}
        ></input>
        <label htmlFor='category'>Category:</label>
        {children}
      </form>
    </div>
  );
};

export default ChartForm;
