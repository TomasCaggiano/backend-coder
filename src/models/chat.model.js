import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

const Chat = mongoose.model('messages', chatSchema);

export default Chat;