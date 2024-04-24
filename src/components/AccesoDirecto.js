import React from 'react';
import {Row, Col, Card } from 'react-bootstrap';
import { Button } from '@mui/material'; 
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const AccesoDirecto = () => (
  <Row xs={1} md={2} lg={4} className='g-4'>
  {[
    {
      nombre: 'Total',
      ruta: '/reporteTotal',
      icono: FaArrowRight,
    },
    {
      nombre: 'Estado Resultados',
      ruta: '/estadoResultados',
      icono: FaArrowRight,
    },
    {
      nombre: 'Estado de Situación Financiera',
      ruta: '/estadoFinanciero',
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
      nombre: 'Ramo Judiciales',
      ruta: '/ramoJudicial',
      icono: FaArrowRight,
    },
    {
      nombre: 'Ramo Fidelidad',
      ruta: '/ramoFidelidad',
      icono: FaArrowRight,
    },
    {
      nombre: 'Siniestros Resultados',
      ruta: '/siniestroResultados',
      icono: FaArrowRight,
    },
    {
      nombre: 'Siniestros Cuenta Orden',
      ruta: '/siniestroCtaOrden',
      icono: FaArrowRight,
    },
  ].map((acceso, idx) => (
    <Col key={idx}>
  <Link to={acceso.ruta} style={{ textDecoration: 'none' }}> {/* Envuelve el Card con Link y elimina la decoración del texto */}
    <Card className='h-100 text-center hover-effect'>
      <Card.Body>
        <Card.Title>{acceso.nombre}</Card.Title>
        <Button
          className='mt-3'
          color='primary'
        >
        <acceso.icono />
        </Button>
      </Card.Body>
    </Card>
  </Link>
</Col>
  ))}
</Row>
);

export default AccesoDirecto;