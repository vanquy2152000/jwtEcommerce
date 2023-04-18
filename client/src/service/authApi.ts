import axios from "../utils/axios-customize";
import { ILogin, IRegister } from "../types/auth";

const getAccount = () => {
    return axios.get("/api/v1/auth/account")
}

const getRefreshToken = () => {
    return axios.get("/api/v1/auth/refresh")
}

const loginUser = (login: ILogin) => {
    return axios.post("/api/v1/auth/login", { ...login, delay: 3000 });
}

const registerUser = (register: IRegister) => {
    return axios.post("/api/v1/user/register", { ...register });
}

const logoutUser = () => {
    return axios.post("/api/v1/auth/logout");
}


export {
    loginUser,
    logoutUser,
    registerUser,
    getAccount,
    getRefreshToken
}