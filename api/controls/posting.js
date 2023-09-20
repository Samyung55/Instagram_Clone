const Post = require('../models/post');
const User = require('../models/user');
const catchAsync = require('../middlewares/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const { deleteFile } = require('../utils/awsFunctions');

// Create New Post
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

// Like or Unlike Post
exports.likeUnlikePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        return next(new ErrorHandler("Post not found", 404))
} 
    if(post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id)

        post.likes.splice(index, 1);
        await post.save()

        return res.status(200).json({
            success: true,
            message: "Post Unliked"
        });
    } else {
        post.likes.push(req.user._id)

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Liked"
        });
    };
})

// Delete Post
exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    if(post.postedBy.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    await deleteFile(post.image);

    await post.remove();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Post Deleted"
    })
})