import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function PlaneSpinner({ size = 40 }) { // Puedes ajustar el tamaño predeterminado según necesites
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh', // Ajusta la altura vertical al 50% de la altura de la ventana
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}

export default PlaneSpinner;
