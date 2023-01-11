import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
    if( !process.env.JWT_SECRET_SEED ) {
        throw new Error('JWT_SECRET is not defined')
    }

    return jwt.sign({ 
        _id,
        email
    },
    
    process.env.JWT_SECRET_SEED,
    
    {
        expiresIn: '15d'
    }
    )
}

export const isValidToken = ( token: string ): Promise<string> => {
    if( !process.env.JWT_SECRET_SEED ) {
        throw new Error('JWT_SECRET is not defined')
    }

    if( token.length < 10 ) {
        return Promise.reject('Invalid token')
    }

    return new Promise( (resolve, reject) => {
        try {
            
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, decoded) => {
                if( err ) {
                    reject('Invalid token')
                } 

                const {_id } = decoded as { _id: string }

                resolve(_id)
            })


        } catch (error) {
            reject('Invalid token')
        }
    })
}