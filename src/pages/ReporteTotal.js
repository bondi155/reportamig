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
  columnasCOB_EXC,
  ColumnaGrupoCOB_EXC,
  columnasGTOSOP,
  ColumnaGrupoGTOSOP,
  columnasORVAS,
  ColumnaGrupoORVAS,
  columnasINDGESTION,
  ColumnaGrupoINDGESTION,
  columnasROE,
  ColumnaGrupoROE,
} from '../charts/ColumnsGrids.js';
import PlaneSpinner from '../components/planeSpinner.js';
import Spinner from 'react-bootstrap/Spinner';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/*
const rows = [
  // Aquí van los datos de las filas. Por ejemplo:
  {
    col1: 1,
    posicion: 1,
    empresa: 'Empresa 1',
    // Valores para "Prima directa"
    PrimaDirectaImporte2023: 0,
    PrimaDirectaImporte2022: 0,
    PrimaDirectaImporteIncremento: 0,
    PrimaDirectaPorcentajeIncremento: 0,
    // Valores para "Prima tomada"
    PrimaTomadaImporte: 0,
    PrimaTomadaPorcentaje2023: 0,
    PrimaTomadaPorcentaje2022: 0,
    // Valores para "Prima cedida"
    PrimaCedidaImporte: 0,
    PrimaCedidaPorcentaje2023: 0,
    PrimaCedidaPorcentaje2022: 0,
    // Valores para "Prima retenida"
    PrimaRetenidaImporte: 0,
    PrimaRetenidaPorcentaje2023: 0,
    PrimaRetenidaPorcentaje2022: 0,
    // ... Resto de los datos...
    IncRvaRiesgoImporte: 0,
  },
  {
    col1: 2,
    posicion: 2,
    empresa: 'Empresa 2',
    // Valores para "Prima directa"
    PrimaDirectaImporte2023: 0,
    PrimaDirectaImporte2022: 0,
    PrimaDirectaImporteIncremento: 0,
    PrimaDirectaPorcentajeIncremento: 0,
    // Valores para "Prima tomada"
    PrimaTomadaImporte: 0,
    PrimaTomadaPorcentaje2023: 0,
    PrimaTomadaPorcentaje2022: 0,
    // Valores para "Prima cedida"
    PrimaCedidaImporte: 0,
    PrimaCedidaPorcentaje2023: 0,
    PrimaCedidaPorcentaje2022: 0,
    // Valores para "Prima retenida"
    PrimaRetenidaImporte: 0,
    PrimaRetenidaPorcentaje2023: 0,
    PrimaRetenidaPorcentaje2022: 0,
    // ... Resto de los datos...
  },
  {
    col1: 3,
    posicion: 3,
    empresa: 'Empresa 3',
    // Valores para "Prima directa"
    PrimaDirectaImporte2023: 0,
    PrimaDirectaImporte2022: 0,
    PrimaDirectaImporteIncremento: 0,
    PrimaDirectaPorcentajeIncremento: 0,
    // Valores para "Prima tomada"
    PrimaTomadaImporte: 0,
    PrimaTomadaPorcentaje2023: 0,
    PrimaTomadaPorcentaje2022: 0,
    // Valores para "Prima cedida"
    PrimaCedidaImporte: 0,
    PrimaCedidaPorcentaje2023: 0,
    PrimaCedidaPorcentaje2022: 0,
    // Valores para "Prima retenida"
    PrimaRetenidaImporte: 0,
    PrimaRetenidaPorcentaje2023: 0,
    PrimaRetenidaPorcentaje2022: 0,
    // ... Resto de los datos...
  },
  {
    col1: 4,
    posicion: 4,
    empresa: 'Empresa 4',
    // Valores para "Prima directa"
    PrimaDirectaImporte2023: 0,
    PrimaDirectaImporte2022: 0,
    PrimaDirectaImporteIncremento: 0,
    PrimaDirectaPorcentajeIncremento: 0,
    // Valores para "Prima tomada"
    PrimaTomadaImporte: 0,
    PrimaTomadaPorcentaje2023: 0,
    PrimaTomadaPorcentaje2022: 0,
    // Valores para "Prima cedida"
    PrimaCedidaImporte: 0,
    PrimaCedidaPorcentaje2023: 0,
    PrimaCedidaPorcentaje2022: 0,
    // Valores para "Prima retenida"
    PrimaRetenidaImporte: 0,
    PrimaRetenidaPorcentaje2023: 0,
    PrimaRetenidaPorcentaje2022: 0,
    // ... Resto de los datos...
  },
  // ... más filas ...
];*/
const downloadExcel = async (e, setDownloadStatus, anio, mes) => {
  e.preventDefault();
  setDownloadStatus(true);
  console.log('Descargando...');
  try {
    const config = { responseType: 'blob', params: { id_arch: 4, anio, mes } };

    const response = await axios.post(`${API_URL}/descargarExcel`, {}, config);

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `total_${anio}_${mes}.xlsx`);

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
          params: { id_arch: 4, anio, mes },
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
          <Row className='justify-content-center'>
          <Col lg={10}>
            <Card>
              <Card.Header>
                <h3>Total</h3>
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
                  <Col lg={{ span: 3, offset: 0 }} md={4} sm={6} xs={12}>
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
          </Row>
        </Form>
      </Container>
      <Box
        sx={{
          maxWidth: '95%',
          mt: '6rem',
          width: '100%',
          mx: 'auto',
        }}
      >
        <Tabs
          value={valueTab}
          onChange={handleChange}
          variant={scrollableTabs ? 'scrollable' : 'fullWidth'}
          scrollButtons='auto'
          allowScrollButtonsMobile
          sx={{
            '.MuiTabs-scroller': {
              flexGrow: '0',
            },
            '.MuiTab-root': {
              minWidth: 0,
              padding: '6px 12px',
            },
          }}
        >
          <Tab label='PD' value='pd' />
          <Tab label='COB_EXC' value='cobexc' />
          <Tab label='GTOSOP' value='gtosop' />
          <Tab label='ORVAS' value='orvas' />
          <Tab label='IND. GESTION' value='indGestion' />
          <Tab label='ROE' value='roe' />
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
                columnsVar={columnasCOB_EXC}
                fileNameVar='COB_EXC'
                columnGroupingModel={ColumnaGrupoCOB_EXC}
              />
            </Box>
          )}
        {valueTab === 'gtosop' &&
          axiosResponse[2] &&
          axiosResponse[2].length > 0 && (
            <Box className='mt-4 mb-2' sx={{ height: 400, width: '100%' }}>
              <GridEval
                rows={axiosResponse[2]}
                columnsVar={columnasGTOSOP}
                fileNameVar='GTOSOP'
                columnGroupingModel={ColumnaGrupoGTOSOP}
              />
            </Box>
          )}
        {/* Repite para GTOSOP y ORVAS como en el ejemplo anterior */}
        {valueTab === 'indGestion' &&
          axiosResponse[4] &&
          axiosResponse[4].length > 0 && (
            <Box className='mt-4 mb-2'>
              <GridEval
                rows={axiosResponse[4]}
                columnsVar={columnasINDGESTION}
                fileNameVar='IND. GESTION'
                columnGroupingModel={ColumnaGrupoINDGESTION}
              />
            </Box>
          )}
        {valueTab === 'orvas' &&
          axiosResponse[3] &&
          axiosResponse[3].length > 0 && (
            <Box className='mt-4 mb-2' sx={{ height: 400, width: '100%' }}>
              <GridEval
                rows={axiosResponse[3]}
                columnsVar={columnasORVAS}
                fileNameVar='ORVAS'
                columnGroupingModel={ColumnaGrupoORVAS}
              />
            </Box>
          )}
        {valueTab === 'roe' &&
          axiosResponse[5] &&
          axiosResponse[5].length > 0 && (
            <Box className='mt-4 mb-2'>
              <GridEval
                rows={axiosResponse[5]}
                columnsVar={columnasROE}
                fileNameVar='ROE'
                columnGroupingModel={ColumnaGrupoROE}
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


// tabs boostrap : 

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
                  columnsVar={columnasCOB_EXC}
                  fileNameVar='COB_EXC'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoCOB_EXC}
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
          <Tab
            eventKey='indGestion'
            title={<span>IND. GESTION</span>}
            style={{ fontWeight: 600 }}
          >
            <div className='mt-4 mb-2'>
              {axiosResponse[4] && axiosResponse[4].length > 0 && (
                <GridEval
                  rows={axiosResponse[4]}
                  columnsVar={columnasINDGESTION}
                  fileNameVar='IND. GESTION'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoINDGESTION}
                />
              )}
            </div>
          </Tab>
          <Tab
            eventKey='roe'
            title={<span>ROE</span>}
            style={{ fontWeight: 600 }}
          >
            <div className='mt-4 mb-2'>
              {axiosResponse[5] && axiosResponse[5].length > 0 && (
                <GridEval
                  rows={axiosResponse[5]}
                  columnsVar={columnasROE}
                  fileNameVar='ROE'
                  autoHeight
                  columnGroupingModel={ColumnaGrupoROE}
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
