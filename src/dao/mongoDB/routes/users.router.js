import { Router } from 'express';
import { userModel } from '../models/users.models.js';

const router = Router();

// Obtener todos los usuarios
router.get('/', async(req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error fetching users' });
    }
});

// Obtener un usuario por ID
router.get('/:uid', async(req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById(uid);
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error fetching user' });
    }
});

// Crear un nuevo usuario
router.post('/', async(req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        if (!email || !first_name || !last_name) {
            return res.status(400).json({ status: 'error', error: 'Missing fields' });
        }

        // Validación básica del email
        if (!email) {
            return res.status(400).json({ status: 'error', error: 'Invalid email format' });
        }

        const newUser = { first_name, last_name, email };
        const result = await userModel.create(newUser);
        res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error creating user' });
    }
});

// Actualizar un usuario por ID
router.put('/:uid', async(req, res) => {
    try {
        const { uid } = req.params;
        const { first_name, last_name, email } = req.body;

        if (!email || !first_name || !last_name) {
            return res.status(400).json({ status: 'error', error: 'Missing fields' });
        }

        // Validación básica del email
        if (!email) {
            return res.status(400).json({ status: 'error', error: 'Invalid email format' });
        }

        const updatedUser = await userModel.findByIdAndUpdate(uid, { email, first_name, last_name }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        res.status(200).json({ status: 'success', payload: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error updating user' });
    }
});

// Eliminar un usuario por ID
router.delete('/:uid', async(req, res) => {
    try {
        const { uid } = req.params;

        const result = await userModel.findByIdAndDelete(uid);
        if (!result) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        res.status(200).json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Error deleting user' });
    }
});

export default router;