import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js';
const router = Router()

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
router.get('/current', auth, (req, res) => {
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