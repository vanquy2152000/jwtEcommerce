export interface IUsers {
    _id: string,
    fullName: string,
    email: string,
    phone: string,
    role: string,
    avatar?: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
}

export interface IAddUser {
    fullName: string,
    password: string,
    email: string,
    phone: string,
}
export interface IAddUserMulti {
    fullName: string,
    password: string,
    email: string,
    phone: string,
}[]

export interface IUpdateUser {
    _id: string,
    fullName?: string,
    phone?: string,
    avatar?: string
}

export interface IChangePassword {
    email: string,
    oldpass: string,
    newpass: string
}