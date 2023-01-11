import { IValidSize } from './cart';
import { IUser } from './user';
export interface IOrder {

    _id?: string;
    user? : IUser | string;
    orderItems: IOrderItem[]
    shippingAddress: ShippingAddress
    paymentMethod?: string

    numberOfItems: number
    subtotal: number
    tax: number
    total: number

    isPaid: boolean
    paidAt?: string

    transactionId?: string
}


export interface IOrderItem {
    _id: string
    title: string
    size: IValidSize
    quantity: number
    slug: string
    images: string
    price: number
    gender: 'men'|'women'|'kid'|'unisex'
}

export interface ShippingAddress {
    name: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    country: string;
    zip: string;
    phone: string;
}
