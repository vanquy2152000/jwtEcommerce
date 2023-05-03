export interface IHistories {
    _id: string,
    name: string,
    email: string,
    phone: string,
    userId: string,
    detail:
    {
        bookName: string,
        quantity: number,
        _id: string
    }[],
    totalPrice: number,
    createdAt: string,
    updatedAt: string,
}