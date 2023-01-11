import { Box, CardActionArea, CardMedia, Grid, Link, Typography, Button } from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui/ItemCounter';
import { FC, useContext, useState } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct } from '../../interfaces/cart';
import { IOrderItem } from '../../interfaces/order';


interface Props {
    editable?: boolean
    products?: IOrderItem[]
}

export const CartList: FC<Props> = ({editable = false, products = []}) => {

    const {cart, updateCartQuantity, removeCartProduct} = useContext(CartContext)
    const productsInCart = cart

    const updateQuantity = (product: ICartProduct, Quantity: number) => {
        const updatedProduct = {...product, quantity: Quantity}
        updateCartQuantity(updatedProduct)
    }
    const deleteProduct = (product: ICartProduct) => {
        removeCartProduct(product)
    }

    const productsToShow = products ? products : productsInCart

  return (
    <>
        {
            productsToShow.map(product => (
                <Grid container spacing={2} sx={{mb:1}} key={product._id + product.slug}>
                    <Grid item xs={12} sm={3}>
                        {/*llevar a la pagina del producto*/}
                        <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={`/products/${product.images}`}
                                        component='img'
                                        sx={{borderRadius: '5px'}}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{product.title}</Typography>
                            <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                            {/*Condicional*/}
                            {
                                editable ?
                                <ItemCounter quantity={product.quantity} maxQuantity={10} updatedQuantity={(quantity) => updateQuantity(product as ICartProduct,quantity)} />
                                :
                                <Typography variant='body1'>Cantidad: <strong>{product.quantity}</strong></Typography>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
                        {/*Editable*/}
                        {
                            editable && (
                                <Button variant='text' color='secondary' onClick={() => deleteProduct(product as ICartProduct)}>
                                    Remover
                                </Button>
                            )
                        }
                    </Grid>
                </Grid>

            ))
        }
    </>
  )
}
