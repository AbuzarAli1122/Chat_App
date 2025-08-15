import { envMode } from "../app.js";


const errorMiddleware = (err, req, res, next) => {

    err.message = err.message || 'Internal Server Error';
    err.status = err.status || 500;

    // for duplicate key value errors
    if(err.code ===11000){
    const error = Object.keys(err.keyPattern).join(',');
    err.message = `Duplicate field - ${error}`;
    err.status =  400;
    }
    // for wrong id Added (means CastError)
    if(err.name === 'CastError'){
        const errorPath = err.path
        err.message = `Invalid Format of ${errorPath}`;
        err.status = 400;
    }
    return res.status(err.status).json({
        success: false,
        message: envMode==='DEVELOPMENT'? err : err.message
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