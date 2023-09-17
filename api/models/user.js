const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: [true, 'Email already exists'],
    },
    username: {
        type: String,
        required: [true, 'Please enter username'],
        minlength: [6, 'Username must be of minimum 6 characters'],
        unique: [true, 'username already exists'],
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password must be of minimum 6 characters'],
        select: false,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        default: "Hi, Welcome To My Profile"
    },
    website: {
        type: String,
        trim: true,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    followers: [
        {
            type: mongoose.Schems.Types.ObjectId,
            ref: 'User',
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
});

userSchema.pre("save", async function(next) {
    if(this.isModified(password)) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

