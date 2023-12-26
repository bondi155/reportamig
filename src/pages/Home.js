import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import { FaUserCircle } from 'react-icons/fa';

function Home({ form }) {
  const [totalCalif, setTotalCalif] = useState(0);
  const [error, setError] = useState(null); //pongo el error en un state para mostrarlo en pantalla
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];
  const [currentDomain, setCurrentDomain] = useState(domainName);
  const [dateEval, setDateEval] = useState([]);

 // const labelsNumerics = ['2', '3', '4', '5', '6']; //, '7'
 // const labelsAlphabets = ['A', 'B', 'B+', 'B-', 'C', 'NP'];
 // const labelsAlphabetsTsm = ['A', 'B', 'B+', 'C', 'D'];

//acordarse de setear el error en el catch
  return (
    <>
      <Container className='container-custom'>
        {error ? (
          <div>
            Hubo un problema cargando los graficos..error: Recargue la pagina
            por favor{error}
          </div>
        ) : form.role === 'admin' ? (
          //pantalla para Administrador
          <div>
            {' '}
            <Card
              className='mb-3'
              style={{
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa', // Un gris claro
              }}
            >
              <Card.Header className='d-flex align-items-center'>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <h4>
                    <FaUserCircle className='mb-2' size={35} /> Bienvenido
                    Administrador <strong>{form.username}</strong>
                  </h4>
                </Col>
              </Card.Header>
              <Card.Body>
                {currentDomain === 'admin' ? (
                  <>
                    {' '}
                    <small>
                      Como administrador tendras accesso a los datos de todas
                      las empresas :{' '}
                    </small>{' '}
                  </>
                ) : (
                  //
                  <Row>
                    {/* Tarjeta para la Total de datos */}
                    <Col xs={12} sm={6} lg={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>blaa</Card.Title>
                          <div>
                            <strong>{currentDomain}</strong> desde{' '}
                            <strong>01/2023</strong>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    {/* Tarjeta para la Última Evaluación */}
                    <Col xs={12} sm={6} lg={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>array de datos mapeado</Card.Title>
                          {dateEval.map((index, key) => (
                            <div key={key}>
                              <strong>{index.nombreColumna}</strong>
                              <h2>{index.nombreColumna2}</h2>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </div>
        ) : form.role === 'operador' ? (
          //pantalla para operador
          <div>
            {' '}
            <Card
              className='mb-3'
              style={{
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa', // Un gris claro
              }}
            >
              <Card.Header>
                <FaUserCircle className='mb-2' size={35} /> Bienvenido operador{' '}
                <strong>{form.username}</strong>
              </Card.Header>
              <Card.Body>
              </Card.Body>
            </Card>
          </div>
        ) : (
          //pantalla para rol de consulta
          <>
            <Card
              className='mb-3'
              style={{
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8f9fa', // Un gris claro
              }}
            >
              <Card.Header className='d-flex align-items-center'>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <FaUserCircle className='mb-2' size={35} />Bienvenido al perfil de consulta {' '}
                  <strong>{form.username}</strong>
                </Col>
              </Card.Header>
              <Card.Body>  <div className='d-flex justify-content-center'>
            </div></Card.Body>
            </Card>
          </>
        )}
      </Container>
     
    </>
  );
}

export default Home;
