import axios from "../utils/axios-customize"

export const getDashboard = () => {
    return axios.get(`/api/v1/database/dashboard`)
}
