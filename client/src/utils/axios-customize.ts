import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

const handleRefreshToken = async () => {
    const res = await instance.get('/api/v1/auth/refresh');
    if (res && res.data) return res.data.access_token;
    else null;
}

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// dùng cái này để không bị vòng loop vô hạn
const NO_RETRY_HEADER = 'x-no-retry'

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    console.log("Check response : ", response)
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    console.log("Check error : ", error)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]
    ) {
        const access_token = await handleRefreshToken()
        error.config.headers['NO_RETRY_HEADER'] = 'true'
        if (access_token) {
            // ghi đè lên header Authorization hết hạn 
            error.config.headers['Authorization'] = `Bearer ${access_token}`
            localStorage.setItem('access_token', access_token)
            return instance.request(error.config)
        }
    }

    if (
        error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh'
    ) {
        if (window.location.pathname !== '/') {
            window.location.href = '/login'
        }
    }

    const errorMessage = error?.response?.data?.message;
    return errorMessage
        ? errorMessage
        : Promise.reject(error);

});

export default instance;