import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/config.js';
import {
  Form,
  Container,
  Button,
  Col,
  Row,
  Card,
  Spinner,
} from 'react-bootstrap';
import { CiSaveDown2 } from 'react-icons/ci';

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
            <Card>
              <Card.Header>
                <h3>Estado de Resultados</h3>
              </Card.Header>
              <Card.Body>
                <Row className='gx-2 gy-3 justify-content-center'>
                  {/* Año */}
                  <Col lg={3} md={4} sm={6} xs={12}>
                    <Form.Group controlId='formAnioSelect' className='mb-lg-0'>
                      <Form.Select
                        value={anio}
                        size='sm'
                        onChange={(e) => setAnio(e.target.value)}
                        disabled
                      >
                        {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* Mes */}
                  <Col lg={3} md={4} sm={6} xs={12}>
                    <Form.Group controlId='formMesSelect' className='mb-lg-0'>
                      <Form.Select
                        size='sm'
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                        disabled
                      >
                        <option value=''>Seleccione un mes</option>
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
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* Botón Descargar */}
                  <Col
                    lg={{ span: 3, offset: 0 }}
                    md={4}
                    sm={12}
                    xs={12}
                    className='d-flex justify-content-lg-start justify-content-center'
                  >
                    {isDownloading ? (
                      <>
                        <Button
                          size='sm'
                          className='button-custom-gradient'
                          disabled
                        >
                          <Spinner
                            as='span'
                            animation='grow'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />{' '}
                          Descargando...
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className='button-custom-gradient'
                          size='sm'
                          onClick={(e) => {
                            handleDownload(e);
                          }}
                          disabled={!axiosResponse || isDownloading}
                        >
                          <CiSaveDown2 className='mb-1' /> Descargar Reporte
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Form>
      </Container>
      {/*   {isLoading && <PlaneSpinner />}
          Activar cuando hagamos la llamada*/}
    </>
  );
}

export default EstadoResultados;
