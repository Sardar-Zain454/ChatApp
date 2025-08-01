
import express from "express";

import globalErrorHandlingMiddleware from "./src/middlewares/globalErrorHandlingMiddleware.js";

import CustomError from "./src/Utils/CustomError.js";

import authRouter from './src/routes/authRoutes.js';

const app = express();

app.use(express.json({limit: '100kb'})); // middleware to parses json bodies to js objects with a size limit of 100kb

//  ENDPOINT: 127.0.0.1:3000/api/auth - /signup   
//  ENDPOINT: 127.0.0.1:3000/api/auth - /login 
app.use('/api/auth', authRouter);






app.use(globalErrorHandlingMiddleware); // global error handling middleware


app.all('*', (req, res, next) => {
    next(new CustomError(`Can't find endpoint: ${req.originalUrl} on this server!`, 404));  // invokes global error handling middleware above
});



export { app }; // default-export app instance

