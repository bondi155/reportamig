import React, { useState, useEffect } from 'react';
import '../css/App.css';
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Card,
} from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
//import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar';
//import 'bootswatch/dist/zephyr/bootstrap.min.css';
import { FaUpload } from 'react-icons/fa'; // Asegúrate de instalar react-icons

function EntradaCmer({ form }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('temp');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [entradaValue, setEntradaValue] = useState('');

  const handleChange = (event) => {
    setEntradaValue(event.target.value);
  };

  //El onchange para el file input
  const saveFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      // Restablecer el estado y el nombre del archivo si se cancela la selección si no, dara error
      setFile(null);
      setFileName('temp');
    }
  };

  //upload txt
  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire('Elija un archivo .txt por favor');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('entradaValue', entradaValue);
    formData.append('usuario', form.username);
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/uploadfile`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      if (res.status === 200 && res.data.code === 'SUCCESS') {
        Swal.fire('Procesado!!', `Archivo txt ${res.data.message}`, 'success');
      } else {
        // Si la respuesta no es exitosa, muestra una alerta.
        Swal.fire(
          'Error',
          `Error al procesar el archivo: ${res.data.message}`,
          'error'
        );
      }
      if (res.status === 500 && res.data.code === 'ERROR_READ_TXT') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Se produjo un error. en la lectura del archivo: ${res.data.message}`,
        });
      }
    } catch (error) {
      console.error('Error en la respuesta:', error.response);
      if (error.response && error.response.data.code === 'ERROR_INSERT') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error.response.data.message}`,
        });
      } else if (
        error.response &&
        error.response.data.code === 'ERROR_READ_TXT'
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error.response.data.message}`,
        });
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0); // Resetear el progreso después de la carga
    }
  };

  return (
    <>
      <div>
        <Container className='container-custom'>
          <Form onSubmit={uploadFile}>
            <Card>
              <Card.Header>
                <h3>Carga de archivo de entrada</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Seleccione el archivo TXT correspondiente a CMER o CMBG.
                </Card.Text>
                <Row className='gx-2 gy-3 align-items-center'>
                  {/* Input de archivo */}
                  <Col lg={7} md={8} sm={12} className='mt-3'>
                    <Form.Group controlId='formFileLg' className='mb-3'>
                      <Form.Control type='file' size='sm' onChange={saveFile} />
                    </Form.Group>
                  </Col>
                  {/* Selector de tipo de archivo */}
                  <Col lg={3} md={4} sm={6} xs={12} className='mt-0'>
                    <Form.Group
                      controlId='formFileTypeSelect'
                      className='mb-lg-0'
                    >
                      <Form.Select size='sm' required onChange={handleChange}>
                        <option value=''>Tipo de Archivo</option>
                        <option value='cmer'>Resultados</option>
                        <option value='cmbg'>Balance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* Botón */}
                  <Col
                    lg={2}
                    md={12}
                    sm={12}
                    xs={12}
                    className='d-flex justify-content-center mt-5 mt-sm-1'
                  >
                    <Button
                      className='button-custom-gradient'
                      size='sm'
                      type='submit'
                    >
                      <FaUpload className='mb-1' /> Cargar Archivo
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
          <Modal show={isLoading} centered backdrop='static' keyboard={false}>
            <Modal.Body>
              <div className='d-flex justify-content-center align-items-center'>
                <ProgressBar
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  style={{ width: '100%' }}
                />
              </div>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </>
  );
}

export default EntradaCmer;
