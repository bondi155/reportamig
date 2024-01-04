  import React, { useState, useEffect } from 'react';
  import '../css/App.css';
  import { Container, Button, Row, Col, Form } from 'react-bootstrap';
  import axios from 'axios';
  import { API_URL } from '../config/config';
  import GridEval from '../charts/GridEval';
  import Swal from 'sweetalert2';
import Spinner from '../components/Spinner';
  const cmbColumns = [
    { field: 'id_proceso', headerName: 'ID Proceso', width: 120, hide: true },

    {
      field: 'nvl1',
      headerName: 'nvl1.',
      width: 90,
      hide: true,
    },
    {
      field: 'nvl2',
      headerName: 'nvl2',
      width: 90,
    },
    {
      field: 'nvl3',
      headerName: 'nvl3',
      width: 120,
    },
    {
      field: 'nvl4',
      headerName: 'nvl4',
      width: 50,
      hide: true,
    },
    {
      field: 'moneda',
      headerName: 'moneda',
      width: 120,
    },
    {
      field: 'operacion',
      headerName: 'operación',
      width: 100,
    },
    {
      field: 'cve_ramo',
      headerName: 'cve_ramo',
      width: 90,
      hide: true,
    },
    {
      field: 'cvesubramo',
      headerName: 'cvesubramo',
      width: 100,
    },
    {
      field: 'cve_susubramo',
      headerName: 'cve_susubramo',
      width: 90,
      hide: true,
    },
    {
      field: 'importe',
      headerName: 'Importe',
      width: 70,
    },
    {
      field: 'fecha_carga',
      headerName: 'fecha_carga',
      width: 100,
    },
    {
      field: 'estado',
      headerName: 'estado',
      width: 90,
    },
  ];

  function EntradaCmer({form}) {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('temp');
    const [consultaEntrada, setConsultaEntrada] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 


    const [entradaValue, setEntradaValue] = useState('');

    const handleChange = (event) => {
      setEntradaValue(event.target.value);
    };

    //el onchange para el file input
    const saveFile = (e) => {
      if (e.target.files[0]) {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
      } else {
        // restablecer el estado y el nombre del archivo si se cancela la selección si no, dara error
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
          const res = await axios.post(
            `${API_URL}/uploadfile`,
            formData,
          );
          console.log("respuesta", res.data);
          if (res.status === 200 && res.data.code === 'SUCCESS') {
            Swal.fire('Procesado!!', `Archivo txt ${res.data.message}`, 'success');
        } else {
          // Si la respuesta no es exitosa, muestra una alerta.
          Swal.fire('Error', `Error al procesar el archivo: ${res.data.message}`, 'error');
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
          } else if (error.response && error.response.data.code === 'ERROR_READ_TXT'){
            Swal.fire({
              icon: 'error',  
              title: 'Oops...',
              text: `${error.response.data.message}`,
            });
          }
      } finally {
        setIsLoading(false);
      }
    };
    
    //get data from db de entrada de txt
const getCmerData = async () => {
  try {
    setIsLoading(true); 
    const response = await axios.get(`${API_URL}/getData`, {});
    setConsultaEntrada(response.data);
  } catch (err) {
    if (err.response && err.response.status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Security Message',
        text: 'Token expire, please login again',
      });
    } else {
      console.error(err);
      Swal.fire('Ooops', 'Unable to get data', 'error');
    }
  } finally {
    setIsLoading(false);
  }
};


    useEffect(() => {
      getCmerData();
    }, []);

    const rows = consultaEntrada.map((row) => ({
      id: row.id_proceso,
      ...row,
    }));

    return (
      <>
      <div> 
       
        <Container className='container-custom'>
          <h2>Carga de archivo de entrada</h2>
          <Form onSubmit={uploadFile}>        
          <Row className='align-items-center'>
            <Col xs={12} sm={12} md={8} lg={9} className='mt-3'>
              <Form.Group controlId='formFileLg' className='mb-3'>
                <Form.Control type='file' size='md' onChange={saveFile} />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} className='mt-0'>
              <select required className='form-select' onChange={handleChange}>
                <option value=''>Tipo de Archivo</option>
                <option  value='cmer'>Resultados</option>
                <option value='cmbg'>Balance</option>
              </select>
            </Col>
          </Row>
          <Col xs={{span : 4, offset:5}} sm={6} md={2} lg={{ spin: 2, offset: 5 }} className='mt-2'>
              <Button variant='outline-secondary' type='submit' >
                Cargar
              </Button>
            </Col>
          </Form>
        </Container>
        <div className='evaluation-grid'>
          <div className='mt-5 mb-3 center-text'></div>
          <GridEval
            rows={rows}
            columnsVar={cmbColumns}
            fileNameVar='InformacionDeEntrada'
            showDeleteColumn={false}
          />
        </div>
        </div>
      </>
    );
  }

  export default EntradaCmer;
