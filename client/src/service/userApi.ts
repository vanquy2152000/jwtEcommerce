import { IAddUser, IAddUserMulti, IChangePassword, IUpdateUser } from "../types/user";
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

export const postAddListUser = (addUserMulti: IAddUserMulti[]) => {
    return axios.post(`/api/v1/user/bulk-create`, [...addUserMulti])
}

export const putUpdateUser = (updateUser: IUpdateUser) => {
    return axios.put(`/api/v1/user`, { ...updateUser })
}
export const deleteUser = (userId: string) => {
    return axios.delete(`/api/v1/user/${userId}`)
}

export const postUploadAvatar = (fileImg: any) => {
    const bodyFormData = new FormData()
    bodyFormData.append('fileImg', fileImg)

    return axios.post(
        `/api/v1/file/upload`,
        bodyFormData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "upload-type": "avatar"
            }
        })
}

export const postChangePassword = (changePassword: IChangePassword) => {
    return axios.post(`/api/v1/user/change-password`, {...changePassword})
}