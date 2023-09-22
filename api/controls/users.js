const User = require('../models/userModel');
const Post = require('../models/postModel');
const catchAsync = require('../middlewares/catchAsync');
const sendCookie = require('../utils/sendCookie');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { deleteFile } = require('../utils/awsFunctions');

exports.signupUpser = catchAsync(async (req, res, next) => {
    const {name, email, username, password } = req.body;

    const user = await User.findOne({
        $o: [{ email }, { username }]
    });

    if (user) {
        if (user.username === username) {
            return next(new ErrorHandler("Username already exists", 401));
        }
        return next(new ErrorHandler("Email already exists", 401));
    }

    
})