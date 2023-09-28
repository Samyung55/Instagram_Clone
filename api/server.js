const app = require('./app');
const connectDatabase = require('./config/database');
const PORT = process.env.PORT || 4000;

connectDatabase();

const server = app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});


const io = require("socket.io")(server, {
    // pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});


let users = [];


const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("ЁЯЪА Someone connected!");
    // console.log(users);

    // get userId and socketId from client
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // get and send message
    socket.on("sendMessage", ({ senderId, receiverId, content }) => {

        const user = getUser(receiverId);

        io.to(user?.socketId).emit("getMessage", {
            senderId,
            content,
        });
    });