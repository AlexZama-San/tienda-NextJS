import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import { User } from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/jwt';

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
            return loginUser(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }


}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { email = '', password = '' } = req.body

    await connect();
        const user = await User.findOne({email})
    await disconnect();

    if(!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    if( !bcrypt.compareSync(password, user.password!) ) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const {role, name, _id} = user

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
