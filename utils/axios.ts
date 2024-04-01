import axios from "axios"
import NProgress from "nprogress";

const BASE_URL = ""
const BASE_PORT = "8080"

const http = axios.create({
    baseURL: BASE_URL, timeout: 10000
});

http.defaults.withCredentials = true

http.interceptors.request.use(config => {
        if (config.baseURL === "") {
            let protocol = window.location.protocol
            let hostname = window.location.hostname
            config.baseURL = protocol + "//" + hostname + ":" + BASE_PORT;
            http.defaults.baseURL = protocol + "//" + hostname + ":" + BASE_PORT;
        }

        NProgress.inc();
        return config;
    }, error => {
        NProgress.done();
        return Promise.reject(error)
    }
)

http.interceptors.response.use(res => {
        NProgress.done();
        return res;
    }, error => {
        NProgress.done();
        return Promise.reject(error)
    }
)

export default http