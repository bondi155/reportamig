import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button, Card, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';  USUARIO CON RECOIL O SECUENCIAL , VER ESO PARA LOS ROLES
import { API_URL } from '../config/config.js';
import GridEval from '../charts/GridEval';
import Swal from 'sweetalert2';
import { GoPasskeyFill } from "react-icons/go";
import { FaUserPlus } from "react-icons/fa6";


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
        <Container className='container-custom'>
                    <Tabs defaultActiveKey="resetPassword" id="uncontrolled-tab-example" className="mb-3">

           <Tab eventKey="createUser" title="Creación de Usuario"> 
          <form onSubmit={addNewUser}>
            <Card>
              <Card.Header>
                <h3> Administración de Usuarios</h3>
              </Card.Header>
              <Card.Body>
        <Card.Title>Creación de Usuario</Card.Title>
        </Card.Body>
              <Row className='mt-1'>
                <Col lg={{ span: 3, offset: 1 }} sm={4} md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='text'
                      name='username'
                      required
                      placeholder='Usuario'
                      onChange={handleUserInput}
                    />
                  </Form.Group>
                </Col>
                <Col lg={4} sm={4} md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Select
                      aria-label='role'
                      value={userCreate.role}
                      name='role'
                      required
                      onChange={handleUserInput}
                    >
                      <option disabled value=''>
                        {' '}
                        Tipo de Usuarios{' '}
                      </option>
                      <option value='operador'>Operador</option>
                      <option value='consulta'>Consulta</option>
                      <option value='admin'>Administrador</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3} sm={4} md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Control
                      type='password'
                      required
                      name='password'
                      placeholder='Contraseña'
                      onChange={handleUserInput}
                    />
                  </Form.Group>
                </Col>
                <Col
                  xs={{ span: 8, offset: 4 }}
                  lg={{ span: 3, offset: 5 }}
                  sm={{ span: 6, offset: 4 }}
                  md={{ span: 3, offset: 5 }}
                >
                  <Button
                    className='mb-3 mt-1'
                    variant='outline-secondary'
                    type='submit'
                    size='sm'
                  >
                    Crear Usuario <FaUserPlus className='mb-1'/>

                  </Button>
                </Col>
              </Row>
            </Card>
          </form>
          </Tab>
        <Tab eventKey="resetPassword" title="Reseteo de Contraseña">
          <form onSubmit={passReset}>
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
                      <GoPasskeyFill/> Actualizar

                    </Button>{' '}
                  </Col>
                </Row>
              </Card>
            </form>
            </Tab>
      </Tabs>
          <div className='evaluation-grid'>
            <Row className='mt-5'>
              <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
                <GridEval
                  rows={listUser}
                  columnsVar={userColumns}
                  onDelete={handleDelete}
                  fileNameVar='UserList'
                  showDeleteColumn={true}
                />
              </Col>
            </Row>
          </div>
          
        </Container>
      ) : (
        <>
          <Container className='container-custom'>
            <form onSubmit={passReset}>
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
                      <GoPasskeyFill/> Actualizar

                    </Button>{' '}
                  </Col>
                </Row>
              </Card>
            </form>
          </Container>
        </>
      )}
    </>
  );
}

export default UserCreate;
