import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from "@mui/material"
import { CartList } from "../../components/cart/CartList"
import { OrderSummary } from "../../components/cart/OrderSummary"
import { ShopLayout } from "../../components/layouts/ShopLayout"
import NextLink from 'next/link'
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import Cookies from "js-cookie"
import { useRouter } from "next/router"

const SummaryPage = () => {
  const router = useRouter()
  const {shippingAddress, cart, createOrder} = useContext(CartContext)
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!Cookies.get('name')){
      router.push('/checkout/address')
    }
  }, [router])

  const onCreateOrder = async () => {
    setIsPosting(true)
    const {hasError, message} = await createOrder()
    if (hasError) {
      setIsPosting(false)
      setErrorMessage(message)
      return
    }
    router.replace(`/orders/${message}`)
  }
  

  if (!shippingAddress) return <></>

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({cart.length > 1 ? 'Productos' : 'Producto'})</Typography>
              <Divider sx={{my:1}}/>
              <Box display='flex' justifyContent='end'>
                <NextLink href='/checkout/address' passHref legacyBehavior>
                    <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
                <Typography variant='subtitle1'>Dirección de envío</Typography>
                <Typography>{shippingAddress?.name}</Typography>
                <Typography>{shippingAddress?.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                <Typography>{shippingAddress?.zip}</Typography>
                <Typography>{shippingAddress?.city}</Typography>
                <Typography>{shippingAddress?.country}</Typography>
                <Typography>{shippingAddress?.phone}</Typography>
                <Divider sx={{my:1}}/>

                <Box display='flex' justifyContent='end'>
                    <NextLink href='/cart' passHref legacyBehavior>
                        <Link underline="always">Editar</Link>
                    </NextLink>
                </Box>
              {/*Order Summary*/}
              <OrderSummary/>
              <Box sx={{mt:3}} display='flex' flexDirection='column'>
                <Button color='secondary' disabled={isPosting} onClick={onCreateOrder} className='circular-btn' fullWidth>
                  Confirmar orden
                </Button>

                <Chip 
                  color='error'
                  label={errorMessage}
                  sx={{display: errorMessage ? 'flex' : 'none', mt: 2}}
                />
              </Box>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage