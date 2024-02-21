import React, { useState, useEffect } from 'react';
import { Form, Container, Tabs, Tab, Button, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval.js';
import '../css/App.css';
import { CiSearch, CiSaveDown2 } from "react-icons/ci";
import SecondGridEval from '../charts/SecondGridEval.js';
import { pdTableHeadersAdministrativo, cobexcTableHeadersAdministrativo, gtosopTableHeadersAdministrativo, orvasTableHeadersAdministrativo } from '../charts/SecondGridEvalData.js'
import PlaneSpinner from '../components/planeSpinner.js';

const buttonsStyles = {
  primary: {
    width: '100%',
    backgroundColor: 'var(--amig-vivid-blue)',
    "&:hover": {
      backgroundColor: 'var(--amig-ligth-blue)',
    },
    whiteSpace: 'nowrap',
  },
  secondary: {
    width: '100%',
    backgroundColor: 'var(--amig-vivid-green)',
    "&:hover": {
      backgroundColor: 'var(--amig-ligth-green)',
    },
    whiteSpace: 'nowrap',
  },
}

const downloadExcel = async (e) => {
  e.preventDefault()
  console.log('Descargando...')
  try {
    const config = { responseType: 'blob' };

    const response = await axios.post(`${API_URL}/descargarExcel`, {}, config);

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nombreArchivo.xlsx');

    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('Termino')
  } catch (error) {
    console.error('Error al descargar el archivo: ', error);
    console.log('Fallo')
  }
}

const RamoAdministrativo = () => {
  const [anio, setAnio] = useState(2023);
  const [mes, setMes] = useState(6);
  // const [consultaEntrada, setConsultaEntrada] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setDownloadStatus] = useState(false);

  const [axiosResponse, setAxiosResponse] = useState();

  useEffect(() => {
    const asyncCall = async () => {
      const response = await axios.get(`${API_URL}/getReport`, {
        params: { anio: new Date().getFullYear(), mes: new Date().getMonth() + 1 }
      })
      setAxiosResponse(response)
      setIsLoading(false)
    }
    asyncCall()
  }, [])

  const handleDownload = (e) => {
    setDownloadStatus(true)
    downloadExcel(e, setDownloadStatus)
  }

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
          <Col>
            <Card className=''>
              <Card.Header><h3>Ramo Administrativas</h3></Card.Header>
              <Row style={{ display: "grid", gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '0 25px' }}>
                <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Form.Group controlId='formAnioSelect'>
                    <Form.Control
                      as='select'
                      value={anio}
                      onChange={(e) => setAnio(e.target.value)}
                      className='mt-4 mb-3'
                      disabled
                    >
                      {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Form.Group controlId='formMesSelect'>
                    <Form.Control
                      as='select'
                      className='mt-4 mb-3'
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
                      disabled
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
                <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button className='mt-4 mb-3' variant='secondary' size='md' type='submit' style={buttonsStyles.primary}>
                    <CiSearch className='mb-1' /> Buscar
                  </Button>
                </Col>
                <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Button className='mt-4 mb-3' variant='secondary' size='md' type='submit' style={buttonsStyles.secondary} onClick={(e) => { handleDownload(e) }} disabled={!axiosResponse || isDownloading}>
                    {isDownloading ? <div style={{ position: 'absolute', top: '-10px' }}><PlaneSpinner /></div> : <CiSaveDown2 className='mb-1' />} Descargar reporte
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
            <Tab eventKey='pd' title={<span style={{ fontWeight: 600, color: '#002248' }}>PD</span>} style={{ fontWeight: 600 }}>
              <SecondGridEval headers={pdTableHeadersAdministrativo} data={axiosResponse && axiosResponse.data[0]} />
            </Tab>
            <Tab eventKey='cobexc' title={<span style={{ fontWeight: 600, color: '#002248' }}>COB_EXC</span>} style={{ fontWeight: 600 }}>
              <SecondGridEval headers={cobexcTableHeadersAdministrativo} data={axiosResponse && axiosResponse.data[1]} />
            </Tab>
            <Tab eventKey='gtosop' title={<span style={{ fontWeight: 600, color: '#002248' }}>GTOSOP</span>} style={{ fontWeight: 600 }}>
              <SecondGridEval headers={gtosopTableHeadersAdministrativo} data={axiosResponse && axiosResponse.data[2]} />
            </Tab>
            <Tab eventKey='orvas' title={<span style={{ fontWeight: 600, color: '#002248' }}>ORVAS</span>} style={{ fontWeight: 600 }}>
              <SecondGridEval headers={orvasTableHeadersAdministrativo} data={axiosResponse && axiosResponse.data[3]} />
            </Tab>
          </Tabs>
        </Form>
        {/* {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <div>{JSON.stringify(consultaEntrada)}</div>
        )} */}
      </Container>
      {isLoading && <PlaneSpinner />}
    </>
  );
};

export default RamoAdministrativo;
