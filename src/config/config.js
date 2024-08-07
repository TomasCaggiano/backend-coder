const MongoStore = require('connect-mongo')
const { connect } = require('mongoose')
const dotenv = require('dotenv')
const { commander } = require('../utils/commander')
const MongoSingleton = require('./MongoSingleton')

const { mode } = commander.opts()

const enviroment = mode || "development"

dotenv.config({
    path: enviroment === 'development' ? './.env.development' : './.env.production'
})

const url = process.env.MONGO_URL || 'mongodb+srv://tomas:nagualpete777@cluster0.qmf3jac.mongodb.net/ecommerce?retryWrites=true&w=majority'

exports.config = {
    PORT: process.env.PORT || 8080,
    TEST_MAIL: process.env.TEST_MAIL_ADMIN || '',
    MAIL_PASS: process.env.TEST_MAIL_PASS || '',
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
    NUMBER_MIO: process.env.NUMBER_MIO || '',
    adminName: process.env.ADMIN_NAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    persistence: process.env.PERSISTENCE || 'MONGO',
    jwt_private_key: process.env.JWT_PRIVATE_KEY || '',
    base_url: process.env.BASE_URL || '',
    MONGO_URL: url,
    dbConnection: async() => await MongoSingleton.getInstance(),
    session: {
        store: MongoStore.create({
            mongoUrl: url,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 15000000000
        }),
        secret: 's3cr3t0',
        resave: false,
        saveUninitialized: false,
    }
}