import express from 'express';
import { signUp, signIn, updateUser, getAllUsers, logout, getUserDetails, test } from './user.controller';
import { TokenValidation } from '../../../Utils/authentication';
import fileUpload from 'express-fileupload';

const router = express.Router();

router.post("/signup", signUp)
router.get("/test" , test)
router.post("/signin", signIn)
router.get("/user-details", TokenValidation, fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads',
}), getUserDetails)
router.get("/user-logout", logout)

//admin panel
router.get("/all-users", TokenValidation, getAllUsers)
router.put("/update-user", TokenValidation, updateUser)

export default router;
