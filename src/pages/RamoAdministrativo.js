import React, { useState, useEffect } from 'react';
import { Form, Container, Button, Col, Row, Card } from 'react-bootstrap';
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
const downloadExcel = async (e, setDownloadStatus, anio, mes) => {
  e.preventDefault();
  setDownloadStatus(true);
  console.log('Descargando...');
  try {
    const config = { responseType: 'blob', params: { id_arch: 3, anio, mes } };

    const response = await axios.post(`${API_URL}/descargarExcel`, {}, config);

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ramo_adm${anio}_${mes}.xlsx`);

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

const ReporteTotal = () => {
  const [anio, setAnio] = useState(2023);
  const [mes, setMes] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setDownloadStatus] = useState(false);
  const [axiosResponse, setAxiosResponse] = useState([]);

  const [valueTab, setValueTab] = useState('pd');

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const theme = useTheme();

  const scrollableTabs = useMediaQuery(theme.breakpoints.down('lg'));
  // Transformar  'detalle' array en row objects para que el data grid lo tome
  const transformDetalleToRows = (detalle) => {
    return detalle.map((row) => {
      // Reduce cada row de detalle en un single object
      const rowObj = row.reduce((acc, cell, index) => {
        acc[`col${index + 1}`] = Object.values(cell)[0];
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
          params: { id_arch: 3, anio, mes },
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
  }, [anio, mes]);

  const handleDownload = (e) => downloadExcel(e, setDownloadStatus, anio, mes);

  return (
    <>
      <Container className='container-custom'>
        <Form>
          <Col>
            <Card>
              <Card.Header>
                <h3>Ramo Administrativas</h3>
              </Card.Header>
              <Card.Body>
                <Row className='gx-2 gy-3 justify-content-center'>
                  {/* Año */}
                  <Col lg={{ span: 3, offset: 2 }} md={4} sm={6} xs={12}>
                    <Form.Group controlId='formAnioSelect' className='mb-lg-0'>
                      <Form.Select
                        size='sm'
                        value={anio}
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
                    lg={3}
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
                columnsVar={columnasPD}
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
                columnsVar={columnas_COB_EXC_admins}
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
                columnsVar={columnasGTOSOP}
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
                columnsVar={columnasORVAS}
                fileNameVar='ORVAS'
                autoHeight
                columnGroupingModel={ColumnaGrupoORVAS}
              />
            </Box>
          )}
      </Box>
      {isLoading && <PlaneSpinner />}
    </>
  );
};

export default ReporteTotal;

/* 



//tabs con boostrap :  


  <Tabs
          defaultActiveKey='pd'
          id='fill-tab-example'
          className='mb-0 mt-5'
          fill
          style={{ padding: '0 !important' }}
        >
          <Tab
            eventKey='pd'
            title={<span>PD</span>}
            style={{ fontWeight: 600 }}
          >
            <div className='mt-4 mb-2'>
              {axiosResponse[0] && axiosResponse[0].length > 0 && (
                <GridEval
                  rows={axiosResponse[0]}
                  columnsVar={columnasPD}
                  fileNameVar='PD'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoPd}
                />
              )}
            </div>
          </Tab>
          <Tab
            eventKey='cobexc'
            title={<span>COB_EXC</span>}
            style={{ fontWeight: 600 }}
          >
            <div className='mt-4 mb-2'>
              {axiosResponse[1] && axiosResponse[1].length > 0 && (
                <GridEval
                  rows={axiosResponse[1]}
                  columnsVar={columnas_COB_EXC_admins}
                  fileNameVar='COB_EXC'
                  autoHeight
                  columnGroupingModel={ColumnaGrupo_COB_EXC_admins}
                />
              )}
            </div>
          </Tab>
          <Tab
            eventKey='gtosop'
            title={<span>GTOSOP</span>}
            style={{ fontWeight: 600 }}
          >
            <div className='mt-4 mb-2'>
              {axiosResponse[2] && axiosResponse[2].length > 0 && (
                <GridEval
                  rows={axiosResponse[2]}
                  columnsVar={columnasGTOSOP}
                  fileNameVar='GTOSOP'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoGTOSOP}
                />
              )}
            </div>
          </Tab>
          <Tab
            eventKey='orvas'
            title={<span>ORVAS</span>}
            style={{ fontWeight: 600 }}
          >
            <div className='mt-4 mb-2'>
              {axiosResponse[3] && axiosResponse[3].length > 0 && (
                <GridEval
                  rows={axiosResponse[3]}
                  columnsVar={columnasORVAS}
                  fileNameVar='ORVAS'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoORVAS}
                />
              )}
            </div>
          </Tab>
        </Tabs>

///
        <Form className='mb-3 mt-5'>
          <Tabs
            defaultActiveKey='pd'
            id='fill-tab-example'
            className='mb-0 mt-5'
            fill
            style={{ padding: '0 !important' }}
            activeKey={tabKey}
            onSelect={(k) => k && setTabKey(k)}
          >
            <Tab
              eventKey='pd'
              title={
                <span className={tabKey === 'pd' ? 'active' : 'inactive'}>
                  PD
                </span>
              }
              style={{ fontWeight: 600 }}
            >
              <SecondGridEval
                headers={pdTableHeadersTotal}
                data={
                  axiosResponse && axiosResponse.data && axiosResponse.data[0]
                }
              />
            </Tab>
            <Tab
              eventKey='cobexc'
              title={
                <span className={tabKey === 'cobexc' ? 'active' : 'inactive'}>
                  COB_EXC
                </span>
              }
              style={{ fontWeight: 600 }}
            >
              <SecondGridEval
                headers={cobexcTableHeadersTotal}
                data={
                  axiosResponse && axiosResponse.data && axiosResponse.data[1]
                }
              />
            </Tab>
            <Tab
              eventKey='gtosop'
              title={
                <span className={tabKey === 'gtosop' ? 'active' : 'inactive'}>
                  GTOSOP
                </span>
              }
              style={{ fontWeight: 600 }}
            >
              <SecondGridEval
                headers={gtosopTableHeadersTotal}
                data={
                  axiosResponse && axiosResponse.data && axiosResponse.data[2]
                }
              />
            </Tab>
            <Tab
              eventKey='orvas'
              title={
                <span className={tabKey === 'orvas' ? 'active' : 'inactive'}>
                  ORVAS
                </span>
              }
              style={{ fontWeight: 600 }}
            >
              <SecondGridEval
                headers={orvasTableHeadersTotal}
                data={
                  axiosResponse && axiosResponse.data && axiosResponse.data[3]
                }
              />
            </Tab>
            <Tab
              eventKey='indgestion'
              title={
                <span
                  className={tabKey === 'indgestion' ? 'active' : 'inactive'}
                >
                  IND.GESTION
                </span>
              }
              style={{ fontWeight: 600 }}
            >
              <SecondGridEval
                headers={indGestionHeadersTotal}
                data={
                  axiosResponse && axiosResponse.data && axiosResponse.data[4]
                }
              />
            </Tab>
            <Tab
              eventKey='roe'
              title={
                <span className={tabKey === 'roe' ? 'active' : 'inactive'}>
                  ROE
                </span>
              }
              style={{ fontWeight: 600 }}
            >
              <SecondGridEval
                headers={roeHeadersTotal}
                data={
                  axiosResponse && axiosResponse.data && axiosResponse.data[5]
                }
              />
            </Tab>
          </Tabs>
        </Form>
        */
