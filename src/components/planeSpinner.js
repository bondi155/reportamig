import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../css/App.css';

function PlaneSpinner({ size = "lg" }) {
  return (
    <div className='spinner-consolidate spinner-principal d-flex justify-content-center align-items-center vh-50'>
      <Spinner animation="grow" size={size} variant="secondary" role='status'>
        <span className='visually-hidden'>Cargando...</span>
      </Spinner>
    </div>
  );
}

export default PlaneSpinner;