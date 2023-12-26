import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../css/App.css';

function PlaneSpinner() {
  return (
    <div className='spinner-consolidate spinner-principal d-flex justify-content-center align-items-center vh-50'>
      <Spinner  animation='border' variant='primary' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
}

export default PlaneSpinner;