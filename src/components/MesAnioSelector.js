import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Grid, Button } from '@mui/material';
import { CiCircleCheck } from 'react-icons/ci';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 

const MesAnioSelector = ({ onFechaCambio, anioInicial, mesInicial }) => {
  dayjs.locale('es_PE');
  const [fecha, setFecha] = useState(dayjs(new Date(anioInicial, mesInicial - 1)));
  const [confirmado, setConfirmado] = useState(true);

  const handleFechaCambio = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setConfirmado(false);  // Reset confirmación al cambiar fecha
  };

  const handleConfirmarClick = () => {
    if (fecha) {
      onFechaCambio({
        anio: fecha.year(),
        mes: fecha.month() + 1,
      });
      setConfirmado(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <DatePicker
            views={['year', 'month']}
            label="Seleccione Mes y Año"
            value={fecha}
            onChange={handleFechaCambio}
            slotProps={{
              textField: {
                variant: 'outlined',
                sx: {
                  input: { color: confirmado ? 'green' : 'default' },  // Cambio de color según estado
                },
              },
            }}
            minDate={dayjs('2019-01-01')}
            maxDate={dayjs('2030-12-31')}
          />
        </Grid>
        <Grid item>
          <Button
            color="primary"
            endIcon={<CiCircleCheck />}
            onClick={handleConfirmarClick}
            size="small"
          > Confirmar
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default MesAnioSelector;
