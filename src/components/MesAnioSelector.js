// MesAnioSelector.js
import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Grid, TextField, Button } from '@mui/material';
import { CiCircleCheck  } from 'react-icons/ci';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 

const MesAnioSelector = ({ onFechaCambio, anioInicial, mesInicial }) => {
  dayjs.locale('es_PE');
// Pasamos como props Mes y Año
  const [fecha, setFecha] = useState(dayjs(new Date(anioInicial, mesInicial - 1)));

  const handleFechaCambio = (nuevaFecha) => {
    // Actualiza la fecha cada vez que el usuario elige un nuevo mes/año
    setFecha(nuevaFecha);
  };

  const handleConfirmarClick = () => {
    // Llama al método onFechaCambio cuando el usuario hace clic en el botón de confirmación
    if (fecha) {
      onFechaCambio({
        anio: fecha.year(),
        mes: fecha.month() + 1, // Sumamos uno porque dayjs empieza los meses desde 0
      });
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
            renderInput={{
              TextField: (props) => <TextField {...props} />
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
          > Periodo
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default MesAnioSelector;