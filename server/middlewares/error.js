

const errorMiddleware = (err, req, res, next) => {

    err.message = err.message || 'Internal Server Error';
    err.status = err.status || 500;

    return res.status(err.status).json({
        success: false,
        message: err.message
    })
};


const TryCatch = (passedFunc)=> async(req,res,next)=>{
    try {
        await passedFunc(req,res,next);
    } catch (error) {
        next(error)
    }
};

export {errorMiddleware,TryCatch}