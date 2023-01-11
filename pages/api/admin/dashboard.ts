import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import { Order } from '../../../models/Order';
import { User } from '../../../models/User';
import Producto from '../../../models/producto';

type Data = {
    numberOfOrders: number
    PaidOrders: number // isPaid true
    notPaidOrders: number
    numberOfClients: number // solo clientes
    numberOfProducts: number
    ProductsWithNoStock: number
    ProductsWithLowStock: number // menos de 10

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await connect()
        // const numberOfOrders = await Order.countDocuments()
        // const PaidOrders = await Order.countDocuments({isPaid: true})
        // const notPaidOrders = await Order.countDocuments({isPaid: false})
        // const numberOfClients = await User.countDocuments({role: 'client'})
        // const numberOfProducts = await Producto.countDocuments()
        // const ProductsWithNoStock = await Producto.countDocuments({inStock: 0})
        // const ProductsWithLowStock = await Producto.countDocuments({inStock: {$lte: 10}})

        const [
            numberOfOrders,
            PaidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            ProductsWithNoStock,
            ProductsWithLowStock,
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({isPaid: true}),
            Order.countDocuments({isPaid: false}),
            User.countDocuments({role: 'client'}),
            Producto.countDocuments(),
            Producto.countDocuments({inStock: 0}),
            Producto.countDocuments({inStock: {$lte: 10}}),
        ])

    await disconnect()


    res.status(200).json({
        numberOfOrders,
        PaidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        ProductsWithNoStock,
        ProductsWithLowStock,
    })
}