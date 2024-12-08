import express from 'express';
import { createComment,getPostComments,likeComment,deleteComment,getcomments } from '../controllers/comment.controller.js';
import { verfiyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verfiyToken,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId', verfiyToken, likeComment);
router.delete('/deleteComment/:commentId', verfiyToken, deleteComment);
router.get('/getcomments', verfiyToken, getcomments);

export default router;