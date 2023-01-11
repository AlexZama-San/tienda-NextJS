import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import NextLink from 'next/link';

const EmptyPage = () => {
  return (
    <ShopLayout title={'Carrito Vacio'} pageDescription={'No hay nada en el carrito'}>
        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}} justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
            <RemoveShoppingCartOutlined sx={{fontSize: 100}}/>
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography >
                    No hay nada en el carrito
                </Typography>
                <NextLink href='/' passHref legacyBehavior>
                    <Link typography='h4' color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>

    </ShopLayout>
  )
}

export default EmptyPage