import express from 'express';
import { createComment,getPostComments,likeComment } from '../controllers/comment.controller.js';
import { verfiyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verfiyToken,createComment);
router.get('/getPostComments/:postId',getPostComments);
router.put('/likeComment/:commentId', verfiyToken, likeComment);
export default router;