import React from 'react';
import { HashLoader } from 'react-spinners';
import './spinner.scss';

const Spinner = ({ size }) => {
  return (
    <div className='spinner-container'>
      <HashLoader className='spinner' color='#2138e9' size={size} />
    </div>
  );
};

export default Spinner;
