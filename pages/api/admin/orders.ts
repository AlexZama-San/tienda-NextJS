import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db'
import { Order } from '../../../models/Order'
import { IOrder } from '../../../interfaces/order';

type Data = 
| {message: string}
| IOrder[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method) {
        case 'GET':
            return getOrders(req, res)
        default:
            return res.status(405).json({message: 'Method not allowed'})
    }
}

async function getOrders(req: NextApiRequest, res: NextApiResponse<Data>) {
    await connect()
    const orders = await Order.find().sort({createdAt: 'desc'}).populate('user', 'name email').lean()
    await disconnect()

    return res.status(200).json(orders)
}
