import userModel from "../models/user.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import CustomError from "../Utils/CustomError.js";


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
  })
  
  
  


export { getloggedUser, getAllUsers, updateLastSeenTime };
