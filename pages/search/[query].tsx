import { Box, Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { Inter } from '@next/font/google'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products/ProductList';
import { GetServerSideProps } from 'next'
import { getProductsByTerm, getAllProducts } from '../../database/dbProducts';
import { IProduct } from '../../interfaces/products';

const inter = Inter({ subsets: ['latin'] })

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

export default function SearchPage({ products, foundProducts, query }: Props) {

  return (
    <ShopLayout title={'Tienda-shop - search'} pageDescription={'Encuentra lo que mas te guste'}>
      <Typography variant='h1' component='h1'>
        Busqueda
      </Typography>

      {foundProducts ? 
        <Typography variant='h2' sx={{mb: 1}}>
          {query}
        </Typography>
        :
        <Box display='flex'>
          <Typography variant='h2' sx={{mb: 1}}>
            No se encontraron resultados para {query}
          </Typography>

        </Box>
        }

        <ProductList productos={products} />
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query = '' } = ctx.params as { query: string };

  if(query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  let products = await getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if(!foundProducts) {
    products = await getAllProducts() // get all products/
  }


  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}