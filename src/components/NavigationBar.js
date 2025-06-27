import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import logo from '../components/img/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import '../css/App.css';
import { RiListSettingsFill } from 'react-icons/ri';
import { API_URL } from '../config/config.js';

function NavigationBar({ setIslogin, form }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    axios.defaults.headers.common['Authorization'] = '';
    setIslogin(false);
    navigate('/');
  };

  const [navOpen, setNavOpen] = useState(false);

  const [role, SetRole] = useState('');

  const handleLinkClick = () => {
    setNavOpen(false);
  };

  const handleToggleClick = () => {
    setNavOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const usersRole = async () => {
      try {
        const response = await axios.get(`${API_URL}/getRoleUsuario`, {
          params: { username: form.username },
        });
        SetRole(response.data.role);
      } catch (error) {
        console.log(error);
      }
    };
    usersRole();
  }, [form.username]);


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
            {role === 'admin' && (
              <>
                <NavDropdown
                  title={
                    <>
                      {' '}
                      <RiListSettingsFill style={{ fontSize: '1.3rem' }} /> Menú
                      Avanzado
                    </>
                  }
                  id='basic-nav-dropdown'
                >
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/userCreation'
                  >
                    Administración de Usuarios{' '}
                  </NavDropdown.Item>{' '}
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/gestorArchivosCargados'
                  >
                    Gestor de Archivos Cargados
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/listaErrores'
                  >
                    Listado de Errores de Carga{' '}
                  </NavDropdown.Item>{' '}
                    <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/GridEmpresas'
                  >
                    Cambio de Nombres Empresas{' '}
                  </NavDropdown.Item>{' '}
                </NavDropdown>
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
                    to='/estadoFinanciero'
                  >
                    Estado Sit. Financiera
                  </NavDropdown.Item>{' '}
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
                    Ramo Judiciales{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/ramoFidelidad'
                  >
                    Ramo Fidelidad{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/siniestroResultados'
                  >
                    Siniestros Resultados{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/siniestroCtaOrden'
                  >
                    Siniestros Cuenta Orden{' '}
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    onClick={handleToggleClick}
                    to='/primasCantidad'
                  >
                    Cartera - Primas emitidas{' '}
                  </NavDropdown.Item>
                </NavDropdown>
                <Link
                  to='/entrada_txt_cmer_cmbg'
                  className='nav-link'
                  onClick={handleLinkClick}
                >
                  Carga Archivo TXT
                </Link>
              </>
            )}
            {role === 'consulta' && (
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
            {role === 'operador' && (
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
