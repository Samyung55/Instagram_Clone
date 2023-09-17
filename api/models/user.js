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
        
    }
})

