
import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createNewChat, getAllChats, clearMessages } from '../controllers/chatController.js';

const chatRouter = Router();

// Node this is a protected route.
chatRouter.route('/create-new-chat')
          .post(authMiddleware, createNewChat);


// Note this is a protected route.
chatRouter.route('/get-all-chats')
           .get(authMiddleware, getAllChats);

chatRouter.route('/clear-unread-messages')
              .post(authMiddleware, clearMessages);


export default chatRouter;