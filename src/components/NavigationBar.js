import React, { useState } from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import logo from '../components/img/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import '../css/App.css';

function NavigationBar({ setIslogin, form }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    axios.defaults.headers.common['Authorization'] = '';
    setIslogin(false);
    navigate('/');
  };

  const [navOpen, setNavOpen] = useState(false);

  const handleLinkClick = () => {
    setNavOpen(false);
  };

  const handleToggleClick = () => {
    setNavOpen((prevOpen) => !prevOpen);
  };
  return (
    <>
      <Navbar
        collapseOnSelect
        fixed='top'
        expand='md'
        data-bs-theme='light'
        className='mb-3 navbar-custom-bg px-2'
        expanded={navOpen}
      >
        <Link to='/home' className='nav-link'>
          <Navbar.Brand className='font-weight-bold text-muted'>
            <img
              src={logo}
              width='68'
              height='50'
              className='d-inline-block align-top'
              alt='React Bootstrap logo'
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle onClick={handleToggleClick} />
        <Navbar.Collapse className='justify-content-end'>
          <Nav>
            {form.role === 'admin' && (
              <>
                <Link
                  to='/userCreation'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Admin. de Usuarios
                </Link>
                <NavDropdown title='Reportes' id='basic-nav-dropdown'>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/reporteTotal'
                  >
                    Total
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/estadoResultados'
                  >
                    Estado Resultados
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/ramoAdministrativo'
                  >
                    Ramo Administrativas{' '}
                  </NavDropdown.Item>
                 
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/ramoCaucion'
                  >
                    Ramo Caución{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/ramoCredito'
                  >
                    Ramo Credito{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/ramoJudicial'
                  >
                      Ramo Judicial{' '}
                    </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/ramoFidelidad'
                  >
                    Ramo Fidelidad{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href='#action/3.4'>
                    Configuracion de reportes{' '}
                  </NavDropdown.Item>
                </NavDropdown>
                <Link
                  to='/entrada_txt_cmer_cmbg'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Conf. Archivo de entrada
                </Link>
              </>
            )}
            {form.role === 'consulta' && (
              <>
                <Link
                  to='/userCreation'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Perfil
                </Link>
                <Link
                  to='/consultaGrid'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Consulta de datos
                </Link>

                {/*  <Link
              to='/consolidateInformation'
              className='nav-link'
              onClick={handleLinkClick}
            >
              Consolidate
            </Link>*/}
              </>
            )}
            {form.role === 'operador' && (
              <>
                <Link
                  to='/userCreation'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Perfil
                </Link>
                <Link
                  to='/consultaGrid'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Consulta de datos
                </Link>
                <Link
                  to='/entrada_txt_cmer_cmbg'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Conf. Archivo de entrada
                </Link>
                {/*  <Link
              to='/consolidateInformation'
              className='nav-link'
              onClick={handleLinkClick}
            >
              Consolidate
            </Link>*/}
              </>
            )}
            <Button
              variant='dark'
              className='logout-button mx-auto'
              onClick={handleLogout}
              style={{ width: 'auto' }}
              size='sm'
            >
              <FiLogOut className='me-1 mb-1' />{' '}
            </Button>
            &nbsp;
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavigationBar;
