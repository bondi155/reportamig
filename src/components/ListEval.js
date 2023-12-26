import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from '../config/config';
import {Button} from 'react-bootstrap';
function ListEval({ form, titulotd1, titulotd2 }) {
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];
  const [ListHome, setListHome] = useState([]);

  const GetList = async () => {
    try {
      const listResponse = await axios.get(`${API_URL}/listLastEvals`, {
        params: {
          domainName,
        },
      });
      setListHome(listResponse.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Ooops', 'Unable to get data', 'error');
    }
  };

  useEffect(() => {
    GetList();
        //no depende de ninguna const
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container className='mt-4 mb-2'>
      <Grid item sm={12} xs={12} md={12} lg={12}> 
        <h2>
          <strong>Últimas Evaluaciones  </strong>
          <Link to='/consultAirlineGrid'>
            <Button variant='dark' size='sm'>
              Ver Todos los registros
            </Button>
          </Link>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}> 
        <TableContainer component={Paper} >
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 90 }}>{titulotd1}</TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell sx={{ width: 120 }}>{titulotd2}</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell>Resultado</TableCell>
                <TableCell sx={{ width: 110 }}>Reporte</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ListHome.map((consul, key) => (
                <TableRow key={key}>
                  <TableCell>{domainName === 'volaris' ? <strong>{consul.no_ambassador}</strong> : <strong>{consul.no}</strong>}</TableCell>
                  <TableCell>{consul.full_name}</TableCell>
                  <TableCell>{domainName === 'volaris' ? consul.test_type : consul.no_ambassador}</TableCell>
                  <TableCell>{consul.first_exam}</TableCell>
                  <TableCell align='center'><strong>{consul.exam_calif}</strong></TableCell>
                  <TableCell>{consul.result}</TableCell>
                  <TableCell>
                    <a href={consul.report_url} target='_blank' rel='noopener noreferrer'>
                      Report Card
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      </Grid>
    </Grid>
  );
}

export default ListEval;
