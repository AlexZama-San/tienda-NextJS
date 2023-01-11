import { ShopLayout } from '../components/layouts/ShopLayout';
import { Box, Typography } from '@mui/material';


const notFoundCustom = () => {
  return (
    <ShopLayout title={'Pagina no encontrada'} pageDescription={'No hay nada aqui'}>
        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}} justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
            <Typography variant='h1' component='h1' fontSize={80} fontWeight={200}> 404 |</Typography>
            <Typography marginLeft={2}> No se encontro ninguna pagina</Typography>


        </Box>
    </ShopLayout>
  )
}

export default notFoundCustom