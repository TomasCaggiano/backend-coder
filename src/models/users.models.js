const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'user_premium', 'admin'],
        default: 'user'
    },
    cart: {
        type: Schema.ObjectId,
        ref: 'Carts',
        required: true
    }
});

const usersModel = model('users', usersSchema);

module.exports = {
    usersModel
};