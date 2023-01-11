import { DashboardOutlined, CreditCardOffOutlined, AttachMoneyOutlined, GroupOutlined, CategoryOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react'
import { SummaryTile } from '../../components/admin/SummaryTile';
import { AdminLayout } from '../../components/layouts/AdminLayout'

const DashboardPage = () => {
  return (
    <AdminLayout title='Dashboard' pageDescription='Estadisticas generales' icon={<DashboardOutlined />} >
        
        <Grid container spacing={2}>
            <SummaryTile title={1} description='Ordenes Totales' icon={<CreditCardOffOutlined color='secondary' sx={{fontSize: 40}} />} />
            <SummaryTile title={2} description='Ordenes Pagadas' icon={<AttachMoneyOutlined color='success' sx={{fontSize: 40}}/>} />
            <SummaryTile title={3} description='Ordenes Pendientes' icon={<CreditCardOffOutlined color='error' sx={{fontSize: 40}}/>} />
            <SummaryTile title={4} description='Clientes' icon={<GroupOutlined color='primary' sx={{fontSize: 40}}/>} />
            <SummaryTile title={5} description='Productos' icon={<CategoryOutlined color='warning' sx={{fontSize: 40}}/>} />
            <SummaryTile title={6} description='Productos sin existencias' icon={<CategoryOutlined color='error' sx={{fontSize: 40}}/>} />
            <SummaryTile title={7} description='Bajo inventario' icon={<ProductionQuantityLimitsOutlined color='warning' sx={{fontSize: 40}}/>} />
            <SummaryTile title={8} description='Actualizacion en: ' icon={<AccessTimeOutlined color='secondary' sx={{fontSize: 40}}/>} />

        </Grid>



    </AdminLayout>
  )
}

export default DashboardPage