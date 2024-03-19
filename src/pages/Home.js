import React, { useState, useEffect } from 'react';
import '../css/App.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config/config';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaArrowRight } from 'react-icons/fa';

function Home({ form }) {
  const [error, setError] = useState(null); //pongo el error en un state para mostrarlo en pantalla
  const domainParts = form.username.split('@')[1].split('.');
  const domainName = domainParts[0];
  const [currentDomain] = useState(domainName);

  //acordarse de setear el error en el catch
  return (
    <>
      <Container className='container-custom'>
        {error ? (
          <div>
            Hubo un problema cargando el inicio graficos..error: Recargue la
            pagina por favor{error}
          </div>
        ) : form.role === 'admin' && currentDomain === 'admin' ? (
          // Pantalla para Administrador
          <Container fluid>
            <Row className='justify-content-center'>
              <Col lg={10}>
                <Card
                  className='mb-3'
                  style={{
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <Card.Header className='d-flex align-items-center'>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <h4>
                        <FaUserCircle className='mb-2' size={35} /> Bienvenido
                        Administrador <strong>{form.username}</strong>
                      </h4>
                      <small>
                        Como administrador tendrás acceso a todas las
                        configuraciones.
                      </small>
                    </Col>
                  </Card.Header>
                  <Card.Body>
                    {/* Tarjetas de accesos directos */}
                    <Row xs={1} md={2} lg={4} className='g-4'>
                      {[
                        {
                          nombre: 'Reporte Total',
                          ruta: '/reporteTotal',
                          icono: FaArrowRight,
                        },
                        {
                          nombre: 'Estado Resultados',
                          ruta: '/estadoResultados',
                          icono: FaArrowRight,
                        },
                        {
                          nombre: 'Ramo Administrativas',
                          ruta: '/ramoAdministrativo',
                          icono: FaArrowRight,
                        },
                        {
                          nombre: 'Ramo Caución',
                          ruta: '/ramoCaucion',
                          icono: FaArrowRight,
                        },
                        {
                          nombre: 'Ramo Crédito',
                          ruta: '/ramoCredito',
                          icono: FaArrowRight,
                        },
                        {
                          nombre: 'Ramo Judicial',
                          ruta: '/ramoJudicial',
                          icono: FaArrowRight,
                        },
                        {
                          nombre: 'Ramo Fidelidad',
                          ruta: '/ramoFidelidad',
                          icono: FaArrowRight,
                        },
                      ].map((acceso, idx) => (
                        <Col key={idx}>
                          <Card className='h-100 text-center hover-effect'>
                            <Card.Body>
                              <Card.Title>{acceso.nombre}</Card.Title>
                              <Button
                                as={Link}
                                to={acceso.ruta}
                                className='mt-3 button-custom-gradient'
                              >
                                Ir <acceso.icono />
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        ) : form.role === 'operador' ? (
          // Pantalla para operador
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
              <Card.Body></Card.Body>
            </Card>
          </div>
        ) : (
          // Pantalla para rol de consulta
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
                  <FaUserCircle className='mb-2' size={35} />
                  Bienvenido al perfil de consulta{' '}
                  <strong>{form.username}</strong>
                </Col>
              </Card.Header>
              <Card.Body>
                {' '}
                <div className='d-flex justify-content-center'></div>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}

export default Home;
