import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { API_URL } from '../config/config.js';
import Swal from 'sweetalert2';
import GridCia from '../charts/GridCia.js';
function GridEmpresas () {

const [axiosResponse, setAxiosResponse] = useState([]);

  const [, setIsLoading] = useState(true);

  const archivosColumnas = [
    {
      field: 'id_cia',
      headerName: 'ID Compañia.',
      width: 100,
      hide: true,
    },
    {
      field: 'nombre_cia',
      headerName: 'Nombre Compañia',
      width: 290,
      editable: true,

    },
    {
      field: 'cod_cia',
      headerName: 'Codigo Compañia',
      width: 300,
    }
  ];

  useEffect(() => {
    const asyncCall = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/amCompanias`, {});
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

 const handleProcessRowUpdate = async (newRow, oldRow) => {
  try {
    // Acá hacés el PUT o PATCH para actualizar en backend
    await axios.put(`${API_URL}/amCompanias/${newRow.id_cia}`, newRow);

    return newRow; // importante retornar el nuevo row
  } catch (error) {
    console.error('Error actualizando fila:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: error.toString(),
    });
    return oldRow; // si falla, devolvés el viejo
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
                    Empresas
                  </Card.Header>
                
                    <Card.Body>
                      <GridCia
                        rows={axiosResponse}
                        columnsVar={archivosColumnas}
                        fileNameVar='Gestor de Archivos'
                        autoHeight
                        showDeleteColumn={false}
                        onProcessRowUpdate={handleProcessRowUpdate}
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


export default GridEmpresas;