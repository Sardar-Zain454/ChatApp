
import messageModel from "../models/message.js";
import chatModel from "../models/chat.js";
import CustomError from "../Utils/CustomError.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";


const sendMessage = asyncErrorHandler(async (req, res, next) => {
          
    // store the message in the database
    let savedMessage = await messageModel.create(req.body);
    // update the last message id in the related or for that message chat document.


    // let currentChat = await chatModel.findById(savedMessage.chatId);
    // currentChat.lastMessage = savedMessage._id;
    // await currentChat.save();

    let updateChat = await chatModel.findByIdAndUpdate(
         savedMessage.chatId,
        {
            $set: {lastMessage: savedMessage._id},
            $inc: {unreadMessageCount: 1}
        },
        {new: true}
    );

    res.status(201).json({
        success: true,
        message: "Message sent successfully!",
        data: savedMessage
    });

});


const getAllMessages = asyncErrorHandler (async (req, res, next) => {
        
     let allMessagesForThatChat = await messageModel.find({chatId: req.params.chatId}).sort({createdAt: 1});

     res.status(200).json({
        success: true,
        message: "Messages fetched successfully!",
        count: allMessagesForThatChat.length,
        data: allMessagesForThatChat
     });
}); 


export { sendMessage, getAllMessages };