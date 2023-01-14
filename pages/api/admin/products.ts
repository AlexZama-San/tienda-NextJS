import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../../database/db';
import { IProduct } from '../../../interfaces/products';
import Producto from '../../../models/producto';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '')

type Data = 
| {message: string}
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req,res)
        case 'PUT':
            return updateProducts(req,res)
        case 'POST': 
            return createProduct(req,res)
        default:
            return res.status(405).json({ message: 'Method not allowed' })
    }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
    await connect()
    const products = await Producto.find().sort({ title: 'asc'}).lean()
    await disconnect()

    //TODO: ACTUALIZAR IMAGENES

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })


    res.status(200).json(updatedProducts)
}
async function updateProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { _id = '', images=[] } = req.body as IProduct

    if(!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Invalid id' })
    }

    if(images.length < 2) {
        return res.status(400).json({ message: 'at least 2 images are required' })
    }

    try {
        await connect()
        
        const product = await Producto.findById(_id)
        if(!product) {
            await disconnect()
            return res.status(400).json({ message: 'product not found' })
        }

        //TODO: ACTUALIZAR IMAGENES EN CLOUDINARY
        product.images.forEach(async (image) => {
            if(!images.includes(image)) {
                const [fileID, extension] = image.substring(image.lastIndexOf('/') + 1).split('.')
                console.log(fileID, extension);
                await cloudinary.uploader.destroy(fileID)
            }
        })

        await product.update(req.body)
        await disconnect()

        return res.status(200).json(product)
    } catch (error) {
        console.log(error);
        await disconnect()
        return res.status(500).json({ message: 'Internal server error, check server terminal' })
        
    }

    

}

async function createProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {images = []} = req.body as IProduct

    if(images.length < 2) {
        return res.status(400).json({ message: 'at least 2 images are required' })
    }

    try {
        await connect()
        const productInDB = await Producto.findOne({ slug: req.body.slug })
        if(productInDB) {
            await disconnect()
            return res.status(400).json({ message: 'product already exists with that slug' })
        }

        const product = new Producto(req.body)
        await product.save()
        await disconnect()
        
        return res.status(201).json(product)

    } catch (error) {
        console.log(error);
        await disconnect()
        return res.status(500).json({ message: 'Internal server error, check server terminal' })
    }
}

