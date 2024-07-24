import { Schema, model } from "mongoose";

const users = 'usuarios'

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        require: true,
        unique: true,
    }
})

export const userModel = model(users, userSchema)