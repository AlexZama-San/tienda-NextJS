import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes/light-theme';
import { SWRConfig } from 'swr';
import { UiProvider } from '../context/ui/UiProvider';
import { CartProvider } from '../context/cart/CartProvider';
import { AuthProvider } from '../context/auth/AuthProvider';
import { SessionProvider } from "next-auth/react"
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <PayPalScriptProvider options={{'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT || ''}}>

        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
          >
            <AuthProvider >
                <CartProvider>
                  <UiProvider>
                    <ThemeProvider theme={lightTheme}>
                      <CssBaseline/>
                      <Component {...pageProps} />
                    </ThemeProvider>
                  </UiProvider>
                </CartProvider>
            </AuthProvider>
          </SWRConfig>
        </PayPalScriptProvider>
      </SessionProvider>
    )
}
