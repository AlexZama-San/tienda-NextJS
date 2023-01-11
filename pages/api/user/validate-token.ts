import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import { User } from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken, isValidToken } from '../../../utils/jwt';

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
        case 'GET':
            return checkJWT(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }


}

async function checkJWT(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { token = '' } = req.cookies

    let userID = ''

    try{
        userID = await isValidToken(token)
    }catch(error) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }



    await connect();
    const user = await User.findById(userID).lean()
    await disconnect();
    if(!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { _id, email, name, role } = user
        
    return res.status(200).json({
        token: signToken(_id, email),
        user: {
            name,
            email,
            role
        }
    })
}
