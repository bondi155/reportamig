import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/config.js';
import { Form, Container, Button, Col, Row, Card } from 'react-bootstrap';
import PlaneSpinner from '../components/planeSpinner.js';
import {CiSaveDown2 } from "react-icons/ci";

const buttonsStyles = {
    primary: {
      width: '100%',
      backgroundColor: 'var(--amig-vivid-blue)',
      "&:hover": {
        backgroundColor: 'var(--amig-ligth-blue)',
      },
    },
    secondary: {
      width: '100%',
      backgroundColor: 'var(--amig-vivid-green)',
      "&:hover": {
        backgroundColor: 'var(--amig-ligth-green)',
      }
    },
  }

function EstadoResultados() {
  const [anio, setAnio] = useState(2023);
  const [mes, setMes] = useState(6);
  const [isDownloading, setDownloadStatus] = useState(false);
  const [axiosResponse, setAxiosResponse] = useState([]);
  //const [isLoading, setIsLoading] = useState(true);

  /* Llamar en el futuro con un grid diferente 
  useEffect(() => {
    const asyncCall = async () => {
      try {
        const response = await axios.get(`${API_URL}/getReport`, {
          params: { id_arch: 5, anio, mes },
        });
        console.log(response);
        setAxiosResponse(response);
      } catch (error) {
        console.log('error en traer la infromación Estado Resultados', error);
      }

      setIsLoading(false);
    };
    asyncCall();
  }, [anio, mes]);
*/
  const downloadExcel = async (e, setDownloadStatus, anio, mes) => {
    e.preventDefault();
    setDownloadStatus(true);
    console.log('Descargando...');
    try {
      const config = {
        responseType: 'blob',
        params: { id_arch: 5, anio, mes },
      };

      const response = await axios.post(
        `${API_URL}/descargarExcel`,
        {},
        config
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estado_resultado_${anio}_${mes}.xlsx`);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('Termino');
      setDownloadStatus(false);
    } catch (error) {
      console.error('Error al descargar el archivo: ', error);
      console.log('Fallo');
      setDownloadStatus(false);
    }
  };

  const handleDownload = (e) => downloadExcel(e, setDownloadStatus, anio, mes);

  return (
    <>
   <Container className='container-custom'>
        <Form>
          <Col>
            <Card className=''>
              <Card.Header><h3>Total</h3></Card.Header>
              <Row style={{ display: "grid", gridTemplateColumns: '2fr 2fr 1fr', padding: '0 25px' }}>
                <Col>
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
                <Col>
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
                {/* <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Button className='mt-4 mb-3' variant='secondary' size='md' type='submit' style={buttonsStyles.primary} disabled={isLoading}>
                    <CiSearch className='mb-1' /> Buscar
                  </Button>
                </Col> */}
                <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Button className='mt-4 mb-3' variant='secondary' size='md' type='submit' style={buttonsStyles.secondary} onClick={(e) => { handleDownload(e) }} disabled={!axiosResponse || isDownloading}>
                    {isDownloading ? <><div style={{ position: 'absolute', top: '-10px' }}><PlaneSpinner /></div> Descargando reporte</> : <><CiSaveDown2 className='mb-1' /> Descargar reporte</>}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Form>
        </Container>
          { /*   {isLoading && <PlaneSpinner />}
          Activar cuando hagamos la llamada*/}   
             </>

   );
  
}

export default EstadoResultados;
