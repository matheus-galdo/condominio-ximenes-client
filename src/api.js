import axios from 'axios';


  //eslint-disable-next-line
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://localhost:8000/api/' : 'a definir';
let api = axios.create();

export default api;