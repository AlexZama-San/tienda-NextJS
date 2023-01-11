import { Grid, Card, CardContent, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
    title: string | number
    description: string
    icon: JSX.Element
    children?: JSX.Element
}


export const SummaryTile: FC<Props> = ({title, description, icon}) => {
  return (
    <Grid item xs={12} sm={4} md={3}>
        <Card sx={{display:'flex'}}>
            <CardContent sx={{width: 50, display:'flex', justifyContent:'center', alignItems:'center'}}>
                {icon}
            </CardContent>
            <CardContent sx={{flex: '1 0 auto', display: 'flex', flexDirection: 'column'}}>
                <Typography variant='h3'>{title}</Typography>
                <Typography variant='caption'>{description}</Typography>
            </CardContent>
        </Card>
    </Grid>
  )
}
