import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import { User } from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/jwt';
import { isValidEmail } from '../../../utils/validations';

type Data = 
|{message: string}
|{
    token: string,
    user: {
        name: string,
        email: string,
        role: string
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }


}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { email = '', password = '', name = '' } = req.body as {email: string, password: string, name: string}

    if(password.length < 6) {
        return res.status(401).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }    
    if(password.length < 2) {
        return res.status(401).json({ message: 'El nombre debe tener al menos 2 caracteres' })
    }
    await connect();
    const user = await User.findOne({email})

    if ( !isValidEmail(email) ) {
        return res.status(401).json({ message: 'El email no parece ser válido' })
    }

    if(user) {
        await disconnect();
        return res.status(401).json({ message: 'El email ya está registrado' })
    }


    const newUser = new User({
        name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client'
    })

    try {
        await newUser.save({validateBeforeSave: true})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error, check the server logs' })
    }

    const {_id, role} = newUser

    const token = signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            name,
            email,
            role
        }
    })
}
