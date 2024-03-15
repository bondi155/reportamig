import '../css/App.css';


const withNumberFormatter = (columns) => {
  return columns.map((column) => {
    // Verifica si el tipo de la columna es 'number' para aplicar el formateador
    if (column.type === 'number') {
      return {
        ...column,
        valueFormatter: (params) => {
          return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(params.value);
        },
      };
    }
    return column;
  });
};


// COLUMNAS PARA TOTAL PD
export const columnasPD = withNumberFormatter([
  { field: 'col1', headerName: 'Posición', align: 'center', width: 80 }, 
  { field: 'col2', headerName: 'Empresa', width: 230 },
  // Columnas para "Prima directa"
  { field: 'col3', headerName: 'Importe 2023', type: 'number', width: 130 },
  { field: 'col4', headerName: 'Importe 2022', type: 'number', width: 130,  },
  {
    field: 'col5',
    type: 'number',
    headerName: 'Importe incremento',
    width: 150,
  },
  {
    field: 'col6',
    type: 'number',
    headerName: '% incremento',
    width: 160,
  },
  // Columnas para "Prima tomada"
  { field: 'col7', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col8',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col9',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Prima cedida"
  { field: 'col10', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col11',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col12',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Prima retenida"
  { field: 'col13', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col14',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col15',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para Inc. Rva. Riesgo Curso y Fianzas en VigorRet.
  { field: 'col16', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col17',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col18',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para Prima Devengada Retenida
  { field: 'col19', headerName: 'Importe', type: 'number', align: 'center', width: 110 },
  {
    field: 'col20',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col21',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
]);
//grupos para total PD
export const ColumnaGrupoPd = [
  {
    groupId: 'PrimaDirecta',
    headerName: 'Prima Directa',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Prima Directa',
    children: [
      { field: 'col3' },
      { field: 'col4' },
      { field: 'col5' },
      { field: 'col6' },
    ],
  },
  {
    groupId: 'Prima Tomada',
    headerName: 'Prima Tomada',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'info sobre Prima Tomada',
    children: [{ field: 'col7' }, { field: 'col8' }, { field: 'col9' }],
  },
  {
    groupId: 'PrimaCedida',
    headerName: 'Prima Cedida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Prima Cedida',
    children: [{ field: 'col10' }, { field: 'col11' }, { field: 'col12' }],
  },
  {
    groupId: 'PrimaRetenida',
    headerName: 'Prima Retenida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Prima Retenida',
    children: [{ field: 'col13' }, { field: 'col14' }, { field: 'col15' }],
  },
  {
    groupId: 'IncRvaRiesgoursoianzasVigorRet.',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign : 'center',
    headerName: 'Inc. Rva. Riesgo Curso y Fianzas en VigorRet.',
    description: 'Inc. Rva. Riesgo Curso y Fianzas en VigorRet.',
    children: [{ field: 'col16' }, { field: 'col17' }, { field: 'col18' }],
  },
  {
    groupId: 'PrimaDevengada',
    headerName: 'Prima Devengada Retenida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Prima Devengada Retenida',
    children: [{ field: 'col19' }, { field: 'col20' }, { field: 'col21' }],
  },
];
//columnas para COB_EXC PD
export const columnasCOB_EXC = withNumberFormatter([
  { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
  { field: 'col2', headerName: 'Empresa', width: 230 },
  // Columnas para "Cobertura Exc. de Pérdida"
  { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
  { field: 'col4', headerName: 'Importe 2023', type: 'number', width: 130 },
  {
    field: 'col5',
    headerName: 'Importe 2022',
    type: 'number',
    width: 150,
  },

  // Columnas para "Cto Adquisición Directo"
  { field: 'col6', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col7',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col8',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Costo Neto de Adquisición"
  { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col10',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col11',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Cto. Siniestralidad Retenida"
  { field: 'col12', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col13',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col14',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para Resultado Técnico
  { field: 'col15', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col16',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col17',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
]);
// grupo para COB_EXC
export const ColumnaGrupoCOB_EXC = [
  {
    groupId: 'CoberturaPerdida',
    headerName: 'Cobertura Exc. de Pérdida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Cobertura Exc. de Pérdida',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'Cto Adquisición Directo',
    headerName: 'Cto Adquisición Directo',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto Adquisición Directo',
    children: [{ field: 'col6' }, { field: 'col7' }, { field: 'col8' }],
  },
  {
    groupId: 'Costo Neto de Adquisición',
    headerName: 'Costo Neto de Adquisición',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Costo Neto de Adquisición',
    children: [{ field: 'col9' }, { field: 'col10' }, { field: 'col11' }],
  },

  {
    groupId: 'Cto. Siniestralidad Retenida',
    headerName: 'Cto. Siniestralidad Retenida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto. Siniestralidad Retenida',
    children: [{ field: 'col12' }, { field: 'col13' }, { field: 'col14' }],
  },
  {
    groupId: 'Resultado Técnico',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign : 'center',
    headerName: 'Resultado Técnico',
    description: 'Resultado Técnico',
    children: [{ field: 'col15' }, { field: 'col16' }, { field: 'col17' }],
  },
];

//columnas para GTOSOP
export const columnasGTOSOP = withNumberFormatter([
  { field: 'col1', headerName: 'Posición', type: 'number', align: 'center', width: 80 },
  { field: 'col2', headerName: 'Empresa', width: 230 },

  // Columnas para "Gastos de Operación"
  { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
  { field: 'col4', headerName: '% 2023', type: 'number', width: 130 },
  {
    field: 'col5',
    type: 'number',
    headerName: '% 2022',
    width: 150,
  },
  { field: 'col6', headerName: '% 2023', type: 'number', width: 110 },
  {
    field: 'col7',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Resultado de Operación"
  {
    field: 'col8',
    headerName: 'Importe ',
    type: 'number',
    width: 140,
  },
  { field: 'col9', headerName: '% 2023', type: 'number', width: 110 },
  {
    field: 'col10',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  {
    field: 'col11',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  { field: 'col12', headerName: '% 2022', type: 'number', width: 110 },

  // Columnas para "Producto Financiero"
  {
    field: 'col13',
    headerName: 'Importe',
    type: 'number',
    width: 140,
  },
  {
    field: 'col14',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  { field: 'col15', headerName: '% 2022', type: 'number', width: 110 },
  {
    field: 'col16',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col17',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
]);

// grupo para GTOSOP
export const ColumnaGrupoGTOSOP = [
  {
    groupId: 'GastosOperación',
    headerName: 'Gastos de Operación',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Gastos de Operación',
    children: [
      { field: 'col3' },
      { field: 'col4' },
      { field: 'col5' },
      { field: 'col6' },
      { field: 'col7' },
    ],
  },
  {
    groupId: 'ResultadoOperación',
    headerName: 'Resultado de Operación',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Resultado de Operación',
    children: [
      { field: 'col8' },
      { field: 'col9' },
      { field: 'col10' },
      { field: 'col11' },
      { field: 'col12' },
    ],
  },

  {
    groupId: 'ProductoFinanciero',
    headerName: 'Producto Financiero',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Producto Financiero',
    children: [
      { field: 'col13' },
      { field: 'col14' },
      { field: 'col15' },
      { field: 'col16' },
      { field: 'col17' },
    ],
  },
];

//columnas para ORVAS
export const columnasORVAS = withNumberFormatter([
  { field: 'col1', headerName: 'Posición', type: 'number', width: 80 },
  { field: 'col2', headerName: 'Empresa', width: 230 },
  // Columnas para "Otras Reservas"
  { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
  { field: 'col4', headerName: '% 2023', type: 'number', width: 130 },
  {
    field: 'col5',
    headerName: '% 2022',
    type: 'number',
    width: 150,
  },

  // Columnas para "Rtado Particp. Inv. Perman."
  { field: 'col6', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col7',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col8',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Impto. a la Utilidad"
  { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col10',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col11',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Rtado en Subsidiarias y Op. Discontinuadas"
  { field: 'col12', headerName: 'Importe 2019', type: 'number', width: 110 },
  {
    field: 'col13',
    headerName: 'Importe 2020',
    type: 'number',
    width: 140,
  },
  // Columnas para "Resultado Neto"

  {
    field: 'col14',
    headerName: 'Importe',
    type: 'number',
    width: 140,
  },
  // Columnas para Resultado Técnico
  { field: 'col15', headerName: '% 2023', type: 'number', width: 110 },
  {
    field: 'col16',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Indice Combinado"

  {
    field: 'col17',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col18',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
]);

// grupo para ORVAS
export const ColumnaGrupoORVAS = [
  {
    groupId: 'OtrasReservas',
    headerName: 'Otras Reservas',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Otras Reservas',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'RtadoParticpInv.Perman',
    headerName: 'Rtado Particp. Inv. Perman.',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rtado Particp. Inv. Perman.',
    children: [{ field: 'col6' }, { field: 'col7' }, { field: 'col8' }],
  },

  {
    groupId: 'ImptoUtilidad',
    headerName: 'Impto. a la Utilidad',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Impto. a la Utilidad',
    children: [{ field: 'col9' }, { field: 'col10' }, { field: 'col11' }],
  },
  {
    groupId: 'RtadoSubsidiariasDiscontinuadas',
    headerAlign : 'center',
    headerName: 'Rtado en Subsidiarias y Op. Discontinuadas',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rtado en Subsidiarias y Op. Discontinuadas',
    children: [{ field: 'col12' }, { field: 'col13' }],
  },
  {
    groupId: 'ResultadoNeto',
    headerName: 'Resultado Neto',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Resultado Neto',
    children: [{ field: 'col14' }, { field: 'col15' }, { field: 'col16' }],
  },
  {
    groupId: 'IndiceCombinado',
    headerName: 'Indice Combinado',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Indice Combinado',
    children: [{ field: 'col17' }, { field: 'col18' }],
  },
];

//columnas para IND GESTION
export const columnasINDGESTION = withNumberFormatter([
  { field: 'col1', headerName: 'Posición', width: 80 },
  { field: 'col2', headerName: 'Empresa', width: 230 },
  // Columnas para "Otras Reservas"
  { field: 'col3', headerName: '% 2023', type: 'number', width: 130 },
  { field: 'col4', headerName: '% 2022', type: 'number', width: 130 },
  {
    field: 'col5',
    headerName: '% 2023',
    type: 'number',
    width: 150,
  },

  // Columnas para "Rtado Particp. Inv. Perman."
  { field: 'col6', headerName: '% 2022', type: 'number', width: 110 },
  {
    field: 'col7',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col8',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "EBITDA"
  { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col10',
    headerName: '% 2023 (VS.PD)',
    type: 'number',
    width: 140,
  },
  {
    field: 'col11',
    headerName: '% 2022 (VS.PD)',
    type: 'number',
    width: 140,
  },
  // Columnas para "Rtado en Subsidiarias y Op. Discontinuadas"
  {
    field: 'col12',
    headerName: '% 2023 VS.CAP. PATRIM',
    type: 'number',
    width: 110,
  },
  {
    field: 'col13',
    headerName: '% 2022 VS.CAP. PATRIM',
    type: 'number',
    width: 140,
  },
]);

//grupo para IND GESTION

export const ColumnaGrupoINDGESTION = [
  {
    groupId: 'ApalancamientoRequerido',
    headerName: 'Apalancamiento Requerido',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Apalancamiento Requerido',
    children: [{ field: 'col3' }, { field: 'col4' }],
  },
  {
    groupId: 'RentabilidadAsociada',
    headerName: 'Rentabilidad Asociada',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rentabilidad Asociada',
    children: [{ field: 'col5' }, { field: 'col6' }],
  },

  {
    groupId: 'RentabilidadOperativa',
    headerName: 'Rentabilidad Operativa',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rentabilidad Operativa',
    children: [{ field: 'col7' }, { field: 'col8' }],
  },
  {
    groupId: 'ebitida',
    headerName: 'EBITDA',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'EBITDA',
    children: [
      { field: 'col9' },
      { field: 'col10' },
      { field: 'col11' },
      { field: 'col12' },
      { field: 'col13' },
    ],
  },
];

//columnas para ROE
export const columnasROE =withNumberFormatter([
  { field: 'col1', headerName: 'Posición', type: 'number', align: 'center', width: 80 },
  { field: 'col2', headerName: 'Empresa', width: 230 },
  // Columnas para "Otras Reservas"
  { field: 'col3', headerName: 'RES NETO', type: 'number', width: 130 },
  {
    field: 'col4',
    headerName: 'Capital Contable Ini ',
    type: 'number',
    width: 130,
  },
  {
    field: 'col5',
    headerName: 'Capital Contable Fin ',
    type: 'number',
    width: 150,
  },

  // Columnas para "Rtado Particp. Inv. Perman."
  { field: 'col6', headerName: 'ROE', type: 'number', width: 110 },
]);

export const ColumnaGrupoROE = [
  {
    groupId: 'ReturNOnEquity(ROE) ',
    headerName: 'Return On Equity (ROE) ',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Return On Equity (ROE) ',
    children: [
      { field: 'col3' },
      { field: 'col4' },
      { field: 'col5' },
      { field: 'col6' },
    ],
  },
];


// Termina Total ---------------------------------------------------------------º-------------------------------------------------------------------------------

// Columnas Administrativas cob_Exc

export const columnas_COB_EXC_admins = withNumberFormatter([
  { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
  { field: 'col2', headerName: 'Empresa', width: 230 },
  // Columnas para "Cobertura Exc. de Pérdida"
  { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
  { field: 'col4', headerName: 'Importe 2023', type: 'number', width: 130 },
  {
    field: 'col5',
    headerName: 'Importe 2022',
    type: 'number',
    width: 150,
  },

  // Columnas para "Cto Adquisición Directo"
  { field: 'col6', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col7',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col8',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Costo Neto de Adquisición"
  { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col10',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col11',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para "Cto. Siniestralidad Retenida"
  { field: 'col12', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col13',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col14',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
  // Columnas para Resultado Técnico
  { field: 'col15', headerName: 'Importe', type: 'number', width: 110 },
  {
    field: 'col16',
    headerName: '% 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col17',
    headerName: '% 2022',
    type: 'number',
    width: 140,
  },
    // Columnas para Resultado Op. Analogas y C.
  {
    field: 'col18',
    headerName: 'Importe 2023',
    type: 'number',
    width: 140,
  },
  {
    field: 'col19',
    headerName: 'Importe 2022',
    type: 'number',
    width: 140,
  },
]);


// grupo para COB_EXC administrativas
export const ColumnaGrupo_COB_EXC_admins = [
  {
    groupId: 'CoberturaPerdida',
    headerName: 'Cobertura Exc. de Pérdida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Cobertura Exc. de Pérdida',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'Cto Adquisición Directo',
    headerName: 'Cto Adquisición Directo',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto Adquisición Directo',
    children: [{ field: 'col6' }, { field: 'col7' }, { field: 'col8' }],
  },
  {
    groupId: 'Costo Neto de Adquisición',
    headerName: 'Costo Neto de Adquisición',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Costo Neto de Adquisición',
    children: [{ field: 'col9' }, { field: 'col10' }, { field: 'col11' }],
  },

  {
    groupId: 'Cto. Siniestralidad Retenida',
    headerName: 'Cto. Siniestralidad Retenida',
    headerAlign : 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto. Siniestralidad Retenida',
    children: [{ field: 'col12' }, { field: 'col13' }, { field: 'col14' }],
  },
  {
    groupId: 'Resultado Técnico',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign : 'center',
    headerName: 'Resultado Técnico',
    description: 'Resultado Técnico',
    children: [{ field: 'col15' }, { field: 'col16' }, { field: 'col17' }],
  },
  {
    groupId: 'ResultadoAnalogasC',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign : 'center',
    headerName: 'Resultado Op. Analogas y C.',
    description: 'Resultado Op. Analogas y C.',
    children: [{ field: 'col18' }, { field: 'col19' }]
  }

];

// Termina Administrativas ---------------------------------------------------------------º-------------------------------------------------------------------------------
