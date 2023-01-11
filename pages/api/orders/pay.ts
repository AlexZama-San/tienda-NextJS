import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return payOrder(req, res)

        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}

const getPaypalBearerToken = async():Promise<string|null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)

    const body = new URLSearchParams('grant_type=client_credentials')
    try {
        const {data} = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        return data.access_token
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data)
        }else{
            console.log(error)
        }

        return null
    }
}

async function payOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
    
}
