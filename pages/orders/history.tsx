
import { GetServerSideProps, NextPage } from 'next'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Chip, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef, GridRenderCellParams} from '@mui/x-data-grid/models';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import { getSession } from 'next-auth/react';
import { getOrdersByUser } from '../../database/dbOrders';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] =[
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullname', headerName: 'Nombre completo', width: 300},

    {
        field: 'paid',
        headerName: 'Pagado',
        description: 'muestra informacion si la orden fue pagada o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid ? <Chip color='success' label='Pagada' variant='outlined' />: <Chip color='warning' label='No pagada' variant='outlined' />

            )
        }
    },
    {
        field: 'Orders',
        headerName: 'Ordenes',
        description: 'redirecciona a las ordenes de compra correspondientes',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (

                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link>
                        <Button color='info' className='circular-btn'>Ver orden</Button>
                    </Link>
                </NextLink>
            )
        }
    }
]

interface Props {
    orders?: IOrder[]
}

const HistoryPage: NextPage<Props> = ({orders = []}) => {

    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.name} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))

  return (
    <ShopLayout title={'Historial de compras'} pageDescription={'Historial de compras del cliente'} >
        <Typography variant='h1' component='h1'>Historial de compras</Typography>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req}) => {
   
    const session: any = await getSession({req})

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await getOrdersByUser(session.user._id)

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage