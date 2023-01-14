import { GetServerSideProps, NextPage } from 'next'
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material"
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from "@mui/material"
import { CartList } from "../../../components/cart/CartList"
import { OrderSummary } from "../../../components/cart/OrderSummary"
import { getOrderById } from '../../../database/dbOrders';
import { IOrder } from '../../../interfaces/order';
import { AdminLayout } from '../../../components/layouts/AdminLayout';


interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {

  const {shippingAddress} = order

  return (
    <AdminLayout title='Resumen de orden' pageDescription={`Resumen de la orden ${order._id}`} icon={<AirplaneTicketOutlined />}>
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
                <Box display='flex' flexDirection='column'>

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
                        label='Pendiente de pago'
                        variant="outlined"
                        color='error'
                        icon={<CreditCardOffOutlined/>} 
                        />
                          )
                        }
                  </Box>
              </Box>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const { id = '' } = query  // your fetch function here 

  const order = await getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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