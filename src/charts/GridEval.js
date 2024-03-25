import React from 'react';
import 'react-data-grid/lib/styles.css';
import Box from '@mui/material/Box';
import { esES as coreBgBG } from '@mui/material/locale';
import {
  DataGrid,
  esES,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../css/App.css';
import { BsFillTrashFill } from 'react-icons/bs';
import { esES as pickersBgBG } from '@mui/x-date-pickers/locales';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#000000' },
    },
  },
  esES, // x-data-grid translations
  pickersBgBG, // x-date-pickers translations
  coreBgBG // core translations
);

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}

function GridEval({
  rows,
  columnsVar,
  onDelete,
  showDeleteColumn = false,
  columnGroupingModel,
}) {
  let columns = [...columnsVar];
  if (showDeleteColumn) {
    const deleteButtonColumn = {
      field: 'delete',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <BsFillTrashFill
          size={25}
          color='black'
          onClick={() => onDelete(params.row.id)}
          style={{ cursor: 'pointer' }}
        />
      ),
    };
    columns.push(deleteButtonColumn);
  }
  //console.log(columnsVar); //
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        mt: 0,
        pb: 5,
        alignGrids: 'center',
        '& .my-super-theme--naming-group': {
          backgroundColor: '#FAF6F6',
          fontSize: 20,
          fontWeight: 'bold',
          border: 1,
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <DataGrid
          sx={{
            width: '100%',
            backgroundColor: 'white',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
          }}
          density='compact'
          rowHeight={35} //height de rows
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            columns: {
              columnVisibilityModel: {
                col1: true,
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          slots={{
            toolbar: (props) => <CustomToolbar {...props} />,
          }}
          disableRowSelectionOnClick
          columnGroupingModel={columnGroupingModel}
          experimentalFeatures={{ columnGrouping: true }}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </ThemeProvider>
    </Box>
  );
}

export default GridEval;
