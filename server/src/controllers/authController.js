
import userModel from '../models/user.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js'
import CustomError from '../Utils/CustomError.js';


let signup = asyncErrorHandler( async (req, res, next) => {

      res.status(200).json({
        status: true,
        message: "Signup endpoint hit successfully",
      })
      
    
})

let login = asyncErrorHandler ( async (req, res, next) => {

  res.status(200).json({
        status: true,
        message: "Login endpoint hit successfully",
      })

})





export {signup, login};