require("dotenv").config();
require("colors");
const connectDB = require("./config/dbConn");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const app = express();
const path = require("path");
const corsOptions = require("./config/corsOptions");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { logger } = require("./middleware/logEvents");
const { getServerIp } = require("./functions/ip");
const verifyJWT = require("./middleware/verifyJWT");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use('/',logger);

// Socket Io Server
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//middleware for files upload
app.use(fileUpload({ createParentPath: true }));

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// Socket io Routes
io.on("connection", require("./routes/socket/routes"));

// Api Routes
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));

app.use(verifyJWT);

app.use("/chat", require("./routes/api/chat"));
app.use("/group", require("./routes/api/group"));
app.use("/search", require("./routes/api/search"));

app.all("/*", (req, res) => {
    console.log("404 path not found".red);
    res.status(404);
    if (req.accepts("json")) {
        res.json({ error: "404 path Not Found" });
    } else {
        res.type("txt").send("404 path Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB".blue);
    httpServer.listen(PORT, () => console.log(`Server running on port ${getServerIp()}:${PORT}`.blue));
});
