import { Router } from "express";
import userManagerDB from '../dao/mognoDB/usersManagerDB.js'
import auth from '../middlewares/auth.middleware.js'
export const sessionsRouter = Router()
    //login, register, logout

const userService = new userManagerDB

sessionsRouter.post('/register', async(req, res) => {
    try {

        const { First_name, Last_name, email, password } = req.body

        //validar datos
        if (!First_name || !password) res.status(401).send({ status: 'error', error: 'complete data' })

        //validar si existe
        const userExist = await userService.getUserBy({ email })
        if (userExist) return res.status(401).send({ status: 'error', error: 'user already exist' })

        const newUser = {
            First_name,
            Last_name,
            email,
            password
        }

        const result = await userService.createUser(newUser)
            //validar error
        console.log(result)
        res.send('registered successfuly')
    } catch (error) {
        console.log(error)
    }
})

sessionsRouter.post('login', async(req, res) => {
    const { email, password } = req.body

    if (!email || !password) res.status(401).send({ status: 'error', error: 'complete data' })

    const userFound = await userService.getUserBy({ email, password })

    if (!userFound) return res.status(401).send({ status: 'error', error: 'user not found' })
    req.session.user = {
        email,
        First_name,
        Last_name,
        admin: userFound.role === 'admin'
    }
    if (admin) return req.render('/products')
    req.render('login succeded')
})

sessionsRouter.get('/current', auth, (req, res) => {
    res.send('sensible data')
})



sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send({ status: 'error', error: error })
        else return res.send('logout')
    })
})