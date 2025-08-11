import {body,validationResult,check, param, query} from 'express-validator';
import { ErrorHandler } from '../utils/utility.js';

const validateHandler = (req,res,next)=>{

   const errors= validationResult(req);
   const errorMessages = errors.array().map((error)=> error.msg).join(" , ")

   console.log( errorMessages );
   if(errors.isEmpty()) return next();
   else next(new ErrorHandler(errorMessages,400))
};

const registerValidator = ()=>[
    body('name','Please Enter Name').notEmpty(),
    body('username','Please Enter Username').notEmpty(),
    body('bio','Please Enter Bio').notEmpty(),
    body('password','Please Enter Password').notEmpty(),
    check('avatar',"Please Upload Avatar").notEmpty()
];

const loginValidator = ()=>[
    body('username','Please Enter Username').notEmpty(),
    body('password','Please Enter Password').notEmpty(),
];

const newGroupValidator = ()=>[
    body('name','Please Enter Name of a Group').notEmpty(),
    body('members').notEmpty().withMessage('Please Enter Members')
    .isArray({min:2, max:100}).withMessage('Members must be 2-100'),
];

const addMemberValidator = ()=>[
    body('chatId','Please Enter ChatId').notEmpty(),
    body('members').notEmpty().withMessage('Please Enter Members')
    .isArray({min:1, max:97}).withMessage('Members must be 1-97'),
];

const removeMemberValidator = ()=>[
    body('chatId','Please Enter Chat Id').notEmpty(),
    body('userId','Please Enter User Id').notEmpty(),

];



const sendAttachmentValidator = ()=>[
    body('chatId','Please Enter Chat Id').notEmpty(),
    check('files').notEmpty().withMessage("Please Upload Attachments")
    .isArray({min:1, max:5}).withMessage('Attachments must be 1-5'),
];

const chatIdValidator = ()=>[
    param('id','Please Enter Chat Id').notEmpty(),
];

const renameGroupValidator = ()=>[
    param('id','Please Enter Chat Id').notEmpty(),
    body('name','Please Enter New Name of a Group').notEmpty(),
];

const sendRequstValidator = ()=>[
    body('userId','Please Enter User Id').notEmpty(),
];


const acceptRequestValidator = ()=>[
    body('requestId','Please Enter Request Id').notEmpty(),
    body('accept').notEmpty().withMessage('Please Add Accept')
    .isBoolean().withMessage('Accept must be a boolean'),

];

const adminLoginValidator = ()=>[
    body('secretKey','Please Enter Secret Key').notEmpty(),
  

];



export {
    registerValidator,
    validateHandler,
    loginValidator,
    newGroupValidator,
    addMemberValidator,
    removeMemberValidator,
    sendAttachmentValidator,
    chatIdValidator,
    renameGroupValidator,
    sendRequstValidator,
    acceptRequestValidator,
    adminLoginValidator,
}