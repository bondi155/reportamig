import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/config.js';
import {
  Form,
  Container,
  Col,
  Row,
  Card,
  Spinner,
} from 'react-bootstrap';
import { Button } from '@mui/material';
import { CiSaveDown2 } from 'react-icons/ci';
import MesAnioSelector from '../components/MesAnioSelector.js';

function EstadoFinanciero() {
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
        params: { id_arch: 10, anio, mes },
      };

      const response = await axios.post(
        `${API_URL}/descargarExcel`,
        {},
        config
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estado_financ_${anio}_${mes}.xlsx`);

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
  const handleConfirmarSeleccion = ({ anio, mes }) => {
    setAnio(anio);
    setMes(mes);
    // Llama a la función para actualizar el estado o realizar acciones del datepiker
  };


  const handleDownload = (e) => downloadExcel(e, setDownloadStatus, anio, mes);

  return (
    <>
     <Container className='container-custom'>
        <Form>
          <Row className='justify-content-center'>
            <Col lg={8} md={12}>
              <Card>
                <Card.Header>
                  <h3>Estado de Situación Financiera</h3>
                </Card.Header>
                <Card.Body>
                  <Row className='justify-content-center'>
                    <Col lg={{ span: 5, offset: 1 }} md={6} sm={6} xs={12}>
                      <MesAnioSelector
                        anioInicial={anio}
                        mesInicial={mes}
                        onFechaCambio={handleConfirmarSeleccion}
                      />
                    </Col>
                    {/* Botón Descargar  */}
                    <Col
                      lg={3}
                      md={3}
                      sm={12}
                      xs={12}
                      className='d-flex justify-content-lg-start mt-4 mt-lg-0 mt-md-0 justify-content-center'
                    >
                      {isDownloading ? (
                        <Button
                          size='small'
                          color='primary'
                          endIcon={<CiSaveDown2 />}
                          disabled
                        >
                          <Spinner
                            as='span'
                            animation='grow'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        </Button>
                      ) : (
                        <Button
                          size='small'
                          endIcon={<CiSaveDown2 />}
                          color='primary'
                          onClick={(e) => {
                            handleDownload(e);
                          }}
                          disabled={!axiosResponse || isDownloading}
                        >
                          Descargar
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
      {/*   {isLoading && <PlaneSpinner />}
          Activar cuando hagamos la llamada*/}
    </>
  );
}

export default EstadoFinanciero;
