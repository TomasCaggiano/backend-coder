import { Router } from "express";
import UserManagerDB from '../dao/mognoDB/usersManagerDB.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js'; // Añadir la función validatePassword
import { middlewares } from "../middlewares/auth.middleware.js";
import { Passport } from "passport";
import { generateToken } from "../config/jsonwebtoken.config.js";

export const sessionsRouter = Router();
const userService = new UserManagerDB();

sessionsRouter.get('/github', Passport.authenticate('github', { scope: 'user:email' }), (req, res) => {

})

sessionsRouter.get('/githubcallback', Passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

//Registro de usuario
sessionsRouter.post('/register', async(req, res) => {
    try {
        const { First_name, Last_name, email, password } = req.body;

        // Validar datos
        if (!First_name || !Last_name || !email || !password) {
            return res.status(400).send({ status: 'error', error: 'Complete data' });
        }

        // Validar si el usuario ya existe
        const userExist = await userService.getUserBy({ email });
        if (userExist) {
            return res.status(400).send({ status: 'error', error: 'User already exists' });
        }
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password)
        };

        // Crear nuevo usuario
        const result = await userService.createUser(newUser);
        //datos que se guardan en el token
        const token = generateToken({
            email
        })
        console.log(result);
        res.send({ status: 'success', token })
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
});


sessionsRouter.post('/current', authTokenMiddleware, (req, res) => {
    res.send({ status: 'success', token })
})

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

        if (!isValidPassword(password, { password: userFound.password })) return res.status(401).send({ status: 'error', error: error })

        // Establecer sesión del usuario
        //req.session.user = {
        //    email,
        //    First_name,
        //    admin: userFound.role === 'admin'
        //};
        const token = generateToken({
            email
        })
        res.send({ status: 'success', token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
});





//sessionsRouter.post('/register', Passport.authenticate('register', { failureRedirect: '/failregister' }), async(req, res) => {
//    res.send({ status: 'success', message: 'user registered' })
//})
//sessionsRouter.post('/failregister', async(req, res) => {
//    console.log('fallo el registro')
//    res.send({ error: 'failed' })
//})
//
//sessionsRouter.post('/login', Passport.authenticate('login', { failureRedirect: '/faillogin' }), async(req, res) => {
//    if (!req.user) return res.status(400).send({ status: 'error', error: 'credencial invalidas' })
//    req.session.user = {
//        first_name: req.user.first_name,
//        last_name: req.user.last_name,
//        email: req.user.email
//
//    }
//    res.send({ status: 'success', payload: req.user })
//})
//sessionsRouter.post('/faillogin', (req, res) => {
//    res.send({ error: 'login failed' })
//})

//sessionsRouter.get('/current', middlewares.auth, (req, res) => {
//        res.send('datos sensibles')
//    })



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