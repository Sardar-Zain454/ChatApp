
import jwt from 'jsonwebtoken';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';
import userModel from '../models/user.js';

// Token exist + jwt expiry + jwt tempering + isPassword Changed after token issuing, this middleware is the heart of security
// in my nodejs backend

  let authMiddleware = asyncErrorHandler( async (req, res, next) => {
    
    let authHeader = req.headers.authorization;
      
    // if(!authHeader) return next(new CustomError("Authorization header missing.", 401));
    // if(!authHeader.startsWith('Bearer ')) return next(new CustomError("Invalid authorization header format.", 401)); 
    
    let token = null;

    if(authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if(!token) {
        return next(new CustomError('You are not login. Please login again', 401));
    }

  let decodedToken = jwt.verify(token, process.env.SECRET_STRING); // tempered or expired token causes errors here (JWT EXPIRT AND JWT TEMPERED ERROR)
    //  console.log(verifiedToken)
     // if verified then verifiedToken = {userId: user._id, iat: timestamp(seconds), exp: timestamp(seconds) is present

     let user = await userModel.findById(decodedToken.userId);

    if(!user) {
        return next(new CustomError('The user with given token not exist. Please login again', 401));
    }

    const flag = await user.isPasswordChangedAfterTokenIssued(decodedToken.iat);

    if(flag) {
          return next(new CustomError('Recently you have change the password. Please login again', 401));
    }
    
    req.userId = decodedToken.userId;
    next();
  });

  export default authMiddleware;

