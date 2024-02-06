import React, { useState, useEffect } from 'react';
import { Form, Container, Tabs, Tab, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval.js';
import '../css/App.css';

function CustomGroupHeader({ headerName }) {
  return <div style={{ fontWeight: 'bold', width: '100%' }}>{headerName}</div>;
}

const columnsPd = [
  { field: 'posicion', headerName: 'Posición', width: 90 },
  { field: 'compania', headerName: 'Compañía', width: 200 },
  // Primas Directas
  {
    field: 'importeDirectas2023',
    headerName: '2023',
    type: 'number',
    width: 130,
  },
  {
    field: 'importeDirectas2022',
    headerName: '2022',
    type: 'number',
    width: 130,
  },
  // Incremento
  {
    field: 'incrementoImporte',
    headerName: 'Importe',
    type: 'number',
    width: 130,
  },
  {
    field: 'incrementoPorcentaje',
    headerName: '%',
    type: 'number',
    width: 130,
  },
  // Prima Tomada
  {
    field: 'importePrima',
    headerName: 'Importe Prima',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaTomada2023',
    headerName: '2023 (%)',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaTomada2022',
    headerName: '2022 (%)',
    type: 'number',
    width: 130,
  },
  // Prima Cedida
  { field: 'importeCedida', headerName: 'Importe', type: 'number', width: 130 },
  {
    field: 'primaCedida2023',
    headerName: '2023 (%)',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaCedida2022',
    headerName: '2022 (%)',
    type: 'number',
    width: 130,
  },
  // Prima Retenida
  {
    field: 'importeRetenida',
    headerName: 'Importe',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaRetenida2023',
    headerName: '2023',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaRetenida2022',
    headerName: '2022',
    type: 'number',
    width: 130,
  },
  // Inc. Rva. Riesgo Curso y Fianzas en VigorRet.
  {
    field: 'importeincRvaRiesgoCurso',
    headerName: 'Importe',
    type: 'number',
    width: 130,
  },
  {
    field: 'incRvaRiesgoCurso2023',
    headerName: '2023',
    type: 'number',
    width: 130,
  },
  {
    field: 'incRvaRiesgoCurso2022',
    headerName: '2022',
    type: 'number',
    width: 130,
  },
  // Prima Devengada Retenida
  {
    field: 'importeprimaDevengadaRetenida',
    headerName: 'Importe',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaDevengadaRetenida2023',
    headerName: '2023',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaDevengadaRetenida2022',
    headerName: '2022',
    type: 'number',
    width: 130,
  },
];

//PD
const rowsPd = [
  { id: 1, posicion: 'Snow', compañia: 'Jon', age: 14 },
  { id: 2, posicion: 'Lannister', compañia: 'Cersei', age: 31 },
  { id: 3, posicion: 'Lannister', compañia: 'Jaime', age: 31 },
  { id: 4, posicion: 'Stark', compañia: 'Arya', age: 11 },
  { id: 5, posicion: 'Targaryen', compañia: 'Daenerys', age: 120 },
  { id: 6, posicion: 'Melisandre', compañia: 'CACAO', age: 150 },
  { id: 7, posicion: 'Clifford', compañia: 'Ferrara', age: 44 },
  { id: 8, posicion: 'Frances', compañia: 'Rossini', age: 36 },
  { id: 9, posicion: 'Roxie', compañia: 'Harvey', age: 65 },
];
//PD
const columnGroupingModelPd = [
  {
    groupId: 'primasDirectas',
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    headerName: 'Primas Directas',
    children: [
      {
        groupId: 'importe',
        headerName: 'Importe',
        children: [
          { field: 'importeDirectas2023' },
          { field: 'importeDirectas2022' },
        ],
      },
      {
        groupId: 'incremento',
        headerName: 'Incremento',
        children: [
          { field: 'incrementoImporte' },
          { field: 'incrementoPorcentaje' },
        ],
      },
    ],
  },
  {
    groupId: 'primaTomada',
    headerName: 'Prima Tomada',
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'importePrima' },
      { field: 'primaTomada2023' },
      { field: 'primaTomada2022' },
    ],
  },
  {
    groupId: 'primaCedida',
    headerName: 'Prima Cedida',
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'importeCedida' },
      { field: 'primaCedida2023' },
      { field: 'primaCedida2022' },
    ],
  },
  {
    groupId: 'PrimaRetenida',
    headerName: 'Prima Retenida',
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'importeRetenida' },
      { field: 'primaRetenida2023' },
      { field: 'primaRetenida2022' },
    ],
  },
  {
    groupId: 'incRvaRiesgoCurso',
    headerName: 'Inc. Rva. Riesgo Curso y Fianzas en VigorRet.',
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'importeincRvaRiesgoCurso' },
      { field: 'incRvaRiesgoCurso2023' },
      { field: 'incRvaRiesgoCurso2022' },
    ],
  },
  {
    groupId: 'primaDevengadaRetenida',
    headerName: 'Prima Devengada Retenida',
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'importeprimaDevengadaRetenida' },
      { field: 'primaDevengadaRetenida2023' },
      { field: 'primaDevengadaRetenida2022' },
    ],
  },
];



//COB_EXC
const rowsCob = [
  { id: 1, posicion: 'Snow', compañia: 'Jon', age: 14 },
  { id: 2, posicion: 'Lannister', compañia: 'Cersei', age: 31 },
  { id: 3, posicion: 'Lannister', compañia: 'Jaime', age: 31 },
  { id: 4, posicion: 'Stark', compañia: 'Arya', age: 11 },
  { id: 5, posicion: 'Targaryen', compañia: 'Daenerys', age: 120 },
  { id: 6, posicion: 'Melisandre', compañia: 'CACAO', age: 150 },
  { id: 7, posicion: 'Clifford', compañia: 'Ferrara', age: 44 },
  { id: 8, posicion: 'Frances', compañia: 'Rossini', age: 36 },
  { id: 9, posicion: 'Roxie', compañia: 'Harvey', age: 65 },
];

const columnsCob = [
    { field: 'posicion', headerName: 'Posición', width: 90 },
    { field: 'compania', headerName: 'Compañía', width: 200 },
    // Cobertura Exc. de Pérdida
    { field: 'importeCobExcPerdida', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'cobExcPerdida2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'cobExcPerdida2022', headerName: '2022', type: 'number', width: 130 },
    // Cto Adquisición Directo
    { field: 'importeCtoAdqDirecto', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'ctoAdqDirecto2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'ctoAdqDirecto2022', headerName: '2022', type: 'number', width: 130 },
    // Cto. Siniestralidad Retenida
    { field: 'importeCtoSinRetenida', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'ctoSinRetenida2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'ctoSinRetenida2022', headerName: '2022', type: 'number', width: 130 },
    // Resultado Técnico
    { field: 'importeResultadoTecnico', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'resultadoTecnico2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'resultadoTecnico2022', headerName: '2022', type: 'number', width: 130 },
    // ... otras columnas si las hay ...
  ];
  
  const columnGroupingModelCob = [
    {
      groupId: 'coberturaExcDePerdida',
      headerName: 'Cobertura Exc. de Pérdida',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'importeCobExcPerdida' },
        { field: 'cobExcPerdida2023' },
        { field: 'cobExcPerdida2022' },
      ],
    },
    {
      groupId: 'ctoAdquisicionDirecto',
      headerName: 'Cto Adquisición Directo',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'importeCtoAdqDirecto' },
        { field: 'ctoAdqDirecto2023' },
        { field: 'ctoAdqDirecto2022' },
      ],
    },
    {
      groupId: 'ctoSiniestralidadRetenida',
      headerName: 'Cto. Siniestralidad Retenida',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'importeCtoSinRetenida' },
        { field: 'ctoSinRetenida2023' },
        { field: 'ctoSinRetenida2022' },
      ],
    },
    {
      groupId: 'resultadoTecnico',
      headerName: 'Resultado Técnico',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'importeResultadoTecnico' },
        { field: 'resultadoTecnico2023' },
        { field: 'resultadoTecnico2022' },
      ],
    },
  ];


  //GTOSTOP

  const rowsGto= [
    { id: 1, posicion: 'Snow', compañia: 'Jon', age: 14 },
    { id: 2, posicion: 'Lannister', compañia: 'Cersei', age: 31 },
    { id: 3, posicion: 'Lannister', compañia: 'Jaime', age: 31 },
    { id: 4, posicion: 'Stark', compañia: 'Arya', age: 11 },
    { id: 5, posicion: 'Targaryen', compañia: 'Daenerys', age: 120 },
    { id: 6, posicion: 'Melisandre', compañia: 'CACAO', age: 150 },
    { id: 7, posicion: 'Clifford', compañia: 'Ferrara', age: 44 },
    { id: 8, posicion: 'Frances', compañia: 'Rossini', age: 36 },
    { id: 9, posicion: 'Roxie', compañia: 'Harvey', age: 65 },
  ];
  const columnsGto = [
    { field: 'posicion', headerName: 'Posición', width: 90 },
    { field: 'compania', headerName: 'Compañía', width: 200 },
    // Gastos de Operación
    { field: 'importeGastosOp', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'gastosOp2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'gastosOp2022', headerName: '2022', type: 'number', width: 130 },
    { field: 'gastosOp2023Ant', headerName: '2023 (Anterior)', type: 'number', width: 130 },
    { field: 'gastosOp2022Ant', headerName: '2022 (Anterior)', type: 'number', width: 130 },
    // Resultado de Operación
    { field: 'importeResultadoOp', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'resultadoOp2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'resultadoOp2022', headerName: '2022', type: 'number', width: 130 },
    { field: 'resultadoOp2023Ant', headerName: '2023 (Anterior)', type: 'number', width: 130 },
    { field: 'resultadoOp2022Ant', headerName: '2022 (Anterior)', type: 'number', width: 130 },
    // Producto Financiero
    { field: 'importeProductoFin', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'productoFin2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'productoFin2022', headerName: '2022', type: 'number', width: 130 },
    { field: 'productoFin2023Ant', headerName: '2023 (Anterior)', type: 'number', width: 130 },
    { field: 'productoFin2022Ant', headerName: '2022 (Anterior)', type: 'number', width: 130 },
  ];
  //periodo anterior 2022 2023 (es comparativo )

  const columnGroupingModelGto = [
    {
      groupId: 'gastosDeOperacion',
      headerName: 'Gastos de Operación',
      children: [
        { field: 'importeGastosOp' },
        { field: 'gastosOp2023' },
        { field: 'gastosOp2022' },
        { field: 'gastosOp2023Ant' },
        { field: 'gastosOp2022Ant' },
      ],
    },
    {
      groupId: 'resultadoDeOperacion',
      headerName: 'Resultado de Operación',
      children: [
        { field: 'importeResultadoOp' },
        { field: 'resultadoOp2023' },
        { field: 'resultadoOp2022' },
        { field: 'resultadoOp2023Ant' },
        { field: 'resultadoOp2022Ant' },
      ],
    },
    {
      groupId: 'productoFinanciero',
      headerName: 'Producto Financiero',
      children: [
        { field: 'importeProductoFin' },
        { field: 'productoFin2023' },
        { field: 'productoFin2022' },
        { field: 'productoFin2023Ant' },
        { field: 'productoFin2022Ant' },
      ],
    },
  ];

  //ORVAS
  const columnsOrvas = [
    { field: 'posicion', headerName: 'Posición', width: 90 },
    { field: 'compania', headerName: 'Compañía', width: 200 },
    // Otras Reservas
    { field: 'importeOtrasReservas', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'porcentajeOtrasReservas2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeOtrasReservas2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // Rtdo Partic. Inv. Perm
    { field: 'importeRtdoParticInvPerm', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'porcentajeRtdoParticInvPerm2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeRtdoParticInvPerm2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // Impto. a la Utilidad
    { field: 'importeImptoUtilidad', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'porcentajeImptoUtilidad2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeImptoUtilidad2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // Rtdo en Subsidiarias
    { field: 'importeRtdoSubsidiarias', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'porcentajeRtdoSubsidiarias2020', headerName: '2020 (%)', type: 'number', width: 130 },
    { field: 'porcentajeRtdoSubsidiarias2019', headerName: '2019 (%)', type: 'number', width: 130 },
    // Resultado Neto
    { field: 'importeResultadoNeto', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'porcentajeResultadoNeto2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeResultadoNeto2022', headerName: '2022 (%)', type: 'number', width: 130 },
    
  ];
  

  const columnGroupingModelOrvas = [
    {
      groupId: 'otrasReservas',
      headerName: 'Otras Reservas',
      children: [
        { field: 'importeOtrasReservas' },
        { field: 'porcentajeOtrasReservas2023' },
        { field: 'porcentajeOtrasReservas2022' },
      ],
    },
    {
      groupId: 'rtdoParticInvPerm',
      headerName: 'Rtdo Partic. Inv. Perm',
      children: [
        { field: 'importeRtdoParticInvPerm' },
        { field: 'porcentajeRtdoParticInvPerm2023' },
        { field: 'porcentajeRtdoParticInvPerm2022' },
      ],
    },
    {
      groupId: 'imptoUtilidad',
      headerName: 'Impto. a la Utilidad',
      children: [
        { field: 'importeImptoUtilidad' },
        { field: 'porcentajeImptoUtilidad2023' },
        { field: 'porcentajeImptoUtilidad2022' },
      ],
    },
    {
      groupId: 'rtdoSubsidiarias',
      headerName: 'Rtdo en Subsidiarias',
      children: [
        { field: 'importeRtdoSubsidiarias' },
        { field: 'porcentajeRtdoSubsidiarias2020' },
        { field: 'porcentajeRtdoSubsidiarias2019' },
      ],
    },
    {
      groupId: 'resultadoNeto',
      headerName: 'Resultado Neto',
      children: [
        { field: 'importeResultadoNeto' },
        { field: 'porcentajeResultadoNeto2023' },
        { field: 'porcentajeResultadoNeto2022' },
      ],
    },
    // ... más grupos de columnas si los hay ...
  ];


  //IND. GESTION 

  const columnsIndGst = [ 
    { field: 'posicion', headerName: 'Posición', width: 90 },
  { field: 'compania', headerName: 'Compañía', width: 200 },
  // Apalancamiento Requerido
  { field: 'aplancamientoReq2023', headerName: '2023', type: 'number', width: 130 },
  { field: 'aplancamientoReq2022', headerName: '2022', type: 'number', width: 130 },
  // Rentabilidad Asociada
  { field: 'rentabilidadAsoc2023', headerName: '2023 (%)', type: 'number', width: 130 },
  { field: 'rentabilidadAsoc2022', headerName: '2022 (%)', type: 'number', width: 130 },
  // Rentabilidad Operativa
  { field: 'rentabilidadOp2023', headerName: '2023 (%)', type: 'number', width: 130 },
  { field: 'rentabilidadOp2022', headerName: '2022 (%)', type: 'number', width: 130 },
  // EBITDA
  { field: 'ebitdaImporteMiles', headerName: 'Importe (Miles)', type: 'number', width: 130 },
  { field: 'ebitda2023PD', headerName: '2023 (%) VS. PD', type: 'number', width: 130 },
  { field: 'ebitda2022PD', headerName: '2022 (%) VS. PD', type: 'number', width: 130 },
  { field: 'ebitda2023CAP', headerName: '2023 (%) VS. CAP. PATRIM', type: 'number', width: 130 },
  { field: 'ebitda2022CAP', headerName: '2022 (%) VS. CAP. PATRIM', type: 'number', width: 130 },
  ];

  const columnGroupingModelIndGst = [
    {
        groupId: 'aplancamientoRequerido',
        headerName: 'Apalancamiento Requerido',
        children: [
          { field: 'aplancamientoReq2023' },
          { field: 'aplancamientoReq2022' },
        ],
      },
      {
        groupId: 'rentabilidadAsociada',
        headerName: 'Rentabilidad Asociada',
        children: [
          { field: 'rentabilidadAsoc2023' },
          { field: 'rentabilidadAsoc2022' },
        ],
      },
      {
        groupId: 'rentabilidadOperativa',
        headerName: 'Rentabilidad Operativa',
        children: [
          { field: 'rentabilidadOp2023' },
          { field: 'rentabilidadOp2022' },
        ],
      },
      {
        groupId: 'ebitda',
        headerName: 'EBITDA',
        children: [
          { field: 'ebitdaImporteMiles' },
          { field: 'ebitda2023PD' },
          { field: 'ebitda2022PD' },
          { field: 'ebitda2023CAP' },
          { field: 'ebitda2022CAP' },
        ],
      },
  ];

  //ROE
  const columnsRoe = [
    { field: 'posicion', headerName: 'Posición', width: 90 },
    { field: 'compania', headerName: 'Compañía', width: 200 },
    // Res Neto T4
    { field: 'resNetoT4Roe', headerName: 'Res Neto T4', type: 'number', width: 130 },
    // Capital Contable Inicial
    { field: 'capitalContIniRoe', headerName: 'Capital Contable Ini', type: 'number', width: 130 },
    // Capital Contable Final
    { field: 'capitalContFinRoe', headerName: 'Capital Contable Fin', type: 'number', width: 130 },
    // ROE
    { field: 'roeRoe', headerName: 'ROE', type: 'number', width: 130 },
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
        <h2>Total</h2>
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
              rows={rowsPd}
              columnsVar={columnsPd}
              checkboxSelection
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModelPd}
            />
          </Tab>
          <Tab eventKey='cobexc' title='COB_EXC'>
            <GridEval
              rows={rowsCob}
              columnsVar={columnsCob}
              checkboxSelection
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModelCob}
            />{' '}
          </Tab>
          <Tab eventKey='gtosop' title='GTOSOP'>
          <GridEval
              rows={rowsGto}
              columnsVar={columnsGto}
              checkboxSelection
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModelGto}
            />{' '}          </Tab>
          <Tab eventKey='orvas' title='ORVAS'>
          <GridEval
              rows={rowsGto}
              columnsVar={columnsOrvas}
              checkboxSelection
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModelOrvas}
            />{' '}          </Tab>
          <Tab eventKey='indgestion' title='IND.GESTION'>
          <GridEval
              rows={rowsGto}
              columnsVar={columnsIndGst}
              checkboxSelection
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModelIndGst}
            />{' '}          </Tab>
          <Tab eventKey='roe' title='ROE'>
          <GridEval
              rows={rowsGto}
              columnsVar={columnsRoe}
              checkboxSelection
              disableRowSelectionOnClick
            />{' '}          </Tab>
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
