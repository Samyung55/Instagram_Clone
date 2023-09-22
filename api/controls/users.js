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

    const newUser = await User.create({
        name,
        email,
        username,
        password,
        avatar: req.file.location
    })

    sendCookie(newUser, 201, res);
});

// Login User
exports.loginUser = catchAsync(async (req, res, next) => {
    const { userId, password } = req.body

    const user = await User.findOne({
        $or: [{ email: userId }, { username: userId }]
    }).select("+password");

    if(!user) {
        return next(new ErrorHandler("User don't exit", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Password doesn't match", 401));
    }

    sendCookie(user, 201, res)
})

// Logout User
exports.logoutUser = catchAsync(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        mesage: "Logged Out"
    });
});

// Get User Details --Logged In User
exports.getAccountDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({
        path: 'posts',
        populate: {
            path: 'postedBy'
        }
    });

    res.status(200).json({
        success: true,
        user,
    })
})

// Get User Details
exports.getUserDetails = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username }).populate("followers following").populate({
        path: 'posts',
        populate: {
            path: 'comments',
            populate: {
                path: 'user'
            }
        },
    }).populate({
        path: 'posts',
        populate: {
            path: 'postedBy'
        }
    }).populate({
        path: 'saved',
        populate: {
            path: 'comments',
            populate: {
                path: 'user'
            }
        },
    }).populate({
        path: 'saved',
        populate: {
            path: 'postedBy'
        }
    })

    res.status(200).json({
        success: true,
        user,
    });
})

// Get User Details By Id
exports.getUserDetailsById = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        user,
    });
});


// Get All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find();

    
});
