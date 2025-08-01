
import { Router } from 'express';

import { signup, login } from '../controllers/authController.js';

let authRouter = Router();


authRouter.route('/signup').post(signup);

authRouter.route('/login').post(login);





export default authRouter;