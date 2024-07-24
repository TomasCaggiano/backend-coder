import { Router } from 'express'
import { userModel } from '../models/users.models.js'

const router = Router()


router.get('/', async(req, res) => {
    const users = await userModel.find({})
    res.send(users)
})


router.post('/', async(req, res) => {
    const { first_name, last_name, email } = req.body
    if (!email) return res.send({ status: 'error', error: 'faltan campos' })

    const newUser = {
        first_name,
        last_name,
        email
    }

    const result = await userModel.create(newUser)

    res.status(200).send({ status: 'success', payload: result })
})

router.put('/:uid', async(req, res) => {
    const { uid } = req.params
    const { first_name, last_name, email } = req.body
    const userToUpdate = req.body

    if (!email, !first_name, !last_name) return res.send({ status: 'error', error: 'faltan campos' })


    const result = await userModel.updateOne({ _id: uid }, { email, first_name, last_name })
        //const result = await userModel.findByIdAndUpdate({_id: uid}, userToUpdate)
    res.send({ status: 'success', payload: result })
})


router.delete('/:uid', async(req, res) => {
    const { uid } = req.params

    const result = await userModel.deleteOne({ _id: uid })
})

export default router;