import axios from "../utils/axios-customize"

export const getHistoryOrder = () => {
    return axios.get(`/api/v1/history`)
}