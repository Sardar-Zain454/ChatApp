
import express from "express";
import path from 'path';
import globalErrorHandlingMiddleware from "./src/middlewares/globalErrorHandlingMiddleware.js";
import { Server } from 'socket.io';
import http from 'http';
import CustomError from "./src/Utils/CustomError.js";

import authRouter from './src/routes/authRoutes.js';
import userRouter from "./src/routes/userRouter.js";
import chatRouter from "./src/routes/chatRouter.js";
import messageRouter from "./src/routes/messageRouter.js";
import cors from 'cors';
import { updateLastSeenTime } from "./src/controllers/userController.js";

let onlineUsers = {};

const app = express();

let corsConfiguration = {
            origin:'http://localhost:5173',
            allowedHeaders: ['authorization', 'Content-Type'],
            methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
}; 

app.use(cors(corsConfiguration));

const server = http.createServer(app); // pass express app that explicit server which handles both express http req + websocket req

const io = new Server(server, { // now io knows the server above 
    cors: corsConfiguration, pingInterval: 5000, pingTimeout: 3000
});






io.on('connection', (socket) => {
        function onlineUsersStatus(usersWhoAreOnline) {
            io.emit('online-users', usersWhoAreOnline);
        }

          async function updateLastSeen(id) {
             await updateLastSeenTime(id); // when user log off he updates its backend copies of documents.
             io.emit('update-last-seen-time', id); // when user log off then he tells all connected priocess to update my last time
             // in their frontend copies of me(documents) now go to the frontend.
        } 

    socket.on('join-chat-room', (userId) => {
      socket.join(userId); // each user have its own room in which he exists separately, // if name is same everyone is added to same grp
   
    if(!Object.values(onlineUsers).includes(userId)) {
            onlineUsers[socket.id] = userId;
            onlineUsersStatus(onlineUsers);
            io.emit('i_am_online_boys', userId);
            // console.log("CONSOLE LOG ONLINE BOY AT BACKEND");
    }

      console.log('User joined', userId);
});

    socket.on('send-message', (message) => {
            io
                .to(message.roomsToSendThatMessage[0]) // to the group of the user who send the message
                .to(message.roomsToSendThatMessage[1]) // to the group of the user to which message is sent
                .emit('receive-message', message) // emitting event only for these two groups from a pool of connected user groups
            
            io
                .to(message.roomsToSendThatMessage[0]) // to the group of the user who send the message
                .to(message.roomsToSendThatMessage[1]) // to the group of the user to which message is sent
                .emit('show-unread-message', message) // emitting event only for these two groups from a pool of connected user groups
        });

    socket.on('get-read-status', targetInfo => {
            socket
                .to(targetInfo.target)
                .emit('show-read-status', targetInfo);
        });

    socket.on('typing', (userInfo)=>{
            io
            .to(userInfo.toWhichStatusShowing._id)
            .emit('showing-typing-status', userInfo);
    })

    socket.on('fetch-new-chat', chatdata => {
        socket
            .to(chatdata.userId)
            .emit('get-new-chat-brother', chatdata)
    });


    

    // when tab/browser is closed when refresh is done but upon refetching that user is again connected gotcha! and 
    // our array is still with that array only in case of refresh, upon internet off this is also triggered(not for client and server
    // which are on same machine). and lastly upon logout i have to explicity trigger an event from frontend which excludes that person
    // from online users array and distribute it.
    socket.on('disconnect', () => {
        if(Object.keys(onlineUsers).includes(socket.id)) {
             updateLastSeen(onlineUsers[socket.id]); // backend
             delete onlineUsers[socket.id];
             onlineUsersStatus(onlineUsers);
        }
    });
});


    



app.use(express.json({limit: '100mb'})); // middleware to parses json bodies to js objects with a size limit of 100kb
app.use(express.static(path.join('/public')));




//  ENDPOINT: 127.0.0.1:5000/api/auth - /signup   
//  ENDPOINT: 127.0.0.1:5000/api/auth - /login 
app.use('/api/auth', authRouter);

// ENDPOINT: 127.0.0.1:5000/api/user - /get-logged-user
// ENDPOINT: 127.0.0.1:5000/api/user - /get-all-users
// ENDPOINT: 127.0.0.1:5000/api/user - /upload-profile-pic
app.use('/api/user', userRouter);

// ENDPOINT: 127.0.0.1:5000/api/chat - /create-new-chat
// ENDPOINT: 127.0.0.1:5000/api/chat - /get-all-chats
// ENDPOINT: 127.0.0.1:5000/api/chat - /clear-unread-messages
app.use('/api/chat', chatRouter);

// ENDPOINT: 127.0.0.1:5000/api/message - /send-message
// ENDPOINT: 127.0.0.1:5000/api/message - /get-all-messages
app.use('/api/message', messageRouter);
app.use('/api/message', messageRouter);







app.all(/(.*)/, (req, res, next) => {
    return next(new CustomError(`Can't find endpoint: ${req.originalUrl} on this server!`, 404));  // invokes global error handling middleware above
});



app.use(globalErrorHandlingMiddleware); // global error handling middleware
export { server }; // default-export app instance

