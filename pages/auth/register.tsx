import { GetServerSideProps } from 'next'
import { Box, Grid, Typography, TextField, Button, Link, Chip } from "@mui/material"
import NextLink from "next/link"
import { useState, useContext } from 'react';
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { isValidEmail } from '../../utils/validations';
import tiendaApi from '../../api/tiendaApi';
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { AuthContext } from '../../context/auth/AuthContext';
import { getSession, signIn } from 'next-auth/react';


type FormData = {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {

    const router = useRouter()
    const {registerUser} = useContext(AuthContext)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async ({name, email, password}: FormData) => {

        setShowError(false)
        const resp = await registerUser(name, email, password)

        if ( resp.hasError ) {
            setShowError(true)
            setErrorMessage(resp.message!)
            setTimeout(() => setShowError(false), 5000)
            return
        }
        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)

        await signIn('credentials', {email, password})
    }
  return (
    <AuthLayout title={"Registro"}>
    <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{width: 350, padding: '10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" component='h1'>
                        Crear cuenta
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
                    <TextField label='Nombre' variant='filled' fullWidth {
                        ...register('name', {
                            required: 'El nombre es requerido',
                            minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField label='correo' variant='filled' fullWidth {
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
                        helperText={errors.password?.message}/>
                </Grid>

                <Grid item xs={12}>
                    <Button type="submit" color='secondary' className='circular-btn' size='large' fullWidth>
                        Crear cuenta
                    </Button>
                </Grid>

                <Grid item xs={12} display='flex' justifyContent='end'>
                    <NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} passHref legacyBehavior>
                        <Link underline='always'>
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </NextLink>
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


export default RegisterPage