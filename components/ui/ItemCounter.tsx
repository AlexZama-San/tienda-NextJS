import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC, useState } from "react"

interface Props {
  quantity: number
  maxQuantity: number
  updatedQuantity: (quantity: number) => void
}

export const ItemCounter: FC<Props> = ({quantity, maxQuantity, updatedQuantity}) => {

  const onAdd = () => {
    if (quantity < maxQuantity) {
      updatedQuantity(quantity + 1)
    }
    return
  }

  const onRemove = () => {
    if (quantity> 1) {
      updatedQuantity(quantity- 1)
    }
    return
  }


  return (
    <Box display='flex' alignItems='center'>
        <IconButton onClick={onRemove}>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{width: 40, textAlign: 'center'}}>{quantity}</Typography>
        <IconButton onClick={onAdd}>
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
