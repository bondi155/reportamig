import React, { useState, useEffect } from 'react';
import { Form, Container, Tabs, Tab, Button, Col, Row } from 'react-bootstrap';
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
  { field: 'compania', headerName: 'Compañía', width: 100 },
  // Primas Directas
  {
    field: 'montoDirectas2024',
    headerName: '2024',
    type: 'number',
    width: 130,
  },
  {
    field: 'montoDirectas2023',
    headerName: '2023',
    type: 'number',
    width: 130,
  },
  {
    field: 'montoDirectas2022',
    headerName: '2022',
    type: 'number',
    width: 130,
  },
  // Incremento
  {
    field: 'incrementomonto',
    headerName: 'Monto',
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
    field: 'montoPrima',
    headerName: 'Monto',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaTomada2024',
    headerName: '2024 (%)',
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
  { field: 'montoCedida', headerName: 'Monto', type: 'number', width: 130 },
  {
    field: 'primaCedida2024',
    headerName: '2024 (%)',
    type: 'number',
    width: 130,
  },
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
    field: 'montoRetenida',
    headerName: 'Monto',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaRetenida2024',
    headerName: '2024',
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
    field: 'montoincRvaRiesgoCurso',
    headerName: 'Monto',
    type: 'number',
    width: 130,
  },
  {
    field: 'incRvaRiesgoCurso2024',
    headerName: '2024',
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
    field: 'montoprimaDevengadaRetenida',
    headerName: 'Monto',
    type: 'number',
    width: 130,
  },
  {
    field: 'primaDevengadaRetenida2024',
    headerName: '2024',
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
  // Continuar con las demás columnas según la imagen...
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
    headerAlign: 'center', 
    children: [
      {
        groupId: 'monto',
        headerName: 'Monto',
        headerAlign: 'center', 
        children: [
            { field: 'montoDirectas2024' },
          { field: 'montoDirectas2023' },
          { field: 'montoDirectas2022' },
        ],
      },
      {
        groupId: 'incremento',
        headerName: 'Incremento',
        headerAlign: 'center', 
        children: [
          { field: 'incrementomonto' },
          { field: 'incrementoPorcentaje' },
        ],
      },
    ],
  },
  {
    groupId: 'primaTomada',
    headerName: 'Prima Tomada',
    headerAlign: 'center', 
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'montoPrima' },
      { field: 'primaTomada2024' },
      { field: 'primaTomada2023' },
      { field: 'primaTomada2022' },
    ],
  },
  {
    groupId: 'primaCedida',
    headerName: 'Prima Cedida',
    headerAlign: 'center', 
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'montoCedida' },
      { field: 'primaCedida2024' },
      { field: 'primaCedida2023' },
      { field: 'primaCedida2022' },
    ],
  },
  {
    groupId: 'PrimaRetenida',
    headerName: 'Prima Retenida',
    headerAlign: 'center', 
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'montoRetenida' },
      { field: 'primaRetenida2024' },

      { field: 'primaRetenida2023' },
      { field: 'primaRetenida2022' },
    ],
  },
  {
    groupId: 'incRvaRiesgoCurso',
    headerName: 'Inc. Rva. Riesgo Curso y Fianzas en VigorRet.',
    headerAlign: 'center', 
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'montoincRvaRiesgoCurso' },
      { field: 'incRvaRiesgoCurso2024' },
      { field: 'incRvaRiesgoCurso2023' },
      { field: 'incRvaRiesgoCurso2022' },
    ],
  },
  {
    groupId: 'primaDevengadaRetenida',
    headerName: 'Prima Devengada Retenida',
    headerAlign: 'center', 
    renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
    children: [
      { field: 'montoprimaDevengadaRetenida' },
      { field: 'primaDevengadaRetenida2024' },
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
    { field: 'montoCobExcPerdida', headerName: 'monto', type: 'number', width: 130 },
    { field: 'cobExcPerdida2024', headerName: '2024', type: 'number', width: 130 },
    { field: 'cobExcPerdida2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'cobExcPerdida2022', headerName: '2022', type: 'number', width: 130 },
    // Cto Adquisición Directo
    { field: 'montoCtoAdqDirecto', headerName: 'monto', type: 'number', width: 130 },
    { field: 'ctoAdqDirecto2024', headerName: '2024', type: 'number', width: 130 },
    { field: 'ctoAdqDirecto2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'ctoAdqDirecto2022', headerName: '2022', type: 'number', width: 130 },
    // Cto. Siniestralidad Retenida
    { field: 'montoCtoSinRetenida', headerName: 'monto', type: 'number', width: 130 },
    { field: 'ctoSinRetenida2024', headerName: '2024', type: 'number', width: 130 },
    { field: 'ctoSinRetenida2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'ctoSinRetenida2022', headerName: '2022', type: 'number', width: 130 },
    // Resultado Técnico
    { field: 'montoResultadoTecnico', headerName: 'monto', type: 'number', width: 130 },
    { field: 'resultadoTecnico2024', headerName: '2024', type: 'number', width: 130 },
    { field: 'resultadoTecnico2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'resultadoTecnico2022', headerName: '2022', type: 'number', width: 130 },
    // ... otras columnas si las hay ...
  ];
  
  const columnGroupingModelCob = [
    {
      groupId: 'coberturaExcDePerdida',
      headerName: 'Cobertura Exc. de Pérdida',
      headerAlign: 'center', 
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'montoCobExcPerdida' },
        { field: 'cobExcPerdida2024' },
        { field: 'cobExcPerdida2023' },
        { field: 'cobExcPerdida2022' },
      ],
    },
    {
      groupId: 'ctoAdquisicionDirecto',
      headerName: 'Cto Adquisición Directo',
      headerAlign: 'center', 
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'montoCtoAdqDirecto' },
        { field: 'ctoAdqDirecto2024' },
        { field: 'ctoAdqDirecto2023' },
        { field: 'ctoAdqDirecto2022' },
      ],
    },
    {
      groupId: 'ctoSiniestralidadRetenida',
      headerName: 'Cto. Siniestralidad Retenida',
      headerAlign: 'center', 
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'montoCtoSinRetenida' },
        { field: 'ctoSinRetenida2024' },
        { field: 'ctoSinRetenida2023' },
        { field: 'ctoSinRetenida2022' },
      ],
    },
    {
      groupId: 'resultadoTecnico',
      headerName: 'Resultado Técnico',
      headerAlign: 'center', 
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'montoResultadoTecnico' },
        { field: 'resultadoTecnico2024' },
        { field: 'resultadoTecnico2023' },
        { field: 'resultadoTecnico2022' },
      ],
    },
    // ... otros grupos de columnas si los hay ...
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
    { field: 'montoGastosOp', headerName: 'monto', type: 'number', width: 130 },
    { field: 'gastosOp2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'gastosOp2022', headerName: '2022', type: 'number', width: 130 },
    { field: 'gastosOp2023Ant', headerName: '2023 (Anterior)', type: 'number', width: 130 },
    { field: 'gastosOp2022Ant', headerName: '2022 (Anterior)', type: 'number', width: 130 },
    // Resultado de Operación
    { field: 'montoResultadoOp', headerName: 'monto', type: 'number', width: 130 },
    { field: 'resultadoOp2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'resultadoOp2022', headerName: '2022', type: 'number', width: 130 },
    { field: 'resultadoOp2023Ant', headerName: '2023 (Anterior)', type: 'number', width: 130 },
    { field: 'resultadoOp2022Ant', headerName: '2022 (Anterior)', type: 'number', width: 130 },
    // Producto Financiero
    { field: 'montoProductoFin', headerName: 'monto', type: 'number', width: 130 },
    { field: 'productoFin2023', headerName: '2023', type: 'number', width: 130 },
    { field: 'productoFin2022', headerName: '2022', type: 'number', width: 130 },
    { field: 'productoFin2023Ant', headerName: '2023 (Anterior)', type: 'number', width: 130 },
    { field: 'productoFin2022Ant', headerName: '2022 (Anterior)', type: 'number', width: 130 },
    // ... otras columnas si las hay ...
  ];
  //periodo anterior 2022 2023 (es comparativo )

  const columnGroupingModelGto = [
    {
      groupId: 'gastosDeOperacion',
      headerName: 'Gastos de Operación',
      headerAlign: 'center', 
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      children: [
        { field: 'montoGastosOp' },
        { field: 'gastosOp2023' },
        { field: 'gastosOp2022' },
        { field: 'gastosOp2023Ant' },
        { field: 'gastosOp2022Ant' },
      ],
    },
    {
      groupId: 'resultadoDeOperacion',
      headerName: 'Resultado de Operación',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoResultadoOp' },
        { field: 'resultadoOp2023' },
        { field: 'resultadoOp2022' },
        { field: 'resultadoOp2023Ant' },
        { field: 'resultadoOp2022Ant' },
      ],
    },
    {
      groupId: 'productoFinanciero',
      headerName: 'Producto Financiero',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoProductoFin' },
        { field: 'productoFin2023' },
        { field: 'productoFin2022' },
        { field: 'productoFin2023Ant' },
        { field: 'productoFin2022Ant' },
      ],
    },
    // ... otros grupos de columnas si los hay ...
  ];

  //ORVAS
  const columnsOrvas = [
    { field: 'posicion', headerName: 'Posición', width: 90 },
    { field: 'compania', headerName: 'Compañía', width: 200 },
    // Otras Reservas
    { field: 'montoOtrasReservas', headerName: 'Monto', type: 'number', width: 130 },
    { field: 'porcentajeOtrasReservas2024', headerName: '2024 (%)', type: 'number', width: 130 },
    { field: 'porcentajeOtrasReservas2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeOtrasReservas2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // Rtdo Partic. Inv. Perm
    { field: 'montoRtdoParticInvPerm', headerName: 'Monto', type: 'number', width: 130 },
    { field: 'porcentajeRtdoParticInvPerm2024', headerName: '2024 (%)', type: 'number', width: 130 },
    { field: 'porcentajeRtdoParticInvPerm2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeRtdoParticInvPerm2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // Impto. a la Utilidad
    { field: 'montoImptoUtilidad', headerName: 'Monto', type: 'number', width: 130 },
    { field: 'porcentajeImptoUtilidad2024', headerName: '2024 (%)', type: 'number', width: 130 },
    { field: 'porcentajeImptoUtilidad2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeImptoUtilidad2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // Rtdo en Subsidiarias
    { field: 'montoRtdoSubsidiarias', headerName: 'Monto', type: 'number', width: 130 },
    { field: 'porcentajeRtdoSubsidiarias2020', headerName: '2020 (%)', type: 'number', width: 130 },
    { field: 'porcentajeRtdoSubsidiarias2019', headerName: '2019 (%)', type: 'number', width: 130 },
    // Resultado Neto
    { field: 'montoResultadoNeto', headerName: 'Monto', type: 'number', width: 130 },
    { field: 'porcentajeResultadoNeto2024', headerName: '2024 (%)', type: 'number', width: 130 },
    { field: 'porcentajeResultadoNeto2023', headerName: '2023 (%)', type: 'number', width: 130 },
    { field: 'porcentajeResultadoNeto2022', headerName: '2022 (%)', type: 'number', width: 130 },
    // ... más columnas si las hay ...
  ];
  

  const columnGroupingModelOrvas = [
    {
      groupId: 'otrasReservas',
      headerName: 'Otras Reservas',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoOtrasReservas' },
        { field: 'porcentajeOtrasReservas2024' },
        { field: 'porcentajeOtrasReservas2023' },
        { field: 'porcentajeOtrasReservas2022' },
      ],
    },
    {
      groupId: 'rtdoParticInvPerm',
      headerName: 'Rtdo Partic. Inv. Perm',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoRtdoParticInvPerm' },
        { field: 'porcentajeRtdoParticInvPerm2024' },
        { field: 'porcentajeRtdoParticInvPerm2023' },
        { field: 'porcentajeRtdoParticInvPerm2022' },
      ],
    },
    {
      groupId: 'imptoUtilidad',
      headerName: 'Impto. a la Utilidad',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoImptoUtilidad' },
        { field: 'porcentajeImptoUtilidad2024' },
        { field: 'porcentajeImptoUtilidad2023' },
        { field: 'porcentajeImptoUtilidad2022' },
      ],
    },
    {
      groupId: 'rtdoSubsidiarias',
      headerName: 'Rtdo en Subsidiarias',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoRtdoSubsidiarias' },
        { field: 'porcentajeRtdoSubsidiarias2020' },
        { field: 'porcentajeRtdoSubsidiarias2019' },
      ],
    },
    {
      groupId: 'resultadoNeto',
      headerName: 'Resultado Neto',
      renderHeaderGroup: (params) => <CustomGroupHeader {...params} />,
      headerAlign: 'center', 
      children: [
        { field: 'montoResultadoNeto' },
        { field: 'porcentajeResultadoNeto2024' },
        { field: 'porcentajeResultadoNeto2023' },
        { field: 'porcentajeResultadoNeto2022' },
      ],
    },
    // ... más grupos de columnas si los hay ...
  ];

  
  const RamoAdministrativo = () => {
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
        <h2>Ramo Administrativo</h2>
        <Form>
        <Col lg={{span : 5, offset:4}}>

          <Form.Group controlId='formAnioSelect'>
            <Form.Label>Año</Form.Label>
            <Form.Control
              as='select'
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className='mt-2 mb-2'
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
              className='mt-2'
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
          <Col lg={{span : 2, offset: 6}}>
          <Button className='mt-4' variant='outline-secondary' type='submit'>
            Aceptar
          </Button>
          </Col>
        </Form>
        <Tabs
          defaultActiveKey='pd'
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

export default RamoAdministrativo;
