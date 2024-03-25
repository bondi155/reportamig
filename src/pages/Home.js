import React, { useState } from 'react';
import '../css/App.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
//import axios from 'axios';
//import { API_URL } from '../config/config';
import { FaUserCircle} from 'react-icons/fa';
import AccesoDirecto from '../components/AccesoDirecto';
function Home({ form }) {
  const [error,] = useState(null); //pongo el error en un state para mostrarlo en pantalla
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
                  <AccesoDirecto />
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
              <Card.Body>
                  {/* Tarjetas de accesos directos */}
                  <AccesoDirecto />
              </Card.Body>
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
                 {/* Tarjetas de accesos directos */}
                 <AccesoDirecto />
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}

export default Home;
