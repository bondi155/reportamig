import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button, Card } from 'react-bootstrap';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';  USUARIO CON RECOIL O SECUENCIAL , VER ESO PARA LOS ROLES
import { API_URL } from '../config/config.js';
import GridUsers from '../charts/GridUsers.js';
import Swal from 'sweetalert2';
import { GoPasskeyFill } from 'react-icons/go';
import { FaUserPlus } from 'react-icons/fa6';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const userColumns = [
  { field: 'id', headerName: 'ID', width: 150 },
  {
    field: 'user',
    headerName: 'Usuario',
    width: 250,
    editable: false,
  },
  {
    field: 'role',
    headerName: 'Rol',
    width: 150,
    editable: false,
  },
];
function UserCreate({ userCreate, setUserCreate, form }) {
  const [listUser, setListUser] = useState([]);

  //const navigate = useNavigate();
  const [valueTab, setValueTab] = useState('createUser');

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const [newPass, setNewPass] = useState('');

  const handleUserInput = (e) => {
    setUserCreate({
      ...userCreate,
      [e.target.name]: e.target.value,
    });
  };

  //creacion del usuario con rol y usuario
  const addNewUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/createUser`, {
        username: userCreate.username,
        role: userCreate.role,
        password: userCreate.password,
      });
      Swal.fire('Buen trabajo!', 'Usuario Creado!', 'success');
    } catch (err) {
      if (err.response.data.code === 'USER_DUPLI') {
        Swal.fire('Este nombre de usuario ya existe ,por favor elija otro');
      }
    }
  };

  //llamada para traer info y mostrarla en tabla
  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getUserList`);
      setListUser(response.data);
      //   console.log(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje de seguridad',
          text: 'El token expiró, por favor inicie sesión nuevamente',
        });
      } else {
        Swal.fire(
          'Ooops',
          'No se puede traer la información desde la BD',
          'error'
        );
        // console.log('Error', err);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  //resetar contraseña
  const passReset = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/resetPass`, {
        username: form.username,
        password: newPass,
      });

      Swal.fire(
        'Contraseña Actualizada!',
        `Su nueva contraseña es :${newPass}`,
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Ooops',
        'Fallo al actualizar su contrasena , salga del sistema e intente nuevamente',
        'error'
      );
    }
  };

  //borrar usuario
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No se puede revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borralo!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/deleteUser/${id}`);
        setListUser(listUser.filter((user) => user.id !== id));
        Swal.fire('Borrado!', 'El usuario fue borrado.', 'success');
      }
    });
    try {
    } catch (err) {
      console.error(err);
      Swal.fire('Ooops', 'No se puede traer la info de los usuarios', 'error');
    }
  };

  return (
    <>
      {form.role === 'admin' ? (
        <Container className='container-custom mb-5'>
          <Box
            sx={{ width: '100%', bgcolor: 'background.paper', mt: 5, pt: 0 }}
          >
            <Tabs value={valueTab} onChange={handleChange} centered>
              <Tab label='Creación de Usuario' value='createUser' />
              <Tab label='Reseteo de Contraseña' value='resetPassword' />
            </Tabs>
            {valueTab === 'createUser' && (
              <div>
                <form onSubmit={addNewUser}>
                  <Row className="justify-content-md-center" > 
                  <Col lg={8} md={12}> 
                  <Card className='card-body-xs-padding'>
                    <Card.Header>
                      <h3> Administración de Usuarios</h3>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Creación de Usuario</Card.Title>
                    </Card.Body>
                    <Row className='mt-1 mb-3'>
                      {/* Usuario */}
                      <Col
                        lg={{ span: 3, offset: 1 }}
                        md={{ span: 3, offset: 1 }}
                        sm={12}
                        xs={12}
                      >
                        <Form.Group className='mb-3'>
                          <Form.Control
                            type='text'
                            name='username'
                            size='sm'
                            required
                            placeholder='Usuario'
                            onChange={handleUserInput}
                          />
                        </Form.Group>
                      </Col>
                      {/* Rol */}
                      <Col lg={3} md={3} sm={12} xs={12}>
                        <Form.Group className='mb-3'>
                          <Form.Select
                            aria-label='role'
                            size='sm'
                            value={userCreate.role}
                            name='role'
                            required
                            onChange={handleUserInput}
                          >
                            <option disabled value=''>
                              Tipo de Usuarios
                            </option>
                            <option value='operador'>Operador</option>
                            <option value='consulta'>Consulta</option>
                            <option value='admin'>Administrador</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      {/* Contraseña */}
                      <Col lg={3} md={4} sm={6} xs={12}>
                        <Form.Group className='mb-3'>
                          <Form.Control
                            type='password'
                            required
                            size='sm'
                            name='password'
                            autoComplete='current-password'
                            placeholder='Contraseña'
                            onChange={handleUserInput}
                          />
                        </Form.Group>
                      </Col>
                      {/* Botón Crear Usuario */}
                      <Col
                        lg={2}
                        md={12}
                        sm={12}
                        xs={12}
                        className='d-flex justify-content-center mt-2 mt-lg-0 d-lg-block'
                        >
                        <Button
                          className='button-custom-gradient' // Aquí asegúrate de que el mt-md-2 y mt-lg-0 estén en el botón si se necesita
                          type='submit'
                          size='sm'
                        >
                          <FaUserPlus className='mb-1' /> Crear
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                  </Col>
                  </Row>
                </form>
              </div>
            )}
            {valueTab === 'resetPassword' && (
              <div>
                <form onSubmit={passReset}>
                <Row className="justify-content-md-center" > 
                  <Col lg={8} md={12}> 
                  <Card>
                    <Card.Header>
                      <h3>Administración de Usuarios</h3>{' '}
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Reseteo de Contraseña</Card.Title>
                    </Card.Body>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className='d-flex justify-content-center'
                      >
                        <input
                          type='hidden'
                          name='username'
                          value='elNombreDeUsuarioAquí'
                        />
                        <Form.Group
                          className='mb-4 me-2'
                          style={{ maxWidth: '300px' }}
                        >
                          <Form.Control
                            type='password'
                            required
                            placeholder='Contraseña Nueva'
                            autoComplete='new-password'
                            size='sm'
                            onChange={(e) => setNewPass(e.target.value)}
                          />
                        </Form.Group>
                        <Button
                          className='mb-4 button-custom-gradient'
                          type='submit'
                          size='sm'
                        >
                          <GoPasskeyFill /> Actualizar
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                  </Col>
                  </Row>
                </form>
              </div>
            )}
          </Box>
          <div className='usuarios-grid'>
            <Row className='mt-5 justify-content-md-center'>  
            <Col md={12} lg={8}>
        <Card>
          <Card.Header className='justify-content-center' as="h3">Lista de Usuarios</Card.Header>
          <Card.Body>
            <GridUsers
              rows={listUser}
              columnsVar={userColumns}
              onDelete={handleDelete}
              fileNameVar='UserList'
              showDeleteColumn={true}
            />
          </Card.Body>
        </Card>
      </Col>
            </Row>
          </div>
        </Container>
      ) : (
        <>
          <Container className='container-custom'>
            <form onSubmit={passReset}>
            <Row className="justify-content-md-center" > 
                  <Col lg={10}> 
              <Card>
                <Card.Header>
                  <h3>Administración de Usuario</h3>{' '}
                </Card.Header>
                <Card.Body>
                  <Card.Title>Reseteo de Contraseña</Card.Title>
                </Card.Body>
                <Row>
                  <Col lg={{ span: 4, offset: 3 }}>
                    <Form.Group className='mb-3'>
                      <Form.Control
                        type='password'
                        required
                        placeholder='Contraseña Nueva'
                        size='sm'
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={{ span: 2 }}>
                    <Button
                      className='mb-5'
                      variant='outline-secondary'
                      type='submit'
                      size='sm'
                    >
                      <GoPasskeyFill /> Actualizar
                    </Button>{' '}
                  </Col>
                </Row>
              </Card>
              </Col>
              </Row>
            </form>
          </Container>
        </>
      )}
    </>
  );
}

export default UserCreate;
