import { IUser } from '../../interfaces/user';
import { AuthState } from './AuthProvider';

type AuthActionType = 
| {type: 'Auth_Login', payload: IUser} 
| {type: 'Auth_Logout'} 

export const authReducer = (state: AuthState, action: AuthActionType): AuthState => {

    switch (action.type) {
        case 'Auth_Login':
            return { ...state, isLoggedIn: true, user: action.payload };
        case 'Auth_Logout':
            return { ...state, isLoggedIn: false, user: undefined };
        default:
            return state;
    }

}