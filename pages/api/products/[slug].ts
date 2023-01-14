

import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db'
import { IProduct } from '../../../interfaces/products'
import Producto from '../../../models/producto'

type Data = 
| {message: string}
| IProduct[]
| IProduct

// eslint-disable-next-line import/no-anonymous-default-export
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
            const product = await Producto.findOne({ slug }).lean()
            await disconnect()
            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }

            product.images = product.images.map(image => {
                return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
            })

            return res.status(200).json(product)
            
        } catch (error) {
            
            res.status(500).json({ message: 'Internal server error' })
        }
}
