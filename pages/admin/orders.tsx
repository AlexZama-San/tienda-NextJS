import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Grid, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid/models';
import useSWR from 'swr';
import { IOrder } from '../../interfaces/order';
import { IUser } from '../../interfaces/user';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'Order ID', width: 250},
    {field: 'email', headerName: 'Correo', width: 250},
    {field: 'name', headerName: 'Correo', width: 300},
    {field: 'total', headerName: 'Monto total', width: 300},
    {
      field: 'isPaid',
      headerName: 'pagada',
      renderCell: ({row}: GridRenderCellParams) => {
        return row.isPaid ?
          (<Chip variant='outlined' label='Pagada' color='success'/>)
          : (<Chip variant='outlined' label='Pendiente' color='error'/>)
      }
    },
    {field: 'noProducts', headerName: 'No.Productos', align: 'center'},
    {
      field: 'check',
      headerName: 'Ver Orden',
      renderCell: ({row}: GridRenderCellParams) => {
        return (
          <a href={`/admin/orders/${row.id}`} target='_blank' rel="noreferrer"></a>
        )
      }
    },
    { field: 'createdAt', headerName: 'Fecha de creación', width: 300}
]

const OrdersPage = () => {

  const { data, error} = useSWR<IOrder[]>('/api/admin/orders')

  if (!data && !error) return (<></>)

  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt
  }))

  return (
    <AdminLayout title={'Ordenes'} pageDescription={'Mantenimiento de Ordenes'} icon={<ConfirmationNumberOutlined />}>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default OrdersPage