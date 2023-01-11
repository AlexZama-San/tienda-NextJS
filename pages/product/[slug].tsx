import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ProductSlideShow } from '../../components/products/ProductSlideShow';
import { ItemCounter } from '../../components/ui/ItemCounter';
import { SizeSelector } from '../../components/products/SizeSelector';
import { IProduct, IValidSizes } from '../../interfaces/products';
import { FC, useState, useContext } from 'react';
import { GetStaticProps } from 'next'
import { getAllProductsSlugs, getProductsBySlug } from '../../database/dbProducts';
import { ICartProduct } from '../../interfaces/cart';
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router';
import { CartContext } from '../../context/cart/CartContext';

interface Props {
  product: IProduct
}

const ProductPage: FC<Props> = ({product}) => {

  const {addProductToCart, cart} = useContext(CartContext)

  const router = useRouter()
  const [tempCardProduct, setTempCardProduct,] = useState<ICartProduct>({
    _id: product._id,
    images: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title:  product.title,
    gender: product.gender,
    quantity: 1,
    inStock: product.inStock
  })

  const selectedSize = (size: IValidSizes) => {
    setTempCardProduct({
      ...tempCardProduct,
      size
    })
  }

  const updatedQuantity = (quantity: number) => {
    setTempCardProduct({
      ...tempCardProduct,
      quantity
    })
    
  }

  const onAddProductToCart = () => {
    addProductToCart(tempCardProduct)
    router.push('/cart')
  }
  // const router = useRouter()

  // const {products: product, isLoading} = useProducts(`/products/${router.query.slug}`)

  // if (isLoading) return <h1>Cargando...</h1>

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>

        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            {/*TITLE*/}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>{`$${product.price}`}</Typography>

            {/*CANTIDAD*/}
            <Box sx={{mt: 2}}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter quantity={tempCardProduct.quantity} updatedQuantity={(quantity) => updatedQuantity(quantity)} maxQuantity={product.inStock}/>
              <SizeSelector sizes={product.sizes} 
                selectedSize={tempCardProduct.size}
                onSelectedSize={selectedSize}
              />

            </Box>

            {/*BOTON AGREGAR AL CARRITO*/}
            {
              (product.inStock) > 0 ? (
                <Button color='secondary' className='circular-btn' onClick={onAddProductToCart} disabled={tempCardProduct.size ? false : true}>
                {
                  tempCardProduct.size ? 
                  'Agregar al carrito' 
                  : 'Selecciona un tamaño'
                }
                </Button>

              ):(
                <Chip label='No hay existencias disponibles' color='error' variant='outlined' />
              )
            }

            {/* <Chip label='No hay existencias disponibles' color='error' /> */}
          </Box>

          <Box sx={{mt: 3}}>
            <Typography variant='subtitle2'>Descripción</Typography>
            <Typography variant='body2'>{product.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// import { GetServerSideProps } from 'next'
// import { getProductsBySlug, getAllProductsSlugs } from '../../database/dbProducts';


// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const product = await getProductsBySlug(ctx.params?.slug as string)

//   return {
//     props: {
//       product
//     }
//   }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await getAllProductsSlugs()// your fetch function here 

  return {
    paths: slugs.map(({slug}) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
    }
  }

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.


export const getStaticProps: GetStaticProps = async ({params}) => {
  const {slug = ''} = params as {slug: string}
   // your fetch function here 
  const product = await getProductsBySlug(slug)
  if(!product) return {
    redirect: {
      destination: '/404',
      permanent: false
    }
  }
  return {
    props: {
      product
    },
    revalidate: 86400
  }
}


export default ProductPage
