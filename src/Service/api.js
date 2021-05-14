import axios from 'axios';
import storage from '../libs/storage';




const api = (auth = false, responseType = false) => {

  let token = (localStorage.token)? JSON.parse(localStorage.token).access_token : '';
 

  let headers = {
    baseURL: (process.env.NODE_ENV === 'development') ? 'http://localhost:8000/api/' : 'a definir',
  }
  if (responseType) headers.responseType = responseType;

  const axiosInstance = axios.create(headers);
  
  if (!auth) axiosInstance.defaults.headers.common['Authorization'] ='Bearer ' + token;

  


  axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    
    if (error.response.status === 401 && error.response.data.status === 'Authorization token not found') {
      storage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error);
  });

  return axiosInstance;
}



export default api;