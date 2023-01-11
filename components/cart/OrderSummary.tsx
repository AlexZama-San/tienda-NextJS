import { Grid, Typography } from "@mui/material"
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { format } from "../../utils/currency";
import { NextPage } from 'next';

interface Props {
    NItems?: number
    tax?: number
    subtot?: number
    totality?: number
}

export const OrderSummary: NextPage<Props> = ({NItems, subtot, tax, totality}) => {

    const {numberOfItems, taxes, subtotal, total} = useContext(CartContext)

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{NItems ? NItems : numberOfItems}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{`${format(subtot ? subtot : subtotal)}`}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography>impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{`${format(tax ? tax : taxes)}`}</Typography>
            </Grid>
            <Grid item xs={6} sx={{mt:2}}>
                <Typography variant="subtitle1">Total</Typography>
            </Grid>
            <Grid item xs={6} sx={{mt:2}} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">{`${format(totality ? totality:total)}`}</Typography>
            </Grid>
        </Grid>
    )
}