import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { Inter } from '@next/font/google'
import { ShopLayout } from '../components/layouts/ShopLayout';
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading } from '../components/ui/FullScreenLoading';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={'Tienda-shop - Home'} pageDescription={'Encuentra lo que mas te guste'}>
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{mb: 1}}>
        Todos los productos
      </Typography>

      {
        isLoading ? <FullScreenLoading />
        : <ProductList productos={products} />
      }
    </ShopLayout>
  )
}
