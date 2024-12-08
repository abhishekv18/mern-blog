import express from 'express';
import { verfiyToken } from '../utils/verifyUser.js';
import { create ,getposts,deletepost,updatepost} from '../controllers/post.controller.js';
const router = express.Router();


router.post('/create',verfiyToken,create);
router.get('/getposts', getposts);
router.delete('/deletepost/:postId/:userId', verfiyToken, deletepost);
router.put('/updatepost/:postId/:userId', verfiyToken, updatepost);

export default router;