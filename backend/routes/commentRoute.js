import express from "express";
import {
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment
} from '../controllers/commentController.js';
import {protect} from '../middlewares/authMiddleware.js'




const router = express.Router();

router.route('/create').post(protect, createComment);
router.route('/getPostComments/:postId').get(getPostComments);
router.route('/likeComment/:comId').put(protect, likeComment);
router.route('/editComment/:comId').put(protect, editComment);
router.route('/deleteComment/:comId').delete(protect, deleteComment);



export default router;