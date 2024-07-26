import mongoose from 'mongoose';

// Definir el esquema para los mensajes del chat
const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Incluye timestamps para cada mensaje

// Crear el modelo basado en el esquema
const ChatModel = mongoose.model('messages', chatSchema);

export { ChatModel };