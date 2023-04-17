import axios from "../utils/axios-customize";
import { ILogin, IRegister } from "../types/auth";

const loginUser = (login: ILogin) => {
    return axios.post("/api/v1/auth/login", { ...login });
}

const registerUser = (register: IRegister) => {
    return axios.post("/api/v1/user/register", { ...register });
}

export {
    loginUser,
    registerUser
}