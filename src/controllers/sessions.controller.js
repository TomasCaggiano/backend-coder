import UserManagerDB from '../dao/mognoDB/usersManagerDB.js';
import CartsManagerDB from "../dao/mognoDB/cartManagerDB.js";
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from "../config/jsonwebtoken.config.js";

const userService = new UserManagerDB();
const cartManager = new CartsManagerDB();

class SessionsController {
    static githubAuth = (req, res) => {
        passport.authenticate('github', { scope: 'user:email' })(req, res);
    }

    static githubCallback = (req, res) => {
        passport.authenticate('github', { failureRedirect: '/login' })(req, res, () => {
            req.session.user = req.user;
            res.redirect('/products');
        });
    }

    static register = async(req, res) => {
        try {
            const { first_name, last_name, email, password, age } = req.body;

            if (!first_name || !last_name || !email || !password || !age) {
                return res.status(400).send({ status: 'error', error: 'Complete data' });
            }

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

            const result = await userService.createUser(newUser);

            const token = generateToken({ email });
            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            }).send({ status: 'success' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: 'error', error: 'Internal server error' });
        }
    }

    static login = async(req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).send({ status: 'error', error: 'Complete data' });
            }

            const userFound = await userService.getUserBy({ email });

            if (!userFound) {
                return res.status(401).send({ status: 'error', error: 'Invalid credentials' });
            }

            if (!isValidPassword(password, userFound.password)) {
                return res.status(401).send({ status: 'error', error: 'Invalid password' });
            }

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
    }

    static logout = (req, res) => {
        req.session.destroy(error => {
            if (error) {
                console.error(error);
                return res.status(500).send({ status: 'error', error: 'Failed to logout' });
            }
            res.send('Logged out');
        });
    }

    static current = (req, res) => {
        if (!req.user) {
            return res.status(401).send({ status: 'error', message: 'Unauthorized' });
        }
        res.send({ status: 'success', user: req.user });
    }
}

export default SessionsController;