import { IAddUser, IUpdateUser } from "../types/user";
import axios from "../utils/axios-customize";

export const getAllUser = () => {
    return axios.get("/api/v1/user")
}

export const getListUserWithPaginate = (query: string) => {
    return axios.get(`/api/v1/user?${query}`)
}

export const postAddUser = (addUser: IAddUser) => {
    return axios.post(`/api/v1/user`, { ...addUser })
}

export const postAddListUser = (addUser: IAddUser[]) => {
    return axios.post(`/api/v1/user/bulk-create`, { ...addUser })
}

export const putUpdateUser = (updateUser: IUpdateUser, userId: string) => {
    return axios.put(`/api/v1/user/${userId}`, { ...updateUser })
}
export const deleteUser = (userId: string) => {
    return axios.delete(`/api/v1/user/${userId}`)
}