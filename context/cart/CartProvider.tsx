import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { CartContext } from './CartContext';
import { cartReducer } from './cartReducer';
import { ICartProduct } from '../../interfaces/cart';
import Cookie from "js-cookie";
import { ShippingAddress, IOrder } from '../../interfaces/order';
import tiendaApi from '../../api/tiendaApi';
import axios from 'axios';

export interface CartState {
    cart: ICartProduct[];
    isLoaded: boolean;
    numberOfItems: number;
    subtotal: number;
    taxes: number;
    total: number;
    shippingAddress?: ShippingAddress
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    isLoaded: false,
    numberOfItems: 0,
    subtotal: 0,
    taxes: 0,
    total: 0,
    shippingAddress: undefined

}

export const CartProvider: FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    useEffect(() => {
        
        try {
            const cart = Cookie.get('cart')
            if(cart) {
                dispatch({type: 'Cart_LoadCart From Cookies | storage', payload: JSON.parse(cart)})
            }
        } catch (error) {
            dispatch({type: 'Cart_LoadCart From Cookies | storage', payload: []})
        }
        
    }, [])

    useEffect(() => {

        if( Cookie.get('name')){
        const shippingAddress = {
            name : Cookie.get('name') || '',
            lastName : Cookie.get('lastName') || '',
            address : Cookie.get('address') || '',
            address2 : Cookie.get('address2') || '',
            city : Cookie.get('city') || '',
            country : Cookie.get('country') || '',
            zip : Cookie.get('zip') || '',
            phone : Cookie.get('phone') || '',
        }
        dispatch({type: 'Cart_LoadAddress From Cookies | storage', payload: shippingAddress})
        
    }
        
    }, [])
    
    useEffect(() => {

        if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])

    useEffect(() => {
        const numberOfItems = state.cart.reduce((acc, curr) => acc + curr.quantity, 0)
        const subtotal = state.cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
        const taxes = subtotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
        const total = subtotal + taxes
        
        
        const orderSummary ={
            numberOfItems,
            subtotal,
            taxes,
            total
        }
        dispatch({type: 'UPDATE_ORDER_SUMMARY', payload: orderSummary})
    }, [state.cart])

    const addProductToCart = (product: ICartProduct) => {
        const p = state.cart.some(p => p._id === product._id)
        if(!p) return dispatch({type: 'UPDATE_PRODUCT_IN_CART', payload: [...state.cart, product]})

        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size)
        if(!productInCartButDifferentSize) return dispatch({type: 'UPDATE_PRODUCT_IN_CART', payload: [...state.cart, product]})

        const updatedProduct = state.cart.map(p => {
            if(p._id === product._id && p.size === product.size) {
                if(p.quantity + product.quantity > p.inStock) {
                    p.quantity = p.inStock
                    return p
                }
                p.quantity += product.quantity
                return p
            }
            return p
        })

        dispatch({type: 'UPDATE_PRODUCT_IN_CART', payload: updatedProduct})
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({type: 'UPDATE_PRODUCT_QUANTITY_IN_CART', payload: product})
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({type: 'REMOVE_PRODUCT_FROM_CART', payload: product})
    }

    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('name', address.name)
        Cookie.set('lastName', address.lastName)
        Cookie.set('address', address.address)
        Cookie.set('address2', address.address2 || '')
        Cookie.set('city', address.city)
        Cookie.set('country', address.country)
        Cookie.set('zip', address.zip)
        Cookie.set('phone', address.phone)
        dispatch({type: 'Cart_UpdateAddress From Cookies | storage', payload: address})
    }

    const createOrder = async ():Promise<{ hasError: boolean, message: string}>=>{

        if(!state.shippingAddress) {
            throw new Error('No hay direccion de entrega')
        }

        const body: IOrder = {
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subtotal: state.subtotal,
            tax: state.taxes,
            total: state.total,
            isPaid: false

        }


        try {
            const {data} = await tiendaApi.post('/orders', body)
            dispatch({type: 'Cart_OrderComplete'})

            return {
                hasError: false,
                message: data._id!
            }
        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message || 'Error al crear el pedido'
                }
            }
            return {
                hasError: true,
                message: 'Error desconocido, hable con el administrador'
            }
        }
    }

  return (
    <CartContext.Provider value={{
        ...state,

        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder
    }}>
        {children}
    </CartContext.Provider>
  )
}