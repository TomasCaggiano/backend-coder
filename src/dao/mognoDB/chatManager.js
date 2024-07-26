import { ChatModel } from '../../models/chat.model.js';

class ChatManager {
    // Obtener todos los mensajes
    async getMessages() {
        return await ChatModel.find().exec();
    }

    // Agregar un nuevo mensaje
    async addMessage(user, message) {
        return await ChatModel.create({ user, message });
    }
}

export default ChatManager;