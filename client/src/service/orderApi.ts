import { IOrders } from "../types/order"
import axios from '../utils/axios-customize'

export const postOrderBook = (order: IOrders) => {
    return axios.post(`/api/v1/order`, { ...order })
}