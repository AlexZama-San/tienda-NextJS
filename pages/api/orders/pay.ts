import type { NextApiRequest, NextApiResponse } from 'next'

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

async function payOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
    
}
