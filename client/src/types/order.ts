export interface IOrders {
    name: string,
    address: string,
    phone: string,
    totalPrice: number,
    detail: {
        bookName: string,
        quantity: number,
        _id: string
    }[]

}