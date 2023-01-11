import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces/order';
import { connect, disconnect } from '../../../database/db';
import Producto from '../../../models/producto';
import { Order } from '../../../models/Order';
import { format } from '../../../utils/currency';

type Data = 
|{message: string}
| IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method){
        case 'POST':
            return createOrder (req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }

}

async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    const {orderItems, total} = req.body as IOrder
    // validar que un usuario este logueado
    const session: any = await getSession({req})

    if (!session) {
        return res.status(401).json({message: 'Debe estar autenticado con su cuenta para poder realizar un pedido'})
    }

    // Crear un arreglo con los productos
    const productIDs = orderItems.map(item => item._id)
    await connect()
    const dbProducts = await Producto.find({_id: {$in: productIDs}})

    try {
        
        const subtotal = orderItems.reduce((acc, item) => {

            const currentPrice = dbProducts.find(product => product.id === item._id)?.price
            if (!currentPrice) {
                console.log('error de precio del producto')
                throw new Error('Verifique el carrito de nuevo')
            }

            return (item.quantity * currentPrice) + acc
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
        const backendTotal = Math.round((subtotal * (1 + taxRate))*100) / 100

        if (total !== backendTotal) {
            
            console.log('error de precio total')
            throw new Error('Verifique el carrito de nuevo')
        }

        // todo bien hasta aqui

        const userId = session.user._id
        const newOrder = new Order({...req.body, isPaid: false, user: userId})
        await newOrder.save()
        await disconnect()

        return res.status(201).json(newOrder)



    } catch (error: any) {
        await disconnect
        console.log(error)
        res.status(400).json({
            message: error.message || 'Error al crear el pedido'
        })
    }


    return res.status(201).json(req.body)
}
