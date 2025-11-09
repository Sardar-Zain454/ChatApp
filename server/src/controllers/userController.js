import userModel from "../models/user.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import CustomError from "../Utils/CustomError.js";
import cloudinary from "../../cloudinary.js";


const getloggedUser = asyncErrorHandler(async (req, res, next) => {
    
    let loggedUser = await userModel.findById(req.userId).select('-password -__v'); // select excludes password and __v from the response

    return res.status(200).json({
        success: true,
        message: "Logged user fetched successfully!",
        data: loggedUser
    });
});


const getAllUsers = asyncErrorHandler( async (req, res, next) => {
    
    let allUsers = await userModel.find({_id: {$ne: req.userId}}).select('-password -__v'); // select excludes password and __v from the response

    return res.status(200).json({
        success: true,
        message: "All users fetched successfully!",
        count: allUsers.length,
        data: allUsers
    });

});

  const updateLastSeenTime = asyncErrorHandler ( async (userId) => {
         await userModel.findByIdAndUpdate(userId, {
            $set: {
               lastseen: new Date()
            },
         }, {new: false});
  });


  const uploadProfilePic = asyncErrorHandler( async (req, res, next) => {
        
        const image = req.body.image; // base 64 url image

        // STORY: 
        // upload image to cloudinary and gets url (autoly return ) saves it to mongodb and return it to the frontend

        // 1. store and gets the image url form cloudinary.
        const imageURL = await cloudinary.uploader.upload(image, { folder: 'quick-chat' });

        // 2. store that url to mongodb
        await userModel.findByIdAndUpdate(req.userId, {
             $set: {
                profilePic: imageURL
             }
        },
        {new: false});

        return res.status(200).json({
            success: true,
            message: 'Profile pic uploaded successfully',
            data: imageURL
        });

  });
  
  
  


export { getloggedUser, getAllUsers, updateLastSeenTime, uploadProfilePic };
