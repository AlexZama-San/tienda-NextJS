import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from '@mui/material';
import NextLink from "next/link";
import { FC, useMemo, useState } from 'react';
import { IProduct } from '../../interfaces/products';

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({product}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0]
  }, [isHovered, product.images])


  return (
    <Grid 
      onMouseEnter={()=> setIsHovered(true)} 
      onMouseLeave={()=> setIsHovered(false)} 
      item xs={6} 
      sm={4}
    >
        <Card>
          <NextLink href={`/product/${product.slug}`} passHref legacyBehavior prefetch={false}>
            <Link>

              <CardActionArea>
                {
                  product.inStock === 0 && (
                    <Chip
                      color='primary'
                      label='No hay Stock'
                      sx={{position: 'absolute', zIndex: 99, top: '10px', left: '10px'}}
                    />
                  )
                }
                <CardMedia 
                  component='img'
                  className='fadeIn'
                  image={productImage}
                  alt={product.title}
                  onLoad={() => setIsLoaded(true)}
                />
              </CardActionArea>
            </Link>
          </NextLink>
        </Card>

        <Box sx={{mt: 1, display: isLoaded ? 'block': 'none'}} className='fadeIn'>
          <Typography fontWeight={700}>{product.title}</Typography>
          <Typography fontWeight={500}>{`$${product.price}`}</Typography>
        </Box>
    </Grid>
  )
}
