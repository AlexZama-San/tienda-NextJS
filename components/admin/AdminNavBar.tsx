
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';
import { CartContext } from '../../context/cart/CartContext';


const AdminNavbar = () => {
  const {toggleSideMenu} = useContext(UiContext)

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>TIENDA |</Typography>
            <Typography sx={{ml: 0.5}}>SHOP</Typography>
          </Link>
        </NextLink>

        <Box flex={1}/>

        <Button onClick={toggleSideMenu}>
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default AdminNavbar