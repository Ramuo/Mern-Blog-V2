import express from 'express';
import {
    createPost,
    getPosts,
    deletePost,
    updatePost
} from '../controllers/postController.js';
import {protect, admin} from '../middlewares/authMiddleware.js';
// import checkObjectId from '../middleware/checkObjectId.js'


const router = express.Router();

router.route('/createpost').post(protect, admin, createPost);
router.get('/getposts', getPosts);
router.route('/deletepost/:postId/:userId').delete(protect, deletePost)
router.route('/updatepost/:postId/:userId').put(protect, admin, updatePost)


export default router;