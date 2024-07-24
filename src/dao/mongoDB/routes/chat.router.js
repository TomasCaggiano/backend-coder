import { chatModel } from '../dao/models/chat.model'

const { Router } = require("express");
const router = Router();

router.get("/", async(req, res) => {
    req.io.on("connection", async(socket) => {
        try {
            const messages = await chatModel.find({});
            req.io.emit("server_message", { messages });
            res.render("chat", {
                title: "Chat compunentes",
                styles: "chat.css",
            });
        } catch (error) {
            console.error("Error al obtener los mensajes del chat:", error);
            res.status(500).send("Error interno del servidor");
        }
    });
});

router.post("/", async(req, res) => {
    const { io } = req;
    const { msg } = req.body;

    let result;

    const newMessage = {
        username: username,
        message: msg,
        dateTime: new Date(),
    };

    try {
        result = await chatModel.create(newMessage);
    } catch (e) {
        console.error(e);
        return res.status(500).send("Error interno del servidor");
    }

    io.emit("server_message", {
        ...newMessage,
        lastRow: result._id.toString(),
    });

    res.status(200).send("Mensaje enviado exitosamente");
});

export default {
    router,
};