
import userModel from '../models/user.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js'
import CustomError from '../Utils/CustomError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


let signup = asyncErrorHandler( async (req, res, next) => {

        // you can also find it using userModel.findOne({email: req.body.email}); but in my schema i set that email must be unique
        // i handle mongoose valiudation error in globalErrorHandlingMiddleware.js for that

        // does trimming from frontend: for all fields.
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.email = req.body.email.toLowerCase();

        let user = await userModel.create(req.body);

        /*
        // This gives you the chance to modify the user object before saving it to the database, before saving
          conse user = new userModel(req.body);
          eg: user.role = "user"; // setting default role to user
          await user.save();
          This is the same as above code.
        */


  

          

      return res.status(201).json({
          success: true,
          message: "User registered successfully!",
      })
      
})

let login = asyncErrorHandler ( async (req, res, next) => {
      
      console.log("00000000000000000000000 login 0000000000000000000000000");
  
       let {email, password} = req.body;      
       let user = await userModel.findOne({email});



       if(!user) {
          return next(new CustomError(`User with email ${email} does not exists! Please register first.`,400));
       }

       let isPasswordMatched = await bcrypt.compare(password, user.password)
      
       if(!isPasswordMatched) {
            return next(new CustomError("Invalid email or password", 400));
       }
       let token = jwt.sign({userId: user._id}, process.env.SECRET_STRING, {expiresIn: '5h'});



  return res.status(200).json({
        success: true,
        message: "Login successfull!",
        token,
      });

})



export {signup, login};