import { CartState} from './CartProvider';
import { ICartProduct } from '../../interfaces/cart';
import { ShippingAddress } from '../../interfaces/order';

type CartActionType = 
| {type: 'Cart_LoadCart From Cookies | storage', payload: ICartProduct[]}
| {type: 'UPDATE_PRODUCT_IN_CART', payload: ICartProduct[]}
| {type: 'UPDATE_PRODUCT_QUANTITY_IN_CART', payload: ICartProduct}
| {type: 'REMOVE_PRODUCT_FROM_CART', payload: ICartProduct}
| {type: 'UPDATE_ORDER_SUMMARY', payload: {
        numberOfItems: number,
        subtotal: number
        taxes: number
        total: number
    }}
| {type: 'Cart_LoadAddress From Cookies | storage', payload: ShippingAddress}
| {type: 'Cart_UpdateAddress From Cookies | storage', payload: ShippingAddress}
| {type: 'Cart_OrderComplete'}

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case 'Cart_LoadCart From Cookies | storage':
            return { ...state, isLoaded: true, cart: action.payload};

        case 'UPDATE_PRODUCT_IN_CART':
            return { ...state, cart: action.payload};

        case 'UPDATE_PRODUCT_QUANTITY_IN_CART':
            return { ...state, cart: state.cart.map(p => {
                if ( p._id !== action.payload._id ) return p;
                if ( p.size !== action.payload.size ) return p;
                return action.payload;
            })};
        case 'REMOVE_PRODUCT_FROM_CART':
            return { ...state, cart: state.cart.filter(p => {
                if ( p._id !== action.payload._id ) return true;
                if ( p.size !== action.payload.size ) return true;
                return false;
            })
        }
        case 'UPDATE_ORDER_SUMMARY':
            return { ...state, ...action.payload};

        case 'Cart_LoadAddress From Cookies | storage':
        case 'Cart_UpdateAddress From Cookies | storage':
            return { ...state, shippingAddress: action.payload};

        case 'Cart_OrderComplete':
            return { ...state, 
                cart: [], 
                numberOfItems: 0, 
                subtotal: 0, 
                taxes: 0, 
                total: 0
            };
        default:
            return state;
    }

}