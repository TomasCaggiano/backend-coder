const express = require('express')
const cookieParser = require('cookie-parser')
const { engine } = require('express-handlebars')

const cors = require('cors')
    // socket io 
const { config: configObject } = require('./config/config.js')

const { Server: HttpServer } = require('http')
const { Server: ServerIo } = require('socket.io')
const { initChatSocket, initProductsSocket } = require('./utils/socket.js')
const { router } = require('./routes')


const { initializePassport } = require('./config/passport.config.js')
const passport = require('passport')
const { addLogger, logger } = require('./middleware/logger.js')
const { dirname } = require('node:path')

//swagger
const swaggerJsDocs = require('swagger-jsdoc')
const swaggerUIExpress = require('swagger-ui-express')


const app = express()
const httpServer = new HttpServer(app)
const io = new ServerIo(httpServer)
const PORT = configObject.PORT

// handlebars
// const handlebars = require('express-handlebars')
app.engine('hbs', engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')



// app.use(logger('dev'))
app.use(cors())
app.use('/virtual', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
    // session mongo
    // app.use(session(configObject.session))

//swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'documentación de API REST',
            description: 'API REST para un e-commerce',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDocs(swaggerOptions)

// passport 
initializePassport()
app.use(passport.initialize())
    // app.use(passport.session())
    // passport
app.use(addLogger)

app.use(router)

app.use('/apiDocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

// socket
initChatSocket(io)
initProductsSocket(io)

const initServer = async() => {
    return await httpServer.listen(PORT, err => {
        if (err) logger.info(err)
        logger.info(`Escuchando en el puerto ${PORT}`)
    })
}

module.exports = {
    initServer
}