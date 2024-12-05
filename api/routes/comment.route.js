import express from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { verfiyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verfiyToken,createComment);

export default router;