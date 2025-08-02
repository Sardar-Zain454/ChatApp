
import { Router } from 'express';

import { signup, login } from '../controllers/authController.js';

// import authMiddleware from '../middlewares/authMiddleware.js';

let authRouter = Router();


authRouter.route('/signup')
                    .post(signup); // public api or public route

authRouter.route('/login')
                    .post(login); // public api or public route





export default authRouter;