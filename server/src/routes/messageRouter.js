
import { Router } from 'express';
import { sendMessage, getAllMessages} from '../controllers/messageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

let messageRouter = Router();

console.log('Message Router loaded...');
// Note that this is a protected route, so it requires authentication through the authMiddleware
messageRouter.route('/send-message')
            .post(authMiddleware, sendMessage);

messageRouter.route('/get-all-messages/:chatId')
            .get(authMiddleware, getAllMessages)                

export default messageRouter;