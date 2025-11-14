import userModel from "../models/user.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import CustomError from "../Utils/CustomError.js";
import cloudinary from './../config/cloudinary.js'

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

// its a black sheep which is not middleware
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

        // 1. store and gets the image url form cloudinary. but first delete it previously some exists for you.
        let userPublicId = await userModel.findById(req.userId).select('publicId');

        if(userPublicId?.publicId) {
           await cloudinary.uploader.destroy(userPublicId.publicId, {resource_type: 'image'}); //  or 'video'
        }

        const imageResource = await cloudinary.uploader.upload(image, { folder: 'quick-chat' });

        // 2. store that url to mongodb
        const user = await userModel.findByIdAndUpdate(req.userId, {
             $set: {
                profilePic: imageResource.secure_url,
                publicId: imageResource.public_id // for deleting purposes. (id of profile image in cloudinary)
             }
        },
        {new: true});

        return res.status(200).json({
            success: true,
            message: 'Profile pic uploaded successfully',
            data: user
        });

  });


  const deleteProfilePic = asyncErrorHandler( async (req, res, next) => {

        const { publicId } = req.body; // comes from frontend
          let result = await cloudinary.uploader.destroy(publicId, {resource_type: 'image'}); //  or 'video'

      if (result.result !== 'ok') {
          // 'not found', 'already deleted', 'error', 'invalid'
          // it automatically goes to the else of thunk right because of response error interceptor promise.reject
          return res.status(400).json({
              success: false,
              message: "Oops! Something went wrong while deleting!",
              data: null
          });
      }

        let newUser = await userModel.findByIdAndUpdate(req.userId, {
                $set: {
                   profilePic: '',
                   publicId: ''
                }
              }, {new: true});

              res.status(200).json({
                success: true,
                message: "Profile pic deleted successfully",
                data: newUser
              });
  });
  
  
  


export { getloggedUser, getAllUsers, updateLastSeenTime, uploadProfilePic, deleteProfilePic };
