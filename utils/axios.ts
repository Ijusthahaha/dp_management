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
        if (error.response.status === 403) {
            ElMessage({
                type: 'error',
                message: getI18nText('login.status.blocked')
            })
        }
        if (error.response.status === 401) {
            ElMessage({
                type: 'error',
                message: getI18nText('login.status.token_expired')
            })
            localStorage.setItem("JWT", '')
            location.reload()
        }
        NProgress.done();
        return Promise.reject(error)
    }
)

const getI18nText = (text: string): string => {
    const { $i18n } = useNuxtApp();
    const t = $i18n.t;

    return t(text);
};

export default http