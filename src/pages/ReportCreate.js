import React, { useState, useEffect } from 'react';
import { Form, Container } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config/config.js';

const ReportCreate = () => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [consultaEntrada, setConsultaEntrada] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

{/* 
  const getCmerData = async () => {
    try {
      setIsLoading(true); 
      const response = await axios.get(`${API_URL}/getData`, {
        params: { anio, mes }
      });
      setConsultaEntrada(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Security Message',
          text: 'Token expire, please login again',
        });
      } else {
        console.error(err);
        Swal.fire('Ooops', 'Unable to get data', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCmerData();
  }, [anio, mes]);
*/}
  return (
    <>
        <Container className='container-custom'> 
        <h2>Generador de Reporte </h2>
      <Form>
        <Form.Group controlId="formAnioSelect">
          <Form.Label>Año</Form.Label>
          <Form.Control as="select" value={anio} onChange={(e) => setAnio(e.target.value)}>
            {[2022, 2023, 2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formMesSelect">
          <Form.Label>Mes</Form.Label>
          <Form.Control as="select" value={mes} onChange={(e) => setMes(e.target.value)}>
            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      {isLoading ? <p>Cargando...</p> : <div>{JSON.stringify(consultaEntrada)}</div>}
    </Container>
    </>
  );
};

export default ReportCreate;
