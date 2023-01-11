import { FC, PropsWithChildren, useReducer, useEffect } from 'react';
import { IUser } from '../../interfaces/user';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';
import tiendaApi from '../../api/tiendaApi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut} from 'next-auth/react';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

export const AuthProvider: FC<PropsWithChildren> = ({children}) => {

    const router = useRouter()
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
    const {data, status} = useSession()

    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            const {data} = await tiendaApi.post('user/login', {email, password})
            const {token, user} = data
            Cookies.set('token', token)
            dispatch({
                type: 'Auth_Login',
                payload: user
            })
            return true

        }catch(error) {
            console.log(error)
            return false
        }
    }

    const registerUser = async (name: string, email: string, password: string): Promise<{hasError: boolean, message?: string}> => {
        try {
            
            const {data} = await tiendaApi.post('user/register', {name, email, password})
            const {token, user} = data
            Cookies.set('token', token)
            dispatch({
                type: 'Auth_Login',
                payload: user
            })
            return {
                hasError: false,
                message: 'Usuario registrado correctamente'
            }

        } catch (error) {
            if(axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Error inesperado, intente de nuevo'
            }
        }
    }

    useEffect(() => {
      if (status === 'authenticated') {
        dispatch({
          type: 'Auth_Login',
          payload: data?.user as IUser
        })
      }
    
    }, [status, data])
    

    // useEffect(() => {
    //   checkToken()
    // }, [])
    
    const checkToken = async () => {

        if( !Cookies.get('token') ) {
            return
        }
        try {
            const {data} = await tiendaApi.get('/user/validate-token')
            const {user} = data
            dispatch({
                type: 'Auth_Login',
                payload: user
            })
        }catch(error) {
            console.log(error)
            dispatch({
                type: 'Auth_Logout'
            })
            Cookies.remove('token')
        }
    }

    const onLogout = () => {
        Cookies.remove('cart')
        Cookies.remove('name')
        Cookies.remove('lastName')
        Cookies.remove('address')
        Cookies.remove('address2')
        Cookies.remove('city')
        Cookies.remove('country')
        Cookies.remove('zip')
        Cookies.remove('phone')
        signOut()
        dispatch({
            type: 'Auth_Logout'
        })
    }


  return (
    <AuthContext.Provider value={{
        ...state,


        loginUser,
        registerUser,
        onLogout
    }}>
        {children}
    </AuthContext.Provider>
  )
}