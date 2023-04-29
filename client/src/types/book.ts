export interface IBooks {
    _id: string,
    thumbnail: string,
    slider: string[]
    mainText: string,
    author: string,
    price: number,
    sold: number,
    quantity: number,
    category: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    items?: any
}

export interface IAddUpdateBook {
    thumbnail: string,
    slider: string[],
    mainText: string,
    author: string,
    price: number,
    sold: number,
    quantity: number,
    category: string
}

export interface IUploadImageBook {
    fileImg: string
}

export interface IDeleteImageBook {
    id: string,
    name: string,
    type: string
}