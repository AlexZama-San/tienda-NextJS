import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { Inter } from '@next/font/google'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';

const inter = Inter({ subsets: ['latin'] })

export default function KidsPage() {

  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title={'Tienda-shop - Kids'} pageDescription={'Encuentra lo mejor para niños'}>
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{mb: 1}}>
        productos para niños
      </Typography>

      {
        isLoading ? <FullScreenLoading />
        : <ProductList productos={products} />
      }
    </ShopLayout>
  )
}
