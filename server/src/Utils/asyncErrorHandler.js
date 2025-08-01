

let asyncErrorHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(error => next(error)); // next class global error handling middleware in app.js
        // here catch will throw non operational programming errors to the global error handling middleware.
        // which are not predictable errors in the application. and i use general error message for all these errors.
    }

}

export default asyncErrorHandler;