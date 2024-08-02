import { Router } from 'express'
import { middlewares } from '../middlewares/auth.middleware.js';
import { fork } from 'child_process';
const router = Router()

//function suma() {
//    let result = 0
//    for (let i = 0; i < 3e4; i++) {
//        result += 1
//    }
//    return result
//}
//router.get('/simple', (req, res) => {
//    const result = suma()
//    res.send({ result })
//})

router.get('/compleja', (req, res) => {
    const child = fork('./src/routes/operacionCompleja.js')
    child.send('inicia el calculo')
    child.on('message', result => {
        res.send({ result })
    })

})

router.get('/setCookie', (req, res) => {
    res.cookie('CoderCookie', 'this is a cookie', { maxAge: 10000 }).send('Cookie set');
});
router.get('/setCookieSigned', (req, res) => {
    res.cookie('CoderCookie', 'this is a cookie', { maxAge: 10000, signed: true }).send('Cookie signed');
});

router.get('/getCookie', (req, res) => {
    //res.send(req.cookies);  cookies sin firmas

    //cookies firmadas
    res.send(req.signedCookies)

});

router.get('/deleteCookie', (req, res) => {
    res.clearCookie('CoderCookie').send('Cookie deleted');
});


//session
router.get('/current', middlewares.auth, (req, res) => {
    res.send('sensitive data')

})
router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
            res.send(`you have visited this site ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('welcome stranger')
    }
})




export default router