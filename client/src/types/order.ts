export interface IOrders {
    _id: string,
    name: string,
    address: string,
    phone: string,
    totalPrice: number,
    detail: {
        bookName: string,
        quantity: number,
        _id: string
    }[],
    createdAt: string,
    updatedAt: string,
    __v: number,
    type: string
}

export interface IAddOrder {
    name: string,
    phone: string,
    address: string,
    totalPrice: number,
    detail: {
        bookName: string,
        quantity: number,
        _id: string
    }[],
}