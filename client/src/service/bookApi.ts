import { IAddUpdateBook, IDeleteImageBook, IUploadImageBook } from '../types/book'
import axios from '../utils/axios-customize'

export const getAllCategoriesBooks = () => {
    return axios.get(`/api/v1/database/category`)
}

export const getListBooksWithPaginate = (query: string) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const getBookDetail = (bookId: string) => {
    return axios.get(`/api/v1/book/${bookId}`)
}

export const postAddBook = (addBook: IAddUpdateBook) => {
    return axios.post(`/api/v1/book`, { ...addBook })
}

export const postUploadImageBook = (fileImg: any) => {
    const bodyFormData = new FormData()
    bodyFormData.append('fileImg', fileImg)

    return axios.post(
        `/api/v1/file/upload`,
        bodyFormData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "upload-type": "book"
            }
        })
}

export const postDeleteImageBook = (deleteImageBook: IDeleteImageBook) => {
    return axios.post(`/api/v1/book/delete-image`, { ...deleteImageBook })
}

export const putUpdateBook = (updateBook: IAddUpdateBook, bookId: string) => {
    return axios.put(`/api/v1/book/${bookId}`, { ...updateBook })
}

export const deleteBook = (bookId: string) => {
    return axios.delete(`/api/v1/book/${bookId}`)
}
