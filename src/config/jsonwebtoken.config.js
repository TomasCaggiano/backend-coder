import jwt from 'jsonwebtoken'

const PRIVATE_KEY = 'messi181222'

export const generateToken = user => jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24H' })


//calidar que venga por header

export const authTokenMiddleware = (req, res, next) => {
    const authHeather = req.headers.authorization
    if (!authHeather) return res.status(401).send({ status: 'error', error: 'not authenticator' })
    const token = authHeather.split(' ')[1]
    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if (error) return res.status(401).send({ status: 'error', error: 'not authorized' })
        req.user = credential.user
        next()
    })
}