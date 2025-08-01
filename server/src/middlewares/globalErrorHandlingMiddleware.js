


// Handling global errors in the application during development environment.
let devError = (error, res) => {
    // Expose as much information as possible in development environment.
    
        res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message,
            stack: error.stack,
            error: error
        });

        
}




// Handling global errors in the application during production environment. operational environment.
let prodError = (error, res) => {

    if(error.isOperational) {
        // error which we invoke manually (predictable) in the application using customError class these are (operational errors).
        res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message // Message to be specific for all operational errors.
        })

    } else {
       // error which we don't invoke manually (not predictable) in the application. by ourself these are (programming errors).
       // .catch(error => next(error)) related errors
        res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: "Something went wrong! Please try again later." // for all errors we have a general message.
        });
    }
   
}





const globalErrorHandlingMiddleware = (error, req, res, next) => {

    // console.log("Global Error Handling Middleware Invoked");
    

    error.statusCode = error.statusCode || 500 // internal server error
    error.status = error.status || 'error';

    if(process.env.NODE_ENV == 'development') {
        devError(error, res);
    } else {
        prodError(error, res);
    }

}

export default globalErrorHandlingMiddleware;
