import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';
//import { BsFillCloudUploadFill } from 'react-icons/bs';

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

function EntradaCmer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('temp');
  const [consultaEntrada, setConsultaEntrada] = useState([]);

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
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    try {
      const res = await axios.post(`${API_URL}/uploadfile`, formData);
      if (res.status === 200 && res.data.code === 'SUCCESS') {
        Swal.fire(
          'Good job!',
          `Archivo txt ${res.data.message}`,
          'success'
        );
        //alert(`Excel file processed successfully ${res.data.message}`);
      }
    } catch (error) {
      // console.log(ex);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Se produjo un error. Detalles: ${error.message}`,
      });
    }
  };

  //get data from db de entrada de txt
  const getCmerData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getData`, {});
      setConsultaEntrada(response.data);
      //console.log('informacion obtenida');
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
      <Container className='container-custom'>
        <h2>Carga de archivo de entrada</h2>
        <Row className='align-items-center'>
          {' '}
          <Col xs={9} sm={10} lg={10} className='mt-3'>
            {' '}
            <Form.Group controlId='formFileLg' className='mb-3'>
              <Form.Control type='file' size='md' onChange={saveFile} />
            </Form.Group>
          </Col>
          <Col xs={1} sm={2} lg={2} className='mt-0'>
            {' '}
            {/* Ajusta los valores de span según lo necesites */}
            <Button variant='outline-secondary' onClick={uploadFile}>
              Cargar
            </Button>
          </Col>
        </Row>
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
    </>
  );
}

export default EntradaCmer;
