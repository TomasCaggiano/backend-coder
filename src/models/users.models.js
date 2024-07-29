import { Schema, model } from "mongoose";

const users = 'usuarios'

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: 'string',
    role: {
        type: String,
        default: 'user'
    }
})

export const userModel = model(users, userSchema)