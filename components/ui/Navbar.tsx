
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import NextLink from "next/link"
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';
import { ClearOutlined } from '@mui/icons-material';
import { CartContext } from '../../context/cart/CartContext';


const Navbar = () => {
  const router = useRouter();
  const categoriaActual = router.pathname.split('/')[2]
  const [searchTerm, setSearchTerm] = useState('')
  const [searchVisible, setSearchVisible] = useState(false)
  const {cart, numberOfItems} = useContext(CartContext)

  const {toggleSideMenu} = useContext(UiContext)

const onSearchTerm = () =>{
    if(searchTerm.trim().length === 0) return
    router.push(`/search/${searchTerm}`)
}


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
    
        <Box sx={{display: searchVisible ? 'none' : {xs: 'none', sm: 'block'}}} className='fadeIn'>
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button color={categoriaActual === 'men' ? 'primary' : 'info'}>
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button color={categoriaActual === 'women' ? 'primary' : 'info'}>
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button color={categoriaActual === 'kid' ? 'primary' : 'info'}>
                Niños
              </Button>
            </Link>
          </NextLink>

        </Box>

        <Box flex={1}/>

        {/* Pantallas pequeñas */}
        {
          searchVisible ? (
            <Input
                sx={{display: {xs: 'none', sm: 'flex'}}}
                autoFocus
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && onSearchTerm()}
                type='text'
                placeholder="Buscar..."
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setSearchVisible(false)}
                            aria-label="toggle password visibility"
                        >
                         <ClearOutlined />
                        </IconButton>
                    </InputAdornment>
                }
            />

          ) :
          (
            <IconButton onClick={() => setSearchVisible(true)} className='fadeIn'>
              <SearchOutlined />
            </IconButton> 
          )
        }


        {/* Pantallas grandes */}
        <IconButton sx = {{display: {xs: 'flex', sm: 'none'}}} onClick={toggleSideMenu}>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar