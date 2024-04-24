

import express from 'express';
import {
    login,
    register,
    google,
    logout,
    getProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,

} from '../controllers/userController.js'; 
import {protect, admin} from '../middlewares/authMiddleware.js'

//Initialize router
const router = express.Router(); 
 
router.route('/').get(protect, admin, getUsers);
router.route('/register').post(register)
router.route('/logout').post(logout);
router.route('/login').post(login);
router.route('/google').post(google);
router.route('/profile')
    .get(protect,  getProfile)
    .put(protect,  updateUserProfile);
router.route('/:id')
    .delete(protect, deleteUser)
    .get(protect, getUserById)
    .put(protect, updateUser);



export default router