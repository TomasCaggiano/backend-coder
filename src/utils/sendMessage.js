const twilio = require('twilio')
const config = require('../config/config.js')

const cliente = twilio(config.ACCOUNT_SID, config.AUTH_TOKEN, config.PHONE_NUMBER)

let user = {
    nombre: 'Tomas',
    apellido: 'Caggiano'
}

const sendMessages = async() => cliente.messages.create({
    body: `Gracias ${user.nombre} ${user.apellido} por la compra`,
    from: `whatsapp:${config.PHONE_NUMBER}`,
    to: `whatsapp:${ config.NUMBER_MIO }`
})

module.exports = {
    sendMessages
}