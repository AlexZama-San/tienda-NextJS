import type { NextApiRequest, NextApiResponse } from 'next'
import async from '../seed';
import { connect, disconnect } from '../../../database/db';
import Producto from '../../../models/producto';
import { IProduct } from '../../../interfaces/products';
import { SHOP_CONSTANTS } from '../../../database/constants';

type Data = 
| {message: string}
| IProduct[]

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

    return res.status(200).json(products)
}
