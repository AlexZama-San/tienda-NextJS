import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db'
import { User } from '../../../models/User'
import { IUser } from '../../../interfaces/user';
import { isValidObjectId } from 'mongoose';

type Data = 
| {message: string}
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET':
            return getUsers(req, res)
        case 'PUT':
            return updateUser(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse<Data>) {

    await connect()
    const users = await User.find().select('-password').lean()
    await disconnect()

    return res.status(200).json( users )
}



async function updateUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    
        const {userId='',role=''} = req.body
        if(isValidObjectId(userId)){
            return res.status(400).json({ message: 'Invalid user id' })
        }
        const validRoles = ['admin','SU','SEO', 'client']
        if(!validRoles.includes(role)){
            return res.status(400).json({ message: 'Invalid role' })
        }
        await connect()
        const user = await User.findById(userId)
        if ( !user ) {
            await disconnect()
            return res.status(400).json({ message: 'User not found' })
        }
        user.role = role
        await user.save()

        await disconnect()

        return res.status(200).json( {message: 'Usuario actualizado'} )
}

