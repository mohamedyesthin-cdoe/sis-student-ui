import axios from 'axios';
import { loaderStore } from '../redux/LoaderStore';
import { BASE_URL } from '../constants/ApiConstants';
import { getValue } from '../utils/localStorageUtil';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        loaderStore.start();

        const token = getValue('ACCESS_TOKEN_KEY');
        if (token) {
            // Safely set Authorization header without replacing headers object
            config.headers = config.headers || {};
            if (typeof config.headers.set === 'function') {
                // If using Axios v1 AxiosHeaders instance
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                // For older versions or fallback
                (config.headers as any)['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        loaderStore.stop();
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        loaderStore.stop();
        return response;
    },
    (error) => {
        loaderStore.stop();
        return Promise.reject(error);
    }
);

export default apiClient;
