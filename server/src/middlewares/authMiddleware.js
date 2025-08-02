
import jwt from 'jsonwebtoken';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';

  let authMiddleware = asyncErrorHandler( async (req, res, next) => {

    let authHeader = req.headers.authorization;

    if(!authHeader) return next(new CustomError("Authorization header missing.", 401));
    if(!authHeader.startsWith('Bearer ')) return next(new CustomError("Invalid authorization header format.", 401));    

    let token  = authHeader.split(' ')[1];

     let decordedToken = jwt.verify(token, process.env.SECRET_STRING); // tempered or expired token causes errors there

    //  console.log(verifiedToken)
     // if verified then verifiedToken = {userId: user._id, iat: timestamp, exp: timestamp} is present
    req.userId = decordedToken.userId;

    next();
  });

  export default authMiddleware;

