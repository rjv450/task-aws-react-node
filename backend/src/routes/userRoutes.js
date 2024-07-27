import express from 'express';
import { registerUser, deleteUsers, getUsers } from '../controllers/userControllers.js'
import { validateUser } from '../middleware/validations/register.validator.js';
const router = express.Router();
router.post('/register',validateUser, (req, res) => {
    const io = req.app.get('socketio')
    registerUser(req, res, io)
})
router.delete('/users', (req, res) => {
    const io = req.app.get('socketio')
    deleteUsers(req, res, io)
})
router.get('/users', (req, res) => {
    getUsers(req, res)
})
export default router