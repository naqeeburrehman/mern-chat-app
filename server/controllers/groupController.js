const { isNumber } = require("../functions/isNumber");
const chatModel = require("../models/Chat");
const ROLES_LIST = require("../config/rolesList");
const appVariables = require("../config/appVariables");
const path = require("path");
const fs = require("fs");

const createGroupChat = async (req, res) => {
    return res.send("createGroupChat");
};
const renameGroup = async (req, res) => {
    return res.send("renameGroup");
};
const addToGroup = async (req, res) => {
    return res.send("addToGroup");
};
const removeFromGroup = async (req, res) => {
    return res.send("removeFromGroup");
};

const getChats = async (req, res) => {
    let query = {
        "delete.status": { $ne: true },
        catagory: { $in: req.query.c },
        _id: { $in: req.query.id },
        userId: { $in: req.query.uid },
    };
    if (!req?.query?.c || req?.query?.c == null) delete query.catagory;
    if (!req?.query?.uid || req?.query?.uid == null) delete query.userId;
    if (!req?.query?.id || req?.query?.id == null) delete query._id;
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = 24;
    chats = await chatModel.find(query).limit(req.query.q);
    if (!chats || chats.length < 1) {
        console.log("no chats found".red);
        return res.status(204).json({ error: "No Chats found" });
    }
    console.log("listngs sent".green);
    return res.json(chats);
};

const getUserChats = async (req, res) => {
    let query = { "delete.status": { $ne: true }, catagory: { $in: req.query.c }, userId: { $in: req.user } };
    if (!req?.query?.c || req?.query?.c == null) delete query.catagory;
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = null;
    chats = await chatModel.find(query).limit(req.query.q);
    if (!chats || chats.length < 1) {
        console.log("no chats found".red);
        return res.status(204).json({ error: "No Chats found" });
    }
    console.log("listngs sent".green);
    return res.json(chats);
};

const createNewChat = async (req, res) => {
    let { title, description, price, catagory, quantity, condition, size, color } = req.body;
    if (
        !title ||
        !description ||
        !price ||
        !catagory ||
        !quantity ||
        !condition ||
        !size ||
        size?.length == 0 ||
        !color ||
        color?.length == 0
    ) {
        console.log("missing fields in request".red);
        return res.status(400).json({ error: "Missing fields in request" });
    }
    let files = req.files;
    images = [];
    Object.keys(files).forEach((key) => {
        let fileDate = Date.now();
        const filepath = path.join(__dirname, "../public/images", `${req.user}${fileDate}${files[key].name}`);
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ error: err });
        });
        images.push(`${req.user}${fileDate}${files[key].name}`);
    });
    let date = new Date();
    createdAt = date.setDate(date.getDate() + 0);
    expiredAt = date.setDate(date.getDate() + appVariables.chatsExpiryDate);
    variables = { quantity, condition, size, color };
    try {
        const result = await chatModel.create({
            images,
            title,
            description,
            userId: req.user,
            price,
            catagory,
            createdAt,
            expiredAt,
            variables,
        });
        console.log("new chat added successfully".green);
        return res.status(201).json({ message: "New Chat Added Successfully", result });
    } catch (err) {
        images.forEach((image) => {
            fs.unlink(`public/images/${image}`, (err) => {
                if (err) {
                    console.log("fs.unlink error".red);
                }
            });
        });
        console.log("cant save data to db".red);
        return res.status(500).json({ error: "internal server occured" });
    }
};

const updateChat = async (req, res) => {
    console.log(req.params.id.grey);
    if (!req?.params?.id) {
        console.log("missing id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let query = { _id: req.params.id, userId: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.userId;
    const chat = await chatModel.findOne(query).exec();
    if (!chat) {
        console.log("id param didnt matched any chat".red);
        return res.status(204).json({ error: `No chat matches ID ${req.params.id}.` });
    }
    if (req.body?.title) chat.title = req.body.title;
    if (req.body?.description) chat.description = req.body.description;
    if (req.body?.price) chat.price = req.body.price;
    if (req.body?.catagory) chat.catagory = req.body.catagory;
    if (req.body?.quantity) chat.variables.quantity = req.body.quantity;
    if (req.body?.condition) chat.variables.condition = req.body.condition;
    if (req.body?.size) chat.variables.size = req.body.size;
    if (req.body?.color) chat.variables.color = req.body.color;
    const result = await chat.save();
    console.log("chat updated successfuly".green);
    return res.status(201).json({ message: "Chat Updated Successfully", result });
};

const addChatFile = async (req, res) => {
    if (!req?.params?.id) {
        console.log("missing required id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let query = { _id: req.params.id, userId: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.userId;
    const chat = await chatModel.findOne(query).exec();
    if (!chat) {
        console.log("id param didnt matched any chat".red);
        return res.status(204).json({ error: `No chat matches ID ${req.params.id}.` });
    }
    if (req.files) {
        let files = req.files;
        Object.keys(files).forEach((key) => {
            let fileDate = Date.now();
            const filepath = path.join(__dirname, "../public/images", `${req.user}${fileDate}${files[key].name}`);
            files[key].mv(filepath, (err) => {
                if (err) {
                    console.log("files uploading error".red);
                    return res.status(500).json({ error: err });
                }
            });
            chat.images.push(`${req.user}${fileDate}${files[key].name}`);
        });
    }
    const result = await chat.save();
    console.log("file added successfully".green);
    res.status(201).json({ message: "Chat Updated Successfully", result });
};

const deleteChat = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ error: "chat ID required" });
    let query = { _id: req.params.id, userId: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.userId;
    const chat = await chatModel.findOne(query).exec();
    if (!chat) {
        console.log("id param didnt matched any chat".red);
        return res.status(204).json({ error: `chat ID ${req.params.id} not found` });
    }
    if (req.body?.delete) {
        chat.delete.status = true;
        chat.delete.date = new Date();
    }
    if (req.body?.image) {
        fs.unlink(`public/images/${req.body.image}`, (err) => {
            if (err) {
                console.log("fs.unlink error".red);
            }
        });
        let index = chat.images.includes(req.body.image);
        if (index === true) {
            chat.images.splice(index, 1);
        }
    }
    const result = await chat.save();
    console.log("deleted successfully".green);
    res.status(201).json({ message: "Deleted Successfully", result });
};

module.exports = {
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    // getChats,
    // getUserChats,
    // createNewChat,
    // updateChat,
    // addChatFile,
    // deleteChat,
};
