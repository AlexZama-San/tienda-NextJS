import { GetServerSideProps, NextPage } from 'next'
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material"
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from "@mui/material"
import NextLink from "next/link"
import { CartList } from "../../components/cart/CartList"
import { OrderSummary } from "../../components/cart/OrderSummary"
import { ShopLayout } from "../../components/layouts/ShopLayout"
import { getSession } from 'next-auth/react'
import { getOrderById } from '../../database/dbOrders';
import { IOrder, ShippingAddress } from '../../interfaces/order';
import { PayPalButtons } from '@paypal/react-paypal-js/dist/types/components/PayPalButtons'
import tiendaApi from '../../api/tiendaApi';
import { useRouter } from 'next/router';
import { useState } from 'react';


export type OrderResponseBody = {
  id: string;
  status:
      | "COMPLETED"
      | "SAVED"
      | "APPROVED"
      | "VOIDED"
      | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {

  const router = useRouter()
  const {shippingAddress} = order
  const [isPaying, setIsPaying] = useState(false)

  const onOrderCompleted = async (details: OrderResponseBody) => {

    if(details.status !== 'COMPLETED') {
      return alert('No se pudo completar el pago')
    }

    setIsPaying(true)
    try {
      
      const {data} = await tiendaApi.post(`/orders/pay`, {orderId: order._id, transactionId: details.id})
      router.reload()

    } catch (error) {
      setIsPaying(false)
      console.log(error);
      alert('No se pudo completar el pago')
    }
  }

  return (
    <ShopLayout title='Resumen de orden' pageDescription={'Resumen de la orden'}>
      <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>
      {
        order.isPaid ? (
          <Chip 
              sx={{my: 2}}
              label='Pagado'
              variant="outlined"
              color='success'
              icon={<CreditScoreOutlined />}
          />

        ) : (
          <Chip 
              sx={{my: 2}}
              label='pediente de pago'
              variant="outlined"
              color='warning'
              icon={<CreditCardOffOutlined />}
          /> 

        )
      }



      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems}/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
              <Divider sx={{my:1}}/>
              <Box display='flex' justifyContent='end'>
              </Box>
                <Typography variant='subtitle1'>Dirección de envío</Typography>
                <Typography>{shippingAddress.name} {shippingAddress.lastName}</Typography>
                <Typography>{shippingAddress.address} {shippingAddress.address2 ? `${shippingAddress.address2}` : ''}</Typography>
                <Typography>{shippingAddress.city}</Typography>
                <Typography>{shippingAddress.zip}</Typography>
                <Typography>{shippingAddress.country}</Typography>
                <Typography>{shippingAddress.phone}</Typography>
                <Divider sx={{my:1}}/>
              {/*Order Summary*/}
              <OrderSummary NItems={order.numberOfItems} subtot={order.subtotal} tax={order.tax} totality={order.total}/>
              <Box sx={{mt:3}} display='flex' flexDirection='column'>
                {/*TODO: PAGAR */}
                <Box display='flex' justifyContent='center' className='fadeIn' sx={{display: isPaying ? 'flex':'none'}}>
                  <CircularProgress />
                </Box>
                <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1}}>
                  {
                    order.isPaid ? (
                      <Chip 
                      sx={{my: 2}}
                      label='Pagado'
                      variant="outlined"
                      color='success'
                      icon={<CreditScoreOutlined />}
                      />
                      ) : (
                        <PayPalButtons 
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                          value: order.total.toString(),
                                      },
                                  },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order!.capture().then((details) => {
                              onOrderCompleted(details)
                              // const name = details.payer.name!.given_name;
                              // alert(`Transaction completed by ${name}`);
                            });
                          }}
                          />
                          )
                        }
                    </Box>
              </Box>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const { id = '' } = query  // your fetch function here 

  const session:any = await getSession({req})
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      }
    }
  }

  const order = await getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      }
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      }
    }
  }


  return {
    props: {
      order
    }
  }
}

export default OrderPage