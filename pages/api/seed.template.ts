
import type { NextApiRequest, NextApiResponse } from 'next'
import { connect, disconnect } from '../../database/db';

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if( process.env.NODE_ENV === 'production' ) {
        return res.status(401).json({ name: 'Not allowed' })
    }

    await connect();
    // Aqui dentro se puede colocar el codigo que se requiera para poblar la base de datos

    await disconnect();

    res.status(200).json({ name: 'Proceso realizado correctamente' })

}