// routes/sessions.routes.js
import { Router } from "express";
import SessionsController from '../controllers/sessions.controller.js';
import passport from "passport";
import { authorization } from "../middlewares/authorizationJWT.js";

export const sessionsRouter = Router();

sessionsRouter.get('/github', SessionsController.githubAuth);
sessionsRouter.get('/githubcallback', SessionsController.githubCallback);

sessionsRouter.post('/register', SessionsController.register);
sessionsRouter.post('/login', SessionsController.login);
sessionsRouter.post('/current', passport.authenticate('jwt', { session: false }), authorization('admin'), SessionsController.current);

sessionsRouter.get('/logout', SessionsController.logout);

export default sessionsRouter;