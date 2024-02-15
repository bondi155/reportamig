import React, { useState, useEffect } from 'react';
import { Form, Container, Tabs, Tab, Button, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval.js';
import '../css/App.css';
import { CiSearch, CiSaveDown2 } from "react-icons/ci";
import SecondGridEval from '../charts/SecondGridEval.js';
import { pdTableHeaders, cobexcTableHeaders, gtosopTableHeaders, orvasTableHeaders } from '../charts/SecondGridEvalData.js'

function CustomGroupHeader({ headerName }) {
  return <div style={{ fontWeight: 'bold', width: '100%' }}>{headerName}</div>;
}


const RamoAdministrativo = () => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [consultaEntrada, setConsultaEntrada] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [axiosResponse, setAxiosResponse] = useState();

  useEffect(() => {
    const asyncCall = async () => {
      const response = await axios.get(`${API_URL}/getReport`, {
        params: { anio: new Date().getFullYear(), mes: new Date().getMonth() + 1 }
      })
      setAxiosResponse(response)
    }
    asyncCall()
  }, [])

  // const getResponse = async () => {
  //   const response = await axios.get(`${API_URL}/getReport`, {
  //     params: { anio, mes }
  //   })
  //   return response
  // }

  // const response = getResponse();

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
        <Form>
          <Col lg={{ span: 10, offset: 1 }}>
            <Card className=''>
              <Card.Header><h3>Ramo Administrativas (Periodos)</h3></Card.Header>
              <Row>
                <Col lg={{ span: 3, offset: 2 }}>
                  <Form.Group controlId='formAnioSelect'>
                    <Form.Control
                      as='select'
                      value={anio}
                      onChange={(e) => setAnio(e.target.value)}
                      className='mt-4 mb-1'
                    >
                      {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col lg={{ span: 3, offset: 0 }}>
                  <Form.Group controlId='formMesSelect'>
                    <Form.Control
                      as='select'
                      className='mt-4 mb-5'
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
                </Col>
                <Col>
                  <Button className='mt-4 mb-3' variant='secondary' size='md' type='submit'>
                    <CiSearch className='mb-1' /> Buscar
                  </Button>
                </Col>
                <Col lg={2}>
                  <Button className='mt-4 mb-3' variant='secondary' size='md' type='submit'>
                    <CiSaveDown2 className='mb-1' /> Descargar
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Form>
        <Form className='mb-3 mt-5'>
          <Tabs
            defaultActiveKey='pd'
            id='fill-tab-example'
            className='mb-0 mt-5'
            fill
            style={{ padding: '0 !important' }}
          >
            <Tab eventKey='pd' title='PD'>
              <SecondGridEval headers={pdTableHeaders} data={axiosResponse && axiosResponse.data[0]} />
            </Tab>
            <Tab eventKey='cobexc' title='COB_EXC'>
              <SecondGridEval headers={cobexcTableHeaders} data={axiosResponse && axiosResponse.data[1]} />
            </Tab>
            <Tab eventKey='gtosop' title='GTOSOP'>
              <SecondGridEval headers={gtosopTableHeaders} data={axiosResponse && axiosResponse.data[2]} />
            </Tab>
            <Tab eventKey='orvas' title='ORVAS'>
              <SecondGridEval headers={orvasTableHeaders} data={axiosResponse && axiosResponse.data[3]} />
            </Tab>
          </Tabs>
        </Form>

        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <div>{JSON.stringify(consultaEntrada)}</div>
        )}
      </Container>
    </>
  );
};

export default RamoAdministrativo;
