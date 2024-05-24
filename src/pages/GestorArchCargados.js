import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import GridEval from '../charts/GridEval';
import { API_URL } from '../config/config.js';
import Swal from 'sweetalert2';

function GestorArchCargados() {
  const [axiosResponse, setAxiosResponse] = useState([]);

  const [, setIsLoading] = useState(true);

  const archivosColumnas = [
    {
      field: 'id',
      headerName: 'ID Proceso.',
      width: 100,
      hide: true,
    },
    {
      field: 'estatus',
      headerName: 'Estatus',
      width: 90,
    },
    {
      field: 'ruta_arch',
      headerName: 'Nombre Archivo',
      width: 300,
    },
    {
      field: 'f_proc',
      headerName: 'Fecha Procesamiento',
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
        const response = await axios.get(`${API_URL}/getArchivosCargados`, {});
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Esta Seguro de Borrar este Archivo?',
      text: 'Esta acción no se podra revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1976d2d9',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, lo quiero borrar!',
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/deleteArchivoTxt/${id}`, {});
        setAxiosResponse(axiosResponse.filter((archivo) => archivo.id !== id));
        Swal.fire('Borrado!', 'El Registro fue borrado', 'success');
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un error al borrar el Archivo',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Container className='container-custom mb-5'>
        <Row>
          <div className='usuarios-grid'>
            <Row className='mt-5 justify-content-md-center'>
              <Col md={12} lg={8}>
                <Card>
                  <Card.Header className='justify-content-center' as='h3'>
                    Archivos Cargados
                  </Card.Header>
                  <Card.Body>
                    <GridEval
                      rows={axiosResponse}
                      columnsVar={archivosColumnas}
                      fileNameVar='Archivos CMER-CMBG'
                      autoHeight
                      showDeleteColumn={true}
                      onDelete={handleDelete}
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

export default GestorArchCargados;
