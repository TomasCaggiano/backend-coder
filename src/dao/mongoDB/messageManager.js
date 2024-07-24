import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

class MessageManager {
    async getMessages() {
        try {
            return await Message.find().lean();
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    }

    async addMessage(user, message) {
        try {
            const newMessage = new Message({ user, message });
            return await newMessage.save();
        } catch (error) {
            console.error('Error adding message:', error);
            throw error;
        }
    }
}

export default MessageManager;