import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { PaypalOrderStatusResponse } from '../../../interfaces/paypal';
import { connect, disconnect } from '../../../database/db';
import { Order } from '../../../models/Order';
import { getSession } from 'next-auth/react';

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

    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')

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
    const paypalBearerToken = await getPaypalBearerToken()

    if (!paypalBearerToken) {
        return res.status(500).json({ message: 'Error getting paypal token' })
    }

    const {transactionID= '', orderID= ''} = req.body

    const {data} = await axios.get<PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionID}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`,
        }
    })

    if (data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Order not completed' })
    }

    await connect()
    const dbOrder = await Order.findById(orderID)
    if(!dbOrder) {
        await disconnect()
        return res.status(400).json({ message: 'La orden no existe' })
    }

    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await disconnect()
        return res.status(400).json({ message: 'El total no coincide' })
    }

    const session: any = await getSession({req})

    if (!session) {
        await disconnect()
        return res.status(401).json({ message: 'No autorizado' })
    }

    if (dbOrder.user!.toString() !== session.user._id) {
        await disconnect()
        return res.status(401).json({ message: 'No autorizado' })
    }

    dbOrder.transactionId = transactionID
    dbOrder.isPaid = true
    await dbOrder.save()

    await disconnect()

    return res.status(200).json({ message: 'Orden pagada' })
}
