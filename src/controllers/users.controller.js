import UsersManagerDB from "../dao/mognoDB/usersManagerDB.js";

class UserController {
    constructor() {
        this.usersManager = new UsersManagerDB();
    }

    getUsers = async(req, res) => {
        try {
            const users = await this.usersManager.getUsers({});
            res.send({ status: 'success', users });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    createUser = async(req, res) => {
        try {
            const result = await this.usersManager.createUser(req.body);
            res.send({ status: 'success', data: result });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    getUser = async(req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await this.usersManager.getUser({ _id: uid });
            if (!userFound) return res.status(404).send({ status: 'error', error: 'User not found' });
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    updateUser = async(req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email) {
            return res.status(400).send({ status: 'error', error: 'Missing fields' });
        }
        try {
            const result = await this.usersManager.updateUser({ _id: uid }, { first_name, last_name, email });
            if (!result) return res.status(404).send({ status: 'error', error: 'User not found' });
            res.send({ status: 'success', message: 'User updated successfully' });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }

    deleteUser = async(req, res) => {
        const { uid } = req.params;
        try {
            const result = await this.usersManager.deleteUser({ _id: uid });
            if (!result) return res.status(404).send({ status: 'error', error: 'User not found' });
            res.send({ status: 'success', message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    }
}

export default UserController;