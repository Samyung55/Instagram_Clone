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