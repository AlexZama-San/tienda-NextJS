import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import { IProduct } from '../../../interfaces/products';
import Producto from '../../../models/producto';

type Data = 
|{message: string}
|IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return searchProdcuts(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}

async function searchProdcuts(req: NextApiRequest, res: NextApiResponse<Data>) {
    let { q = '' } = req.query

    if(q.length === 0) {
        return res.status(400).json({ message: 'Query is required' })
    }

    q = q.toString().toLowerCase()

        await connect()
        const products = await Producto.find({$text: {$search: q}}).select('title images price inStock slug -_id').lean()
        await disconnect()
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json(products)

    
}
