import React, { useState, useEffect } from 'react';
import { Form, Container, Tabs, Tab, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval.js';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'posicion',
    headerName: 'Posición',
    width: 150,
  },
  {
    field: 'compañia',
    headerName: 'Compañia',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 120 },
  { id: 6, lastName: 'Melisandre', firstName: 'CACAO', age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const columnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'Basic info',
    children: [
      {
        groupId: 'Full name',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

const ReportCreate = () => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [consultaEntrada, setConsultaEntrada] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  {
    /* 
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
*/
  }
  return (
    <>
      <Container className='container-custom'>
        <h2>Generador de Reporte </h2>
        <Form>
          <Form.Group controlId='formAnioSelect'>
            <Form.Label>Año</Form.Label>
            <Form.Control
              as='select'
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
            >
              {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='formMesSelect'>
            <Form.Label>Mes</Form.Label>
            <Form.Control
              as='select'
              value={mes}
              onChange={(e) => setMes(e.target.value)}
            >
              {[
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
              ].map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant='outline-secondary' type='submit'>
            Aceptar
          </Button>
        </Form>
        <Tabs
          defaultActiveKey='profile'
          id='fill-tab-example'
          className='mb-3 mt-5'
          fill
        >
          <Tab eventKey='pd' title='PD'>
            <GridEval
              rows={rows}
              columnsVar={columns}
              checkboxSelection
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModel}
            />
          </Tab>
          <Tab eventKey='cobexc' title='COB_EXC'>
            Tab content for Profile
          </Tab>
          <Tab eventKey='gtosop' title='GTOSOP'>
            Tab content for Loooonger Tab
          </Tab>
          <Tab eventKey='orvas' title='ORVAS'>
            Tab content for Contact
          </Tab>
          <Tab eventKey='indgestion' title='IND.GESTION'>
            Tab content for Contact
          </Tab>
          <Tab eventKey='roe' title='ROE'>
            Tab content for Contact
          </Tab>
        </Tabs>

        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <div>{JSON.stringify(consultaEntrada)}</div>
        )}
      </Container>
    </>
  );
};

export default ReportCreate;
