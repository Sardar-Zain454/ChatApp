import { Router } from "express";

import { getloggedUser, getAllUsers, uploadProfilePic, deleteProfilePic } from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = Router();

// This is protected route, so it should be used with authentication middleware
userRouter.route('/get-logged-user')
           .get(authMiddleware, getloggedUser);

           
// This is protected route, so it should be used with authentication middleware
userRouter.route('/get-all-users')
           .get(authMiddleware, getAllUsers);

userRouter.route('/upload-profile-pic')
           .post(authMiddleware, uploadProfilePic);


userRouter.route('/delete-profile-pic')
          .post(authMiddleware, deleteProfilePic);



export default userRouter;