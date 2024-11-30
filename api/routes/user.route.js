import express from 'express';
import {
   
  test,
  updateUser,
  deleteUser,
  
  } from '../controllers/user.controller.js';
  import { verfiyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.get('/test',test);
router.put('/update/:userId',verfiyToken,updateUser);
router.delete('/delete/:userId',verfiyToken,deleteUser);
export default router;
