import chatModel from "../models/chat.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";


const createNewChat = asyncErrorHandler( async (req, res, next) => {
         
       const newChat = new chatModel(req.body);
       await newChat.save();

       return res.status(201).json({
            success: true,
            message: "Chat created successfully!",
            data: newChat // because we need at frontend to show the chat profiles
       });
});



const getAllChats = asyncErrorHandler( async (req, res, next) => {
         
    //   req.userId;
    let allChats = await chatModel.find({members: {$in: req.userId}});

    res.status(200).json({
           success: true,
           message: "Chats fetched successfully!",
           count: allChats.length,
           data: allChats
           
    });
});



export { createNewChat, getAllChats };