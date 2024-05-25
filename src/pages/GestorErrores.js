import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import GridUsers from '../charts/GridUsers.js';
import { API_URL } from '../config/config.js';
import Swal from 'sweetalert2';

function GestorErrores() {
  const [axiosResponse, setAxiosResponse] = useState([]);

  const [, setIsLoading] = useState(true);

  const archivosColumnas = [
    {
      field: 'id_proceso',
      headerName: 'ID Proceso.',
      width: 100,
      hide: true,
    },

    {
      field: 'ruta_arch',
      headerName: 'Nombre Archivo',
      width: 300,
    },
    {
      field: 'cod_err',
      headerName: 'Cod. Error',
      width: 250,
    },
    {
      field: 'msg_err_orig',
      headerName: 'Error',
      width: 250,
    },
    {
      field: 'f_err',
      headerName: 'Fecha Error',
      width: 200,
      valueFormatter: ({ value }) => {
        const date = new Date(value);
        date.setHours(date.getHours() - 5);
        return new Intl.DateTimeFormat('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      },
    },
  ];

  useEffect(() => {
    const asyncCall = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/getErroresLista`, {});
        setAxiosResponse(response.data);
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
  }, []);

  //console.log(axiosResponse);


  return (
    <>
      <Container className='container-custom mb-5'>
        <Row>
          <div className='usuarios-grid'>
            <Row className='mt-5 justify-content-md-center'>
              <Col md={12} lg={8}>
                <Card>
                  <Card.Header className='justify-content-center' as='h3'>
                   Lista de errores
                  </Card.Header>
                
                    <Card.Body>
                      <GridUsers
                        rows={axiosResponse}
                        columnsVar={archivosColumnas}
                        fileNameVar='Lista Errores'
                        autoHeight
                        showDeleteColumn={false}
                      />
                    </Card.Body>
                </Card>
              </Col>
            </Row>  
          </div>
        </Row>
      </Container>
    </>
  );
}

export default GestorErrores;
