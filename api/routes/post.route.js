import express from 'express';
import { verfiyToken } from '../utils/verifyUser.js';
import { create ,getposts} from '../controllers/post.controller.js';
const router = express.Router();


router.post('/create',verfiyToken,create);
router.get('/getposts', getposts)
export default router;