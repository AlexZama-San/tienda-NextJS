import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { countries } from '../../utils/countries';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context/cart/CartContext';

type FormData = {
    name: string;
    lastName: string;
    address: string;
    address2?: string;
    city: string;
    country: string;
    zip: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {

    
    return {
        name: Cookies.get('name') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        zip: Cookies.get('zip') || '',
        phone: Cookies.get('phone') || '',
    }
}

const AddressPage = () => {

    const router = useRouter()
    const {updateAddress} = useContext(CartContext)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            name: '',
            lastName: '',
            address: '',
            address2: '',
            city: '',
            country: countries[0].code,
            zip: '',
            phone: ''
        }
    });

    useEffect(() => {
      reset(getAddressFromCookies())
    }, [reset])
    


    const submitAddress = (data: FormData) => {
        updateAddress(data)
        router.push('/checkout/summary')
    }

  return (
    <ShopLayout title={'Dirección'} pageDescription={'Confirmar direccion del destino'}>
        <Typography variant='h1' component='h1'>Dirección</Typography>
        <form onSubmit={handleSubmit(submitAddress)}>
            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs={12} sm={6}>
                    <TextField label='Nombre' variant='filled' fullWidth {
                            ...register('name', {
                                required: 'El nombre es requerido',
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField label='Apellido' variant='filled' fullWidth {
                            ...register('lastName', {
                                required: 'El apellido es requerido',
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField label='Dirección' variant='filled' fullWidth {
                            ...register('address', {
                                required: 'la direccion es requerida',
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField label='Dirección 2 (Opcional)' variant='filled' fullWidth {
                            ...register('address2')
                            }/>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField label='Ciudad' variant='filled' fullWidth {
                            ...register('city', {
                                required: 'La ciudad es requerido',
                            })
                            }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField label='Codigo Postal' variant='filled' fullWidth {
                            ...register('zip', {
                                required: 'el codigo postal es requerido',
                            })
                            }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                            />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <Select 
                            variant='filled'
                            label='País'
                            defaultValue={Cookies.get('country') || countries[0].name}
                            {
                                ...register('country', {
                                    required: 'El País es requerido',
                                })
                                }
                                error={!!errors.country}
                            >
                            {
                                countries.map((country) => (
                                    <MenuItem key={country.code} value={country.name}>{country.name}</MenuItem>
                                ))
                            }
                        </Select>
                        
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <TextField label='Telefono' variant='filled' fullWidth {
                            ...register('phone', {
                                required: 'El Telefono es requerido',
                            })
                            }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            />
                </Grid>

            </Grid>


            <Box sx={{mt:5}} display='flex' justifyContent='center'>
                <Button type='submit' color='secondary' className='circular-btn' size='large'>
                    Revisar pedido
                </Button>
            </Box>
        </form>

    </ShopLayout>
  )
}
// You should use getServerSideProps when:
// // - Only if you need to pre-render a page whose data must be fetched at request time

//VERSION ANTIGUA DE REVISION DE AUTENTICACION
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
    
//     const {token = ''} = ctx.req.cookies
//     let validToken = false

//     try {
//         await isValidToken(token)
//         validToken = true
//     } catch (error) {
//         validToken = false
//     }

//     if(!validToken){
//         return {
//             redirect: {
//                 destination: '/auth/login?p=checkout/address',
//                 permanent: false
//             }
//         }
//     }
//     return {
//         props: {
            
//         }
//     }
// }

// 

export default AddressPage