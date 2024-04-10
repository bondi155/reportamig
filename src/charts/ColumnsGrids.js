import '../css/App.css';

const withNumberFormatter = (columns) => {
  return columns.map((column) => {
    // Verifica si el tipo de la columna es number si no no aplica nada
    if (column.type === 'number') {
      return {
        ...column,
        valueFormatter: (params) => {
          return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(
            params.value
          );
        },
      };
    }
    return column;
  });
};

// COLUMNAS PARA TOTAL PD
export const columnasPD = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Prima directa"
    {
      field: 'col3',
      headerName: `Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col4',
      headerName: `Importe ${anio - 1}`,
      type: 'number',
      width: 130,
    },
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
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col9',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Prima cedida"
    { field: 'col10', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col11',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col12',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Prima retenida"
    { field: 'col13', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col14',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col15',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para Inc. Rva. Riesgo Curso y Fianzas en VigorRet.
    { field: 'col16', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col17',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col18',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para Prima Devengada Retenida
    { field: 'col19', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col20',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col21',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
  ]);
//grupos para total PD
export const ColumnaGrupoPd = [
  {
    groupId: 'PrimaDirecta',
    headerName: 'Prima Directa',
    headerAlign: 'center',
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
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'info sobre Prima Tomada',
    children: [{ field: 'col7' }, { field: 'col8' }, { field: 'col9' }],
  },
  {
    groupId: 'PrimaCedida',
    headerName: 'Prima Cedida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Prima Cedida',
    children: [{ field: 'col10' }, { field: 'col11' }, { field: 'col12' }],
  },
  {
    groupId: 'PrimaRetenida',
    headerName: 'Prima Retenida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Prima Retenida',
    children: [{ field: 'col13' }, { field: 'col14' }, { field: 'col15' }],
  },
  {
    groupId: 'IncRvaRiesgoursoianzasVigorRet.',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign: 'center',
    headerName: 'Inc. Rva. Riesgo Curso y Fianzas en VigorRet.',
    description: 'Inc. Rva. Riesgo Curso y Fianzas en VigorRet.',
    children: [{ field: 'col16' }, { field: 'col17' }, { field: 'col18' }],
  },
  {
    groupId: 'PrimaDevengada',
    headerName: 'Prima Devengada Retenida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Prima Devengada Retenida',
    children: [{ field: 'col19' }, { field: 'col20' }, { field: 'col21' }],
  },
];
//columnas para COB_EXC PD
export const columnasCOB_EXC = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Cobertura Exc. de Pérdida"
    { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
    {
      field: 'col4',
      headerName: `Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col5',
      headerName: `Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },

    // Columnas para "Cto Adquisición Directo"
    { field: 'col6', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col7',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col8',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Costo Neto de Adquisición"
    { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col10',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col11',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Cto. Siniestralidad Retenida"
    { field: 'col12', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col13',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col14',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para Resultado Técnico
    { field: 'col15', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col16',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col17',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
  ]);
// grupo para COB_EXC
export const ColumnaGrupoCOB_EXC = [
  {
    groupId: 'CoberturaPerdida',
    headerName: 'Cobertura Exc. de Pérdida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Cobertura Exc. de Pérdida',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'Cto Adquisición Directo',
    headerName: 'Cto Adquisición Directo',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto Adquisición Directo',
    children: [{ field: 'col6' }, { field: 'col7' }, { field: 'col8' }],
  },
  {
    groupId: 'Costo Neto de Adquisición',
    headerName: 'Costo Neto de Adquisición',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Costo Neto de Adquisición',
    children: [{ field: 'col9' }, { field: 'col10' }, { field: 'col11' }],
  },

  {
    groupId: 'Cto. Siniestralidad Retenida',
    headerName: 'Cto. Siniestralidad Retenida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto. Siniestralidad Retenida',
    children: [{ field: 'col12' }, { field: 'col13' }, { field: 'col14' }],
  },
  {
    groupId: 'Resultado Técnico',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign: 'center',
    headerName: 'Resultado Técnico',
    description: 'Resultado Técnico',
    children: [{ field: 'col15' }, { field: 'col16' }, { field: 'col17' }],
  },
];

//columnas para GTOSOP
export const columnasGTOSOP = (anio) =>
  withNumberFormatter([
    {
      field: 'col1',
      headerName: 'Posición',
      type: 'number',
      align: 'center',
      width: 80,
    },
    { field: 'col2', headerName: 'Empresa', width: 230 },

    // Columnas para "Gastos de Operación"
    { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'col4', headerName: `% ${anio}`, type: 'number', width: 130 },
    {
      field: 'col5',
      type: 'number',
      headerName: `% ${anio - 1}`,
      width: 150,
    },
    { field: 'col6', headerName: `% ${anio}`, type: 'number', width: 110 },
    {
      field: 'col7',
      headerName: `% ${anio - 1}`,
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
    { field: 'col9', headerName: `% ${anio}`, type: 'number', width: 110 },
    {
      field: 'col10',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col11',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    { field: 'col12', headerName: `% ${anio - 1}`, type: 'number', width: 110 },

    // Columnas para "Producto Financiero"
    {
      field: 'col13',
      headerName: 'Importe',
      type: 'number',
      width: 140,
    },
    {
      field: 'col14',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    { field: 'col15', headerName: '% 2022', type: 'number', width: 110 },
    {
      field: 'col16',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col17',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
  ]);

// grupo para GTOSOP
export const ColumnaGrupoGTOSOP = [
  {
    groupId: 'GastosOperación',
    headerName: 'Gastos de Operación',
    headerAlign: 'center',
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
    headerAlign: 'center',
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
    headerAlign: 'center',
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
export const columnasORVAS = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', type: 'number', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Otras Reservas"
    { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
    { field: 'col4', headerName: `% ${anio}`, type: 'number', width: 130 },
    {
      field: 'col5',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 150,
    },

    // Columnas para "Rtado Particp. Inv. Perman."
    { field: 'col6', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col7',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col8',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Impto. a la Utilidad"
    { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col10',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col11',
      headerName: `% ${anio - 1}`,
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
    { field: 'col15', headerName: `% ${anio}`, type: 'number', width: 110 },
    {
      field: 'col16',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Indice Combinado"

    {
      field: 'col17',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col18',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
  ]);

// grupo para ORVAS
export const ColumnaGrupoORVAS = [
  {
    groupId: 'OtrasReservas',
    headerName: 'Otras Reservas',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Otras Reservas',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'RtadoParticpInv.Perman',
    headerName: 'Rtado Particp. Inv. Perman.',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rtado Particp. Inv. Perman.',
    children: [{ field: 'col6' }, { field: 'col7' }, { field: 'col8' }],
  },

  {
    groupId: 'ImptoUtilidad',
    headerName: 'Impto. a la Utilidad',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Impto. a la Utilidad',
    children: [{ field: 'col9' }, { field: 'col10' }, { field: 'col11' }],
  },
  {
    groupId: 'RtadoSubsidiariasDiscontinuadas',
    headerAlign: 'center',
    headerName: 'Rtado en Subsidiarias y Op. Discontinuadas',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rtado en Subsidiarias y Op. Discontinuadas',
    children: [{ field: 'col12' }, { field: 'col13' }],
  },
  {
    groupId: 'ResultadoNeto',
    headerName: 'Resultado Neto',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Resultado Neto',
    children: [{ field: 'col14' }, { field: 'col15' }, { field: 'col16' }],
  },
  {
    groupId: 'IndiceCombinado',
    headerName: 'Indice Combinado',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Indice Combinado',
    children: [{ field: 'col17' }, { field: 'col18' }],
  },
];

//columnas para IND GESTION
export const columnasINDGESTION = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Otras Reservas"
    { field: 'col3', headerName: `% ${anio}`, type: 'number', width: 130 },
    { field: 'col4', headerName: `% ${anio - 1}`, type: 'number', width: 130 },
    {
      field: 'col5',
      headerName: `% ${anio}`,
      type: 'number',
      width: 150,
    },
    // Columnas para "Rtado Particp. Inv. Perman."
    { field: 'col6', headerName: `% ${anio - 1}`, type: 'number', width: 110 },
    {
      field: 'col7',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col8',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "EBITDA"
    { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col10',
      headerName: `% ${anio} (VS.PD)`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col11',
      headerName: `% ${anio - 1} (VS.PD)`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Rtado en Subsidiarias y Op. Discontinuadas"
    {
      field: 'col12',
      headerName: `% ${anio} VS.CAP. PATRIM`,
      type: 'number',
      width: 110,
    },
    {
      field: 'col13',
      headerName: `% ${anio - 1} VS.CAP PATRIM`,
      type: 'number',
      width: 140,
    },
  ]);

//grupo para IND GESTION

export const ColumnaGrupoINDGESTION = [
  {
    groupId: 'ApalancamientoRequerido',
    headerName: 'Apalancamiento Requerido',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Apalancamiento Requerido',
    children: [{ field: 'col3' }, { field: 'col4' }],
  },
  {
    groupId: 'RentabilidadAsociada',
    headerName: 'Rentabilidad Asociada',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rentabilidad Asociada',
    children: [{ field: 'col5' }, { field: 'col6' }],
  },

  {
    groupId: 'RentabilidadOperativa',
    headerName: 'Rentabilidad Operativa',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Rentabilidad Operativa',
    children: [{ field: 'col7' }, { field: 'col8' }],
  },
  {
    groupId: 'ebitida',
    headerName: 'EBITDA',
    headerAlign: 'center',
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
export const columnasROE = withNumberFormatter([
  {
    field: 'col1',
    headerName: 'Posición',
    type: 'number',
    align: 'center',
    width: 80,
  },
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
    headerAlign: 'center',
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

export const columnas_COB_EXC_admins = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Cobertura Exc. de Pérdida"
    { field: 'col3', headerName: 'Importe', type: 'number', width: 130 },
    {
      field: 'col4',
      headerName: `Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col5',
      headerName: `Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },

    // Columnas para "Cto Adquisición Directo"
    { field: 'col6', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col7',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col8',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Costo Neto de Adquisición"
    { field: 'col9', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col10',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col11',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para "Cto. Siniestralidad Retenida"
    { field: 'col12', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col13',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col14',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para Resultado Técnico
    { field: 'col15', headerName: 'Importe', type: 'number', width: 110 },
    {
      field: 'col16',
      headerName: `% ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col17',
      headerName: `% ${anio - 1}`,
      type: 'number',
      width: 140,
    },
    // Columnas para Resultado Op. Analogas y C.
    {
      field: 'col18',
      headerName: `Importe ${anio}`,
      type: 'number',
      width: 140,
    },
    {
      field: 'col19',
      headerName: `Importe ${anio - 1}`,
      type: 'number',
      width: 140,
    },
  ]);

// grupo para COB_EXC administrativas
export const ColumnaGrupo_COB_EXC_admins = [
  {
    groupId: 'CoberturaPerdida',
    headerName: 'Cobertura Exc. de Pérdida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Cobertura Exc. de Pérdida',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'Cto Adquisición Directo',
    headerName: 'Cto Adquisición Directo',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto Adquisición Directo',
    children: [{ field: 'col6' }, { field: 'col7' }, { field: 'col8' }],
  },
  {
    groupId: 'Costo Neto de Adquisición',
    headerName: 'Costo Neto de Adquisición',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Costo Neto de Adquisición',
    children: [{ field: 'col9' }, { field: 'col10' }, { field: 'col11' }],
  },

  {
    groupId: 'Cto. Siniestralidad Retenida',
    headerName: 'Cto. Siniestralidad Retenida',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Cto. Siniestralidad Retenida',
    children: [{ field: 'col12' }, { field: 'col13' }, { field: 'col14' }],
  },
  {
    groupId: 'Resultado Técnico',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign: 'center',
    headerName: 'Resultado Técnico',
    description: 'Resultado Técnico',
    children: [{ field: 'col15' }, { field: 'col16' }, { field: 'col17' }],
  },
  {
    groupId: 'ResultadoAnalogasC',
    headerClassName: 'my-super-theme--naming-group',
    headerAlign: 'center',
    headerName: 'Resultado Op. Analogas y C.',
    description: 'Resultado Op. Analogas y C.',
    children: [{ field: 'col18' }, { field: 'col19' }],
  },
];

// Termina Administrativas ---------------------------------------------------------------º-------------------------------------------------------------------------------

// Columnas Siniestros Resultados
export const columnasTotalGeneral = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Cobertura Exc. de Pérdida"
    { field: 'col3', headerName: 'Importe', type: 'number', width: 100 },
    {
      field: 'col4',
      headerName: `% VS. Prima Directa ${anio}`,
      type: 'number',
      width: 250,
    },
    {
      field: 'col5',
      headerName: `% VS. Prima Directa ${anio - 1}`,
      type: 'number',
      width: 250,
    },

    // Columnas para "Cto Adquisición Directo"
    { field: 'col6', headerName: 'Importe', type: 'number', width: 250 },
    {
      field: 'col7',
      headerName: `% de Participación de Mercado`,
      type: 'number',
      width: 320,
    },
  ]);

// grupo para total general
export const ColumnaGrupoTotalGeneral = [
  {
    groupId: 'reclamacionsiniestros',
    headerName: 'Reclamación/Siniestros Directos',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Reclamación/Siniestros Directos',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'eclamacionessiniestrosretenidos',
    headerName: 'Reclamaciones/Siniestros Retenidos',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Reclamaciones/Siniestros Retenidos',
    children: [{ field: 'col6' }],
  },
];

// grupo para total general
export const ColumnaGrupoTotalDemas = [
  {
    groupId: 'siniestrosdirectos',
    headerName: 'Siniestros Directos',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',
    description: 'Reclamación/Siniestros Directos',
    children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' }],
  },
  {
    groupId: 'siniestrosretenidos',
    headerName: 'Siniestros Retenidos',
    headerAlign: 'center',
    headerClassName: 'my-super-theme--naming-group',

    description: 'Reclamaciones/Siniestros Retenidos',
    children: [{ field: 'col6' }],
  },
];
// Termina TOTALES de SINIESTROS ---------------------------------------------------------------º-------------------------------------------------------------------------------

export const columnas_CuentasOrden = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    // Columnas para "Cobertura Exc. de Pérdida"
    {
      field: 'col3',
      headerName: ` Directas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col4',
      headerName: `Cedidas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col5',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col6',
      headerName: `Directas Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col7',
      headerName: `Cedidas Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col8',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col9',
      headerName: `Incr./Disminución`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col10',
      headerName: `Directas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col11',
      headerName: `Cedidas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col12',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col13',
      headerName: `Directas Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col14',
      headerName: `Cedidas Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col15',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col16',
      headerName: `Incr./Disminución`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col17',
      headerName: `Directas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col18',
      headerName: `Cedidas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col19',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col20',
      headerName: `Directas Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col21',
      headerName: `Cedidas Importe ${anio - 1}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col22',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col23',
      headerName: `Incr./Disminución`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col24',
      headerName: `Directas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col25',
      headerName: `Cedidas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col26',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col27',
      headerName: `Directas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col28',
      headerName: `Cedidas Importe ${anio}`,
      type: 'number',
      width: 130,
    },
    {
      field: 'col29',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col30',
      headerName: `Incr./Disminución`,
      type: 'number',
      width: 150,
    },
  ]);

  export const ColumnaGrupocCuentaOrden = [
    {
      groupId: 'reclarecibidas',
      headerName: 'Reclamaciones Recibidas',
      headerAlign: 'center',
      headerClassName: 'my-super-theme--naming-group',
      description: 'Reclamaciones Recibidas',
      children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' },{ field: 'col6' }, { field: 'col7' }, { field: 'col8' },{ field: 'col9' }],
    },
    {
      groupId: 'reclacontingentes',
      headerName: 'Reclamaciones Contingentes',
      headerAlign: 'center',
      headerClassName: 'my-super-theme--naming-group',
      description: 'Reclamaciones Contingentes',
      children: [{ field: 'col10' }, { field: 'col11' }, { field: 'col12' },{ field: 'col13' }, { field: 'col14' }, { field: 'col15' },{ field: 'col16' }],
    },
    {
      groupId: 'reclapagadas',
      headerName: 'Reclamaciones Pagadas',
      headerAlign: 'center',
      headerClassName: 'my-super-theme--naming-group',
      description: 'Reclamaciones Pagadas',
      children: [{ field: 'col17' }, { field: 'col18' }, { field: 'col19' },{ field: 'col20' }, { field: 'col21' }, { field: 'col22' },{ field: 'col23' }],
    },
    {
      groupId: 'recuperacionreclapagadas',
      headerName: 'Recuperación de Reclamaciones Pagadas',
      headerAlign: 'center',
      headerClassName: 'my-super-theme--naming-group',
      description: 'Recuperación de Reclamaciones Pagadas',
      children: [{ field: 'col24' }, { field: 'col25' }, { field: 'col26' },{ field: 'col27' }, { field: 'col28' }, { field: 'col29' },{ field: 'col30' }],
    },
   
  ];

  export const columnasResponsabilidadesVigentes = (anio) =>
  withNumberFormatter([
    { field: 'col1', headerName: 'Posición', align: 'center', width: 80 },
    { field: 'col2', headerName: 'Empresa', width: 230 },
    { field: 'col3', headerName: 'Importe', type: 'number', width: 100 },
    {
      field: 'col4',
      headerName: `Fianzas en Vigor Importe ${anio}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col5',
      headerName: `Fianzas Cedidas en Vigor Importe ${anio}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col6',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col7',
      headerName: `Fianzas en Vigor Importe ${anio}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col8',
      headerName: `Fianzas Cedidas en Importe ${anio}`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col9',
      headerName: `% Cesión`,
      type: 'number',
      width: 150,
    },
    {
      field: 'col10',
      headerName: `Incr./Disminución`,
      type: 'number',
      width: 150,
    },
  ]);

  export const ColumnaGrupocResponsabilidadesVigentes = [
    {
      groupId: 'respvigentes',
      headerName: 'Responsabilidades Vigentes',
      headerAlign: 'center',
      headerClassName: 'my-super-theme--naming-group',
      description: 'Responsabilidades Vigentes',
      children: [{ field: 'col3' }, { field: 'col4' }, { field: 'col5' },{ field: 'col6' }, { field: 'col7' }, { field: 'col8' },{ field: 'col9' }],
    },
    
   
  ];