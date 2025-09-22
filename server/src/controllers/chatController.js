import chatModel from "../models/chat.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import messageModel from "../models/message.js";


const createNewChat = asyncErrorHandler( async (req, res, next) => {
         
       let newChat = new chatModel(req.body);
       await newChat.save();
       newChat = await newChat.populate('members'); // to get the members details instead of just their ids.

       return res.status(201).json({
            success: true,
            message: "Chat created successfully!",
            data: newChat // because we need at frontend to show the chat profiles
       });
});



const getAllChats = asyncErrorHandler( async (req, res, next) => {
         
    //   req.userId;
    let allChats = await chatModel.find({members: {$in: req.userId}})
                                   .populate('members lastMessage')
                                   .sort({updateAt: -1}) // which updates last (lastMessage) will be at the top.
    res.status(200).json({
           success: true,
           message: "Chats fetched successfully!",
           count: allChats.length,
           data: allChats
           
    });
});

const clearMessages = asyncErrorHandler( async (req, res, next) => {
    // first we the selected chat id here.
              console.log(req.body);
              let { chatId } = req.body;

    // 1. update the unreadMessages count in chat collection to 0
              const updatedChat = await chatModel.findByIdAndUpdate(chatId, { 
                     $set: { unreadMessageCount: 0 },
              },
                     {new: true}
              ).populate('members lastMessage');


  // 2. we nedd to update read property to true for all messages in messages collection.
              await messageModel.updateMany({chatId: chatId, read: false},
                                                 {$set: {read: true}});

                     res.status(200).json({
                           message: 'Messages cleared successfully!',
                           success: true,
                           data: updatedChat
                     });
});



export { createNewChat, getAllChats, clearMessages };