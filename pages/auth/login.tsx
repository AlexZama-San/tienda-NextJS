import { GetServerSideProps } from 'next'
import { Box, Grid, Typography, TextField, Button, Link, Chip, Divider } from '@mui/material';
import { AuthLayout } from "../../components/layouts/AuthLayout"
import NextLink from 'next/link'
import { useForm } from 'react-hook-form';
import { isValidEmail } from '../../utils/validations';
import tiendaApi from '../../api/tiendaApi';
import { ErrorOutline } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

type FormData = {
    email: string;
    password: string;
  };

const LoginPage = () => {
    const router = useRouter()
    // const { loginUser } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)

    const [providers, setProviders] = useState<any>({})

    useEffect(() => {
      getProviders().then(data => setProviders(data))
    }, [])
    
    

    const onLoginUser = async({email, password}: FormData) => {

        setShowError(false)
        
        // const isValidLogin = await loginUser(email, password)

        // if ( !isValidLogin ) {
        //     setShowError(true)
        //     setTimeout(() => setShowError(false), 5000)
        //     return
        // }
        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)

        await signIn('credentials', {email, password})

    }

  return (
    <AuthLayout title={"Ingresar"}>
        <form onSubmit={handleSubmit(onLoginUser)}>
            <Box sx={{width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component='h1'>
                            Iniciar sesión
                        </Typography>
                        <Chip 
                            label='No se reconoce tu correo o contraseña'
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                            sx={{display: showError ? 'flex' : 'none'}}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField type='email' label='correo' variant='filled' fullWidth {
                            ...register('email', {
                                required: 'El correo es requerido',
                                validate: isValidEmail
                            })
                            }
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField label='contraseña' variant='filled' fullWidth {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} passHref legacyBehavior>
                            <Link underline='always'>
                                ¿No tienes cuenta? Regístrate
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                        <Divider sx={{width: '100%', mb: 2}} />
                        {
                            Object.values(providers).map((provider: any) => {
                                if (provider.id === 'credentials') return null
                                return (
                                    <Button key={provider.id} onClick={() => signIn(provider.id)} variant='outlined' fullWidth color='primary' sx={{mb: 1}}>
                                        Ingresar con {provider.name}
                                    </Button>
                                )
                            })
                        }
                    </Grid>

                </Grid>

            </Box>
        </form>
        
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const session = await getSession({req}) // your fetch function here 
    const { p='/' } = query

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return {
        props: {
            
        }
    }
}

export default LoginPage