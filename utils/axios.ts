import axios from "axios"

const BASE_URL = "//localhost:8080"

const http = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
});

export default http