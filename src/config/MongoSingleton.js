const { connect, set } = require('mongoose')
const { logger } = require('../middleware/logger')


class MongoSingleton {
    static instance

    constructor() {
        set('strictQuery', false)
        connect('mongodb+srv://tomas:nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            // .then(() => logger.info('conectado a la base de datos'))
            .catch(err => logger.error(err))
    }

    static getInstance() {
        if (this.instance) {
            logger.info('Ya está conectada')
            return this.instance
        }

        this.instance = new MongoSingleton()
        logger.info('conected')
        return this.instance
    }
}





module.exports = MongoSingleton


// const mongoInstance = MongoSingleton.getInstance()
// const otherMongoInstance = MongoSingleton.getInstance()
// MongoSingleton.getInstance()