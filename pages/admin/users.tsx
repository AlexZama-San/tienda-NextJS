import React from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Select, MenuItem } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid/models';
import useSWR from 'swr';
import { IUser } from '../../interfaces/user';
import tiendaApi from '../../api/tiendaApi';
import { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material';

const UsersPage = () => {

    const {data, error} = useSWR<IUser[]>('/api/admin/users')
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
      if(data) setUsers(data)
    
    }, [data])
    

    if (!data && !error) return (<div>Cargando...</div>)

    const onRoleChange = async(userId: string, newRole: string) => {
        const previosUsers = users.map( user => ({...user}))
        const updatedUsers = users.map(user => ({
            ...user,
            role: user._id === userId ? newRole : user.role
        }))

        setUsers(updatedUsers)

        try {
            await tiendaApi.put('/admin/users', {userId, role: newRole})
        } catch (error) {
            setUsers(previosUsers)
            console.log(error)
            alert('Error al actualizar el rol del usuario, intente nuevamente o contacte al administrador')
        }

    } 

    const columns: GridColDef[] = [
        {field: 'email', headerName: 'Correo', width: 250},
        {field: 'name', headerName: 'Nombre completo', width: 300},
        {field: 'role', headerName: 'Rol', width: 300, renderCell: ({row}: GridRenderCellParams) => {
            return (
                <Select value={row.role} label='Rol' sx={{width: '300px'}} onChange={({target})=> onRoleChange(row.id, target.value)}>
                    <MenuItem value='admin' >admin</MenuItem>
                    <MenuItem value='client' >client</MenuItem>
                    <MenuItem value='SU' >SU</MenuItem>
                    <MenuItem value='SEO' >SEO</MenuItem>

                </Select>
            )
        }}

    ]

    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: `${user.name}`,
        role: user.role
    }))


  return (
    <AdminLayout title={'Usuarios'} pageDescription={'Mantenimiento de Usuarios'} icon={<PeopleOutline />}>
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default UsersPage