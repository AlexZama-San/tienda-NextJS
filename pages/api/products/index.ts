import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import Producto from '../../../models/producto';
import { IProduct } from '../../../interfaces/products';
import { SHOP_CONSTANTS } from '../../../database/constants';

type Data = 
| {message: string}
| IProduct[]

// eslint-disable-next-line import/no-anonymous-default-export
export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {

    const {gender = 'all'} = req.query

    let condition = {}

    if(gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)){
        condition = {gender}
    }

    await connect()

    const products = await Producto.find(condition).select('title images price inStock slug -_id').lean()
    await disconnect()

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return res.status(200).json(updatedProducts)
}
