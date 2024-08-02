//import { connect, mongo } from 'mongoose'
//import dotenv from 'dotenv' 
//import { program } from '../utils/commander.js'
//import { MongoSingleton } from '../utils/MongoSingleton.js'
//
//const { mode } = program.opts()
//
//dotenv.config({
//    path: mode === 'production' ? './.env.production' : './.env.development'
//})
//
//
//export const objectConfig = {
//    port: process.env.PORT || 8080,
//    mongo_url: process.env.MONGO_URL,
//    jwt_private_key: process.env.JWT_PRIVATE_KEY,
//}

//export const connectDb = async () => {
//    // logger.info('base de datos conectada')
//    // connect(process.env.MONGO_URL)
//    MongoSingleton.getInstance()
//}

/*env:#PORT=8000
#JWT_PRIVATE_KEY=codersecret
#MONGO_URL=mongodb+srv://tomas:nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority */