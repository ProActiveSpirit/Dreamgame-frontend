import axios from 'axios';
// config
// import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_HOST_API_KEY || "http://localhost:3000" 
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
