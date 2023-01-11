import { User } from '../models/User';
import { connect, disconnect } from './db';
import bcrypt from 'bcryptjs';
export const checkUserEmailPassword = async (email: string, password: string) => {
    await connect()
    const user = await User.findOne({ email})
    await disconnect()

    if ( !user ) {
        return null
    }

    if ( !bcrypt.compareSync(password, user.password!) ) {
        return null
    }

    const { role, name, _id} = user

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name,
    }
}


export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {

    await connect()
    const user = await User.findOne({ email: oAuthEmail})

    if ( user ) {
        await disconnect()
        const { _id, name, role, email} = user
        return {
            _id,
            email,
            role,
            name,
        }
    }

    const newUser = new User({email: oAuthEmail, name: oAuthName, password: '@', role: 'client'})
    await newUser.save()
    await disconnect()

    const { _id, name, role, email} = newUser

    return {
        _id,
        email,
        role,
        name,
    }
}