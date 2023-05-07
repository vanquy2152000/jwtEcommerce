import { IOrders } from "../types/order"
import axios from '../utils/axios-customize'

export const getListOrdersWithPaginations = (query: string) => {
    return axios.get(`/api/v1/order?${query}`)
}

export const postOrderBook = (order: IOrders) => {
    return axios.post(`/api/v1/order`, { ...order })
}