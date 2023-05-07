import { IAddOrder, IOrders } from "../types/order"
import axios from '../utils/axios-customize'

export const getListOrdersWithPaginations = (query: string) => {
    return axios.get(`/api/v1/order?${query}`)
}

export const postOrderBook = (order: IAddOrder) => {
    return axios.post(`/api/v1/order`, { ...order })
}