import { FC } from 'react';
import { Grid } from '@mui/material';
import { IProduct } from '../../interfaces/products';
import { ProductCard } from './ProductCard';

interface Props {
    productos: IProduct[]
}

export const ProductList: FC<Props> = ({productos}) => {
  return (
    <Grid container spacing={4}>
        {
            productos.map((product) => (
                <ProductCard product={product} key={product.slug}/>
            ))
        }
    </Grid>
  )
}
