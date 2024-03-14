import axios from "axios"
import NProgress from "nprogress";

const BASE_URL = "//localhost:8080"

axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
        NProgress.inc();
        return config;
    }, error => {
        NProgress.done();
        return Promise.reject(error)
    }
)
axios.interceptors.response.use(res => {
        NProgress.done();
        return res;
    }, error => {
        NProgress.done();
        return Promise.reject(error)
    }
)

const http = axios.create({
    baseURL: BASE_URL, timeout: 10000
});

export default http