

import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db'
import { IProduct } from '../../../interfaces/products'
import Producto from '../../../models/producto'

type Data = 
| {message: string}
| IProduct[]

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}

async function getProductBySlug(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {
        query: { slug },
    } = req

    if (!slug) {
        return res.status(400).json({ message: 'Slug is required' })
    }

    
        try {
            await connect()
            const product = await Producto.find({ slug }).lean()
            await disconnect()
            if (product.length === 0) {
                return res.status(404).json({ message: 'Product not found' })
            }

            return res.status(200).json(product)
            
        } catch (error) {
            
            res.status(500).json({ message: 'Internal server error' })
        }
}
