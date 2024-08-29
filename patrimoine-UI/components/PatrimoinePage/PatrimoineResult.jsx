import React from 'react';

function PatrimoineResult({ patrimoineValue }) {
  return (
    <div className='calcResult'>
      <p>Patrimoine du possesseur : </p>
      <span className='text-succes'>{patrimoineValue.toFixed(2)} Ariary</span>
    </div>
  );
}

export default PatrimoineResult;
