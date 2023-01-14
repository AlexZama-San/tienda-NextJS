import { DashboardOutlined, CreditCardOffOutlined, AttachMoneyOutlined, GroupOutlined, CategoryOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react'
import { SummaryTile } from '../../components/admin/SummaryTile';
import { AdminLayout } from '../../components/layouts/AdminLayout'
import useSWR from 'swr';
import { DashboardSummaryResponse } from '../../interfaces/dashboard';
import { useState, useEffect } from 'react';

const DashboardPage = () => {
  
  const {data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30*1000
  })
  const [refresh, setRefresh] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(refresh => refresh > 0 ? refresh - 1 : 30)
    },1000)
  
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  
  if(!error && !data){
    return <div>Cargando...</div>
  }

  if(error){
    console.log(error)
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoStock,
    productsWithLowStock,
    notPaidOrders
  } = data!



  return (
    <AdminLayout title='Dashboard' pageDescription='Estadisticas generales' icon={<DashboardOutlined />} >
        
        <Grid container spacing={2}>
            <SummaryTile title={numberOfOrders} description='Ordenes Totales' icon={<CreditCardOffOutlined color='secondary' sx={{fontSize: 40}} />} />
            <SummaryTile title={paidOrders} description='Ordenes Pagadas' icon={<AttachMoneyOutlined color='success' sx={{fontSize: 40}}/>} />
            <SummaryTile title={notPaidOrders} description='Ordenes Pendientes' icon={<CreditCardOffOutlined color='error' sx={{fontSize: 40}}/>} />
            <SummaryTile title={numberOfClients} description='Clientes' icon={<GroupOutlined color='primary' sx={{fontSize: 40}}/>} />
            <SummaryTile title={numberOfProducts} description='Productos' icon={<CategoryOutlined color='warning' sx={{fontSize: 40}}/>} />
            <SummaryTile title={productsWithNoStock} description='Productos sin existencias' icon={<CategoryOutlined color='error' sx={{fontSize: 40}}/>} />
            <SummaryTile title={productsWithLowStock} description='Bajo inventario' icon={<ProductionQuantityLimitsOutlined color='warning' sx={{fontSize: 40}}/>} />
            <SummaryTile title={refresh} description='Actualizacion en: ' icon={<AccessTimeOutlined color='secondary' sx={{fontSize: 40}}/>} />

        </Grid>



    </AdminLayout>
  )
}

export default DashboardPage