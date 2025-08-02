import { Router } from "express";

import { getloggedUser, getAllUsers } from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = Router();

// This is protected route, so it should be used with authentication middleware
userRouter.route('/get-logged-user')
           .get(authMiddleware, getloggedUser);

           
// This is protected route, so it should be used with authentication middleware
userRouter.route('/get-all-users')
           .get(authMiddleware, getAllUsers);




export default userRouter;