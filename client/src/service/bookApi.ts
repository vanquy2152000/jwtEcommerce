import { IAddUpdateBook, IDeleteImageBook, IUploadImageBook } from '../types/book'
import axios from '../utils/axios-customize'

export const getAllCategoryBook = () => {
    return axios.get(`/api/v1/database/category`)
}

export const getListBooksWithPaginate = (query: string) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const postAddBook = (addBook: IAddUpdateBook) => {
    return axios.post(`/api/v1/book`, { ...addBook })
}

export const postUploadImageBook = (uploadImageBook: IUploadImageBook) => {
    return axios.post(`/api/v1/book`, { ...uploadImageBook })
}

export const postDeleteImageBook = (deleteImageBook: IDeleteImageBook) => {
    return axios.post(`/api/v1/book/delete-image`, { ...deleteImageBook })
}

export const putUpdateBook = (updateBook: IAddUpdateBook, bookId: number) => {
    return axios.put(`/api/v1/book/${bookId}`, { ...updateBook })
}

export const deleteBook = (bookId: string) => {
    return axios.delete(`/api/v1/book/${bookId}`)
}