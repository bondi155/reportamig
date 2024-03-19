import React from 'react';
import {Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const AccesoDirecto = () => (
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
);

export default AccesoDirecto;