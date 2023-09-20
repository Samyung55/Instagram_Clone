const catchAsync = require("../middlewares/catchAsync");
const Message = require("../models/message");
const Chat = require("../models/cha");


exports.newMessage = catchAsync(async (req, res, next) => {
    const {chatId, content } = req.body;

    const msgData = {
        sender: req.user._id,
        chatId,
        content,
    }

    const newMessage = await Message.create(msgData);

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    res.status(200).json({
        successL true,
        newMessage,
    });
});

