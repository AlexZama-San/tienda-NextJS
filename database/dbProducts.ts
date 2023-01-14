import { connect, disconnect } from './db';
import Producto from '../models/producto';
import { IProduct } from '../interfaces/products';


export const getProductsBySlug = async (slug: string): Promise<IProduct | null> => {

    await connect()

    const product = await Producto.findOne({slug}).lean()

    await disconnect()

    if(!product) return null

    //TODO: ACTUALIZAR IMAGENES
    product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    })


    return JSON.parse(JSON.stringify(product))
}

interface ProductSlug {
    slug: string;
}

export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {

    await connect()
    const slugs = await Producto.find().select('slug -_id').lean()
    await disconnect()

    return slugs
}

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {

    term = term.toString().toLowerCase()
        await connect()
        const products = await Producto.find({$text: {$search: term}}).select('title images price inStock slug -_id').lean()
        await disconnect()

        const updatedProducts = products.map(product => {
            product.images = product.images.map(image => {
                return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
            })

            return product
        })

    
        return updatedProducts
}

export const getAllProducts = async (): Promise<IProduct[]> => {

    await connect()
    const products = await Producto.find().lean()
    await disconnect()

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return JSON.parse(JSON.stringify(products))
}