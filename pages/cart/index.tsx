import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';

const CartPage = () => {

  const {isLoaded, cart} = useContext(CartContext)
  const router = useRouter()

  useEffect(() => {
    
      if (isLoaded && cart.length === 0) {
        router.replace('/cart/empty')
        return
      }
  }, [isLoaded, cart, router])
  
  if (!isLoaded || cart.length === 0) {
    return (<></>)
  }

  const onCheckout = () => {
    router.push('/checkout/address')
  }

  return (
    <ShopLayout title={`Carrito - ${cart.length}`} pageDescription='Carrito de compras'>
      <Typography variant='h1' component='h1'>Carrito</Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{my:1}}/>
              {/*Order Summary*/}
              <OrderSummary/>
              <Box sx={{mt:3}}>
                <Button color='secondary' className='circular-btn' fullWidth onClick={onCheckout}>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default CartPage