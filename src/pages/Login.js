import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../components/img/logo.png';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../css/App.css';
import { API_URL } from '../config/config';
import axios from 'axios';
//import SpinnerComponent from '../components/Spinner.js';
import PlaneSpinner from '../components/planeSpinner';
import { GiPadlockOpen } from 'react-icons/gi'; 
function Login({ setIslogin, form, setForm }) {
  const navigate = useNavigate();

  //const [form, setForm] = useState({ username: '', role: '', password: '' });
  const [isloading, SetIsloading] = useState(false);

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      SetIsloading(true);
      const response = await axios.post(`${API_URL}/loginUsers`, {
        username: form.username,
        password: form.password,
      }); //pass incorrecto
      if (response.data.code === 'USR_INCOR') {
        SetIsloading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Contraseña incorrecta',
        });
        //importante user no existe , si no pasaran como ok los que no existen
      } else if (response.data.code === 'USR_NOT_EXIST') {
        SetIsloading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El usuario no existe',
        });
      } else {
        //si pasa bien
        localStorage.setItem('jwtToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
        setForm({
          ...form,
          role: response.data.role,  // Aquí se actualiza el role del usuario
        });
        navigate('/home', { replace: true });
        setIslogin(true);
        SetIsloading(false);
      }
    } catch (error) {
      SetIsloading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
    }
  };

  return (
    <div className='App'>
    {isloading ? (
      <PlaneSpinner />
    ) : (
      <Form onSubmit={handleSubmit} className='login-form'>
        <img src={logo} className='App-logo'  width='150' alt='logo' />
  
        <Form.Group controlId='formBasicUser'>
          <Form.Label></Form.Label>
          <Form.Control
            type='text'
            placeholder='Usuario'
            onChange={handleInputChange}
            name='username'
            autoComplete="username"
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label></Form.Label>
          <Form.Control
            type='password'
            name='password'
            placeholder='Contraseña'
            onChange={handleInputChange}
            autoComplete='new-password'
          />
        </Form.Group>
        <Button
          className='semi-circle-login-btn'
          type='submit'
        > 
          <GiPadlockOpen className="me-1" />
        </Button>
      </Form>
    )}
  </div>
  );
}

export default Login;
