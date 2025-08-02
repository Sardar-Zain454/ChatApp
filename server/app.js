
import express from "express";

import globalErrorHandlingMiddleware from "./src/middlewares/globalErrorHandlingMiddleware.js";

import CustomError from "./src/Utils/CustomError.js";

import authRouter from './src/routes/authRoutes.js';
import userRouter from "./src/routes/userRouter.js";
import chatRouter from "./src/routes/chatRouter.js";
import messageRouter from "./src/routes/messageRouter.js";

const app = express();

app.use(express.json({limit: '100kb'})); // middleware to parses json bodies to js objects with a size limit of 100kb


//  ENDPOINT: 127.0.0.1:3000/api/auth - /signup   
//  ENDPOINT: 127.0.0.1:3000/api/auth - /login 
app.use('/api/auth', authRouter);

// ENDPOINT: 127.0.0.1:3000/api/user - /get-logged-user
// ENDPOINT: 127.0.0.1:3000/api/user - /get-all-users
app.use('/api/user', userRouter);


// ENDPOINT: 127.0.0.1:3000/api/chat - /create-new-chat
// ENDPOINT: 127.0.0.1:3000/api/chat - /get-all-chats
app.use('/api/chat', chatRouter);

// ENDPOINT: 127.0.0.1:3000/api/message - /send-message
// ENDPOINT: 127.0.0.1:3000/api/message - /get-all-messages
app.use('/api/message', messageRouter);
app.use('/api/message', messageRouter);







app.all(/(.*)/, (req, res, next) => {
    return next(new CustomError(`Can't find endpoint: ${req.originalUrl} on this server!`, 404));  // invokes global error handling middleware above
});



app.use(globalErrorHandlingMiddleware); // global error handling middleware
export { app }; // default-export app instance

