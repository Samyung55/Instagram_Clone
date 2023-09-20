const Post = require('../models/post');
const User = require('../models/user');
const catchAsync = require('../middlewares/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const { deleteFile } = require('../utils/awsFunctions');

exports.newPost = catchAsync(async (req, res, next) => {
    const postData = {
        caption: req.body.caption,
        image: req.file.location,
        postedBy: req.user._id
    }

    const post = await Post.create(postData);

    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();

    res.status(201).json({
        success: true,
        post,
    });
});

