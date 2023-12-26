import { atom } from 'recoil';

//Recoil para el token CSRF
const csrfTokenState = atom({
  default: '',
  key: 'csrfTokenState',

});
