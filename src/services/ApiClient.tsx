import axios from 'axios';
import { loaderStore } from '../redux/LoaderStore';
import { BASE_URL } from '../constants/ApiConstants';
import { getValue } from '../utils/localStorageUtil';
import { globalErrorHandler } from '../context/ErrorContext';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request
apiClient.interceptors.request.use(
  (config) => {
    loaderStore.start();
    const token = getValue("ACCESS_TOKEN_KEY");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    loaderStore.stop();
    return Promise.reject(error);
  }
);

// Response
apiClient.interceptors.response.use(
  (response) => {
    loaderStore.stop();
    return response;
  },
  (error) => {    
    loaderStore.stop();
    globalErrorHandler(error);   // ⬅️ THIS IS GLOBAL HANDLER
    return Promise.reject(error);
  }
);

export default apiClient;
