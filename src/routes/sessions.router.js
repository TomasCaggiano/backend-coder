import { Router } from "express";
import UserManagerDB from '../dao/mognoDB/usersManagerDB.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { middlewares } from "../middlewares/auth.middleware.js";
import passport from "passport";
import { generateToken } from "../config/jsonwebtoken.config.js";
import { passportCall } from "../middlewares/passportcall.js";
import { authorization } from "../middlewares/authorizationJWT.js";
import CartsManagerDB from "../dao/mognoDB/cartManagerDB.js";

export const sessionsRouter = Router();
const userService = new UserManagerDB();
const cartManager = new CartsManagerDB();

sessionsRouter.get('/github', passport.authenticate('github', { scope: 'user:email' }), (req, res) => {});

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

// Registro de usuario
sessionsRouter.post('/register', async(req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body; // Asegurarse de incluir 'age'

        // Validar datos
        if (!first_name || !last_name || !email || !password || !age) { // Validar 'age'
            return res.status(400).send({ status: 'error', error: 'Complete data' });
        }

        // Validar si el usuario ya existe
        const userExist = await userService.getUserBy({ email });
        if (userExist) {
            return res.status(400).send({ status: 'error', error: 'User already exists' });
        }
        const newCart = await cartManager.createCart();

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id
        };

        // Crear nuevo usuario
        const result = await userService.createUser(newUser);

        // Datos que se guardan en el token
        const token = generateToken({ email });
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true
        }).send({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
});

sessionsRouter.post('/current', passport.authenticate('jwt', { session: false }), authorization('admin'), (req, res) => {
    if (!req.user) {
        return res.status(401).send({ status: 'error', message: 'Unauthorized' });
    }
    res.send({ status: 'success', user: req.user });
});

// Inicio de sesión de usuario
sessionsRouter.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: 'error', error: 'Complete data' });
        }

        // Buscar el usuario por email
        const userFound = await userService.getUserBy({ email });

        if (!userFound) {
            return res.status(401).send({ status: 'error', error: 'Invalid credentials' });
        }

        // Validar la contraseña
        if (!isValidPassword(password, userFound.password)) { // Corregido para comparar correctamente
            return res.status(401).send({ status: 'error', error: 'Invalid password' });
        }

        // Generar token y establecer cookie
        const token = generateToken({
            id: userFound._id,
            email,
            role: userFound.role
        });

        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true
        }).send({ status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
});

// Cierre de sesión de usuario
sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error(error);
            return res.status(500).send({ status: 'error', error: 'Failed to logout' });
        }
        res.send('Logged out');
    });
});

export default sessionsRouter;