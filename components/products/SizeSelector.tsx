import { Box, Button } from "@mui/material";
import { Prosto_One } from "@next/font/google";
import { FC } from "react"
import { IValidSizes } from '../../interfaces/products';

interface Props {
    selectedSize?: IValidSizes
    sizes: IValidSizes[]

    onSelectedSize: (size: IValidSizes) => void
}

export const SizeSelector: FC<Props> = ({selectedSize, sizes, onSelectedSize}) => {

  return (
    <Box>
        {
            sizes.map(size => (
                <Button
                    key={size}
                    size='small'
                    color={selectedSize === size ? 'primary' : 'info'}
                    onClick = {() => onSelectedSize(size)}
                >
                    {size}
                </Button>
            ))
        }
    </Box>
  )
}
