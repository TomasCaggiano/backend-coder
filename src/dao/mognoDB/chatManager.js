import Chat from '../../models/chat.model.js';

class ChatManager {
    async addMessage(user, message) {
        try {
            const newMessage = new Chat({ user, message });
            await newMessage.save();
        } catch (error) {
            console.error('Error adding message:', error);
        }
    }

    async getMessages() {
        try {
            return await Chat.find({});
        } catch (error) {
            console.error('Error retrieving messages:', error);
            return [];
        }
    }
}

export default ChatManager;