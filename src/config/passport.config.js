import passport from 'passport';
import local from 'passport-local'
import UsersManagerMongo from '../dao/mognoDB/usersManagerDB.js';
import { createHash, isValidPassword } from '../utils/bcrypt';
import githubStrategy from 'passport-github2'

const localStrategy = local.Strategy
const userService = UsersManagerMongo()

export const initPassport = () => {
    /*passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name } = req.body
        try {
            let userFound = await userService.getUserBy({ email: username })
            console.log('user not found')
            if (userFound) return done(null, false)
            let newUser = {
                first_name,
                last_name,
                email: username,
                password: createHash(username)
            }
            let result = await userService.createUser(newUser)
            return done(null, result)
        } catch (error) {
            return done('error al crear el usuario' + error)
        }
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await userService.getUserBy({ email: username })
            if (!user) {
                console.log('user not found')
                return done(null, false)
            }
            if (!isValidPassword(password, { password: user.password })) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done('error al loguearse' + error)
        }
    }))*/

    passport.use('github', new githubStrategy({
        clientID: 'Iv23lixwKxV4IpUIzZsx',
        clientSecret: 'c129b7ef3652e584ca11ed71b0a01b0b17635b16',
        callbackURL: 'http://localhost:8000/api/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.getUserBy({ email: profile._jason.email })
                //no existe el user
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._jason.email,
                    password: ''
                }
                let result = await userService.createUser(newUser)
                done(null, result)
            } else {
                done(null, user)
            }

        } catch (error) {
            return done(error)
        }
    }))


    passport.serializeUser((user, done) => {
            done(null, user._id)
        }) // id=> session
    passport.deserializeUser(async(id, done) => {
            try {
                let user = await userService.getUserBy({ _id: id })
                done(null, user)
            } catch (error) {
                done(SyntaxError)
            }
        }) // session => user
}