import React, { useState, useEffect } from 'react';
import { Form, Container, Col, Row, Card } from 'react-bootstrap';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval.js';
import '../css/App.css';
import { CiSaveDown2 } from 'react-icons/ci';
import {
  columnasPD,
  ColumnaGrupoPd,
  columnas_COB_EXC_admins,
  ColumnaGrupo_COB_EXC_admins,
  columnasGTOSOP,
  ColumnaGrupoGTOSOP,
  columnasORVAS,
  ColumnaGrupoORVAS,
} from '../charts/ColumnsGrids.js';
import PlaneSpinner from '../components/planeSpinner.js';
import Spinner from 'react-bootstrap/Spinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MesAnioSelector from './MesAnioSelector.js';

const ModeloRamos = ({ id_arch, NombreArchivo, titulo }) => {
  const [anio, setAnio] = useState(2023);
  const [mes, setMes] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setDownloadStatus] = useState(false);
  const [axiosResponse, setAxiosResponse] = useState([]);
  const [valueTab, setValueTab] = useState('pd');

  const downloadExcel = async (e, setDownloadStatus, anio, mes) => {
    e.preventDefault();
    setDownloadStatus(true);
    console.log('Descargando...');
    try {
      const config = { responseType: 'blob', params: { id_arch, anio, mes } };

      const response = await axios.post(
        `${API_URL}/descargarExcel`,
        {},
        config
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${NombreArchivo}${anio}_${mes}.xlsx`);

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

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleConfirmarSeleccion = ({ anio, mes }) => {
    setAnio(anio);
    setMes(mes);
    // Llama a la función para actualizar el estado o realizar acciones del datepiker
  };

  const theme = useTheme();

  const scrollableTabs = useMediaQuery(theme.breakpoints.down('lg'));

  const transformDetalleToRows = (detalle) => {
    return detalle.map((row, index) => {
      // Cada 'row' es un array de objetos(osea se dividen en 17 por tab) y cada objeto tiene una sola propiedad
      const rowObj = row.reduce((acc, cell, cellIndex) => {
        // Para la primera celda osea col1 de fila, se asigna un ID único basado en el índice de la fila
        if (cellIndex === 0) {
          acc['id'] = `${index + 1}`; // Asegurarse de que el ID sea un string
        }
        // La clave de cada celda se convierte en `col${cellIndex + 1}` para mantener la consistencia con la estructura que tenemos
        const cellKey = `col${cellIndex + 1}`;
        acc[cellKey] = Object.values(cell)[0];
        return acc;
      }, {});

      return rowObj;
    });
  };

  useEffect(() => {
    const asyncCall = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/getReport`, {
          params: { id_arch, anio, mes },
        });

        // mapear sobre la response data para transformarla cada una en 'detalle' en row objects
        const allTransformedRows = response.data.map((item) =>
          transformDetalleToRows(item.detalle)
        );
        // Update state
        setAxiosResponse(allTransformedRows);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.toString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    asyncCall();
  }, [anio, mes, id_arch]);

  const handleDownload = (e) => downloadExcel(e, setDownloadStatus, anio, mes);

  // Columnas con variable anio
  const columnas_COB_EXC_adminsAnio = columnas_COB_EXC_admins(anio);
  const columnasPDAnio = columnasPD(anio);
  const columnasGTOSOPAnio = columnasGTOSOP(anio);
  const columnasORVASAnio = columnasORVAS(anio);

  return (
    <>
      <Container className='container-custom'>
        <Form>
          <Row className='justify-content-center'>
            <Col lg={8} md={12}>
              <Card>
                <Card.Header>
                  <h3>{titulo}</h3>
                </Card.Header>
                <Card.Body>
                  <Row className='justify-content-center'>
                    <Col lg={{ span: 5, offset:1 }} md={6} sm={6} xs={12}>
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
                        <Button size='small' color="primary" endIcon={<CiSaveDown2 />}
                        disabled>
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
                          color="primary"
                          onClick={(e) => {
                            handleDownload(e);
                          }}
                          disabled={!axiosResponse || isDownloading}
                        >Descargar
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
      {isLoading ? (
        <PlaneSpinner />
      ) : (
        <Box
          sx={{
            maxWidth: '95%',
            mt: '6rem',
            width: '100%',
            mx: 'auto', // Centra el Box de mui como lo hace un contenedor Bootstrap
          }}
        >
          <Tabs
            value={valueTab}
            variant={scrollableTabs ? 'scrollable' : 'fullWidth'}
            scrollButtons
            allowScrollButtonsMobile
            onChange={handleChange}
            sx={{
              '.MuiTabs-flexContainer': {
                justifyContent: 'space-around',
              },
            }}
          >
            <Tab label='PD' value='pd' sx={{ marginX: 2 }} />
            <Tab label='COB_EXC' value='cobexc' />
            <Tab label='GTOSOP' value='gtosop' />
            <Tab label='ORVAS' value='orvas' />
          </Tabs>
          {valueTab === 'pd' &&
            axiosResponse[0] &&
            axiosResponse[0].length > 0 && (
              <Box className='mt-4 mb-2'>
                <GridEval
                  rows={axiosResponse[0]}
                  columnsVar={columnasPDAnio}
                  fileNameVar='PD'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoPd}
                />
              </Box>
            )}
          {valueTab === 'cobexc' &&
            axiosResponse[1] &&
            axiosResponse[1].length > 0 && (
              <Box className='mt-4 mb-2'>
                <GridEval
                  rows={axiosResponse[1]}
                  columnsVar={columnas_COB_EXC_adminsAnio}
                  fileNameVar='COB_EXC'
                  autoHeight
                  columnGroupingModel={ColumnaGrupo_COB_EXC_admins}
                />
              </Box>
            )}
          {valueTab === 'gtosop' &&
            axiosResponse[2] &&
            axiosResponse[2].length > 0 && (
              <Box className='mt-4 mb-2'>
                <GridEval
                  rows={axiosResponse[2]}
                  columnsVar={columnasGTOSOPAnio}
                  fileNameVar='GTOSOP'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoGTOSOP}
                />
              </Box>
            )}
          {valueTab === 'orvas' &&
            axiosResponse[3] &&
            axiosResponse[3].length > 0 && (
              <Box className='mt-4 mb-2'>
                <GridEval
                  rows={axiosResponse[3]}
                  columnsVar={columnasORVASAnio}
                  fileNameVar='ORVAS'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoORVAS}
                />
              </Box>
            )}
        </Box>
      )}
    </>
  );
};

export default ModeloRamos;
