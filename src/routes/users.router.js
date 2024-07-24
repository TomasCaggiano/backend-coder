import { Router } from 'express';
import { userModel } from '../models/users.models.js';

const router = Router();

router.get('/', async(req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error fetching users' });
    }
});

router.get('/:uid', async(req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error fetching user' });
    }
});

router.post('/', async(req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        if (!email || !first_name || !last_name) {
            return res.status(400).send({ status: 'error', error: 'Missing fields' });
        }

        const newUser = {
            first_name,
            last_name,
            email
        };

        const result = await userModel.create(newUser);
        res.status(201).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error creating user' });
    }
});

router.put('/:uid', async(req, res) => {
    try {
        const { uid } = req.params;
        const { first_name, last_name, email } = req.body;

        if (!email || !first_name || !last_name) {
            return res.status(400).send({ status: 'error', error: 'Missing fields' });
        }

        const updatedUser = await userModel.findByIdAndUpdate(uid, { email, first_name, last_name }, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ status: 'error', error: 'User not found' });
        }

        res.status(200).send({ status: 'success', payload: updatedUser });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error updating user' });
    }
});

router.delete('/:uid', async(req, res) => {
    try {
        const { uid } = req.params;

        const result = await userModel.findByIdAndDelete(uid);
        if (!result) {
            return res.status(404).send({ status: 'error', error: 'User not found' });
        }

        res.status(200).send({ status: 'success', message: 'User deleted' });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error deleting user' });
    }
});

export default router;