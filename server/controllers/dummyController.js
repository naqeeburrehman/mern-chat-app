const { isNumber } = require("../functions/isNumber");
const chatModel = require("../models/Chat");
const ROLES_LIST = require("../config/rolesList");
const appVariables = require("../config/appVariables");
const path = require("path");
const fs = require("fs");

const getChats = async (req, res) => {
    let query = { "delete.status": { $ne: true }, catagory: { $in: req.query.c }, _id: { $in: req.query.id }, userId: { $in: req.query.uid } };
    if (!req?.query?.c || req?.query?.c == null) delete query.catagory;
    if (!req?.query?.uid || req?.query?.uid == null) delete query.userId;
    if (!req?.query?.id || req?.query?.id == null) delete query._id;
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = 24;
    chats = await listingModel.find(query).limit(req.query.q);
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
    chats = await listingModel.find(query).limit(req.query.q);
    if (!chats || chats.length < 1) {
        console.log("no chats found".red);
        return res.status(204).json({ error: "No Chats found" });
    }
    console.log("listngs sent".green);
    return res.json(chats);
};

const createNewListing = async (req, res) => {
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
        const result = await listingModel.create({
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
        console.log("new listing added successfully".green);
        return res.status(201).json({ message: "New Listing Added Successfully", result });
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

const updateListing = async (req, res) => {
    console.log(req.params.id.grey);
    if (!req?.params?.id) {
        console.log("missing id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let query = { _id: req.params.id, userId: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.userId;
    const listing = await listingModel.findOne(query).exec();
    if (!listing) {
        console.log("id param didnt matched any listing".red);
        return res.status(204).json({ error: `No listing matches ID ${req.params.id}.` });
    }
    if (req.body?.title) listing.title = req.body.title;
    if (req.body?.description) listing.description = req.body.description;
    if (req.body?.price) listing.price = req.body.price;
    if (req.body?.catagory) listing.catagory = req.body.catagory;
    if (req.body?.quantity) listing.variables.quantity = req.body.quantity;
    if (req.body?.condition) listing.variables.condition = req.body.condition;
    if (req.body?.size) listing.variables.size = req.body.size;
    if (req.body?.color) listing.variables.color = req.body.color;
    const result = await listing.save();
    console.log("listing updated successfuly".green);
    return res.status(201).json({ message: "Listing Updated Successfully", result });
};

const addListingFile = async (req, res) => {
    if (!req?.params?.id) {
        console.log("missing required id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let query = { _id: req.params.id, userId: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.userId;
    const listing = await listingModel.findOne(query).exec();
    if (!listing) {
        console.log("id param didnt matched any listing".red);
        return res.status(204).json({ error: `No listing matches ID ${req.params.id}.` });
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
            listing.images.push(`${req.user}${fileDate}${files[key].name}`);
        });
    }
    const result = await listing.save();
    console.log("file added successfully".green);
    res.status(201).json({ message: "Listing Updated Successfully", result });
};

const deleteListing = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ error: "listing ID required" });
    let query = { _id: req.params.id, userId: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.userId;
    const listing = await listingModel.findOne(query).exec();
    if (!listing) {
        console.log("id param didnt matched any listing".red);
        return res.status(204).json({ error: `listing ID ${req.params.id} not found` });
    }
    if (req.body?.delete) {
        listing.delete.status = true;
        listing.delete.date = new Date();
    }
    if (req.body?.image) {
        fs.unlink(`public/images/${req.body.image}`, (err) => {
            if (err) {
                console.log("fs.unlink error".red);
            }
        });
        let index = listing.images.includes(req.body.image);
        if (index === true) {
            listing.images.splice(index, 1);
        }
    }
    const result = await listing.save();
    console.log("deleted successfully".green);
    res.status(201).json({ message: "Deleted Successfully", result });
};



const createGroupChat = async (req, res) => {
    let { users, name } = req.body;
    if (!users || !name) return res.status(400).json({ error: "Missing fields in request" });
    if (users.length < 2)
        return res.status(400).json({ error: "More then 2 users are required to create a group chat" });
    users.push(req.user);
    try {
        const groupChat = await chatModel.create({
            chatName: name,
            users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullChat = await chatModel
            .findOne({ _id: groupChat._id })
            .populate("users", "-password -refreshToken -delete")
            .populate("groupAdmin", "-password -refreshToken -delete");
        return res.status(200).json(fullChat);
    } catch (err) {
        console.log(`${err}`.red);
        return res.status(500).json({ error: "internal server occured" });
    }
};

const updateGroup = async (req, res) => {
    const { chatName } = req.body;
    if (!req?.params?.id) {
        console.log("missing id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let message = "nothing to be updated";
    let query = { _id: req.params.id, isGroupChat: { $eq: true }, groupAdmin: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.groupAdmin;
    const chat = await chatModel
        .findOne(query)
        .populate("users", "-password -refreshToken -delete")
        .populate("groupAdmin", "-password -refreshToken -delete")
        .exec();
    if (!chat) {
        console.log("id param didnt matched any chat".red);
        return res.status(204).json({ error: `No group found.` });
    }
    if (req.body?.chatName) {
        chat.chatName = chatName;
        console.log("Group Name Updated successfuly".green);
        message = "Group Name Updated Successfully";
    }
    const result = await chat.save();
    return res.status(201).json({ message, result });
};

const addToGroup = async (req, res) => {
    const { userId } = req.body;
    if (!req.params?.id) {
        console.log("missing required id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let message = "nothing to add";
    let query = { _id: req.params.id, isGroupChat: { $eq: true }, groupAdmin: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.groupAdmin;
    const chat = await chatModel
        .findOne(query)
        // .populate("users", "-password -refreshToken -delete")
        // .populate("groupAdmin", "-password -refreshToken -delete")
        .exec();
    if (!chat) {
        console.log("id param didnt matched any chat".red);
        return res.status(204).json({ error: `No group found.` });
    }
    if (req.body?.userId) {
        let index = chat.users.includes(userId);
        if (index == true) {
            console.log("User already exists".red);
            return res.status(409).json({ error: "User already exists" });
        } else {
            chat.users.push(userId);
            console.log("User added successfully".green);
            message = "User added successfully";
        }
    } else return res.status(400).json({ error: "User ID is required." });

    const result = await chat.save();
    return res.status(201).json({ message, result });
};

const removeFromGroup = async (req, res) => {
    const { userId } = req.body;
    if (!req.params?.id) {
        console.log("missing required id param".red);
        return res.status(400).json({ error: "ID parameter is required." });
    }
    let query = { _id: req.params.id, isGroupChat: { $eq: true }, groupAdmin: { $in: req.user } };
    if (req.roles.includes(ROLES_LIST.Admin)) delete query.groupAdmin;
    const chat = await chatModel
        .findOne(query)
        .populate("users", "-password -refreshToken -delete")
        .populate("groupAdmin", "-password -refreshToken -delete")
        .exec();
    if (!chat) {
        console.log("id param didnt matched any chat".red);
        return res.status(204).json({ error: `No group found.` });
    }
    if (req.body?.userId) {
        let index = chat.users.includes(userId);
        if (index === true) {
            chat.users = chat.users.filter((user) => user !== userId);
            console.log("User removed successfully".green);
            message = "User removed";
        } else {
            console.log("Incorrect user ID".red);
            return res.status(400).json({ error: "Incorrect user ID" });
        }
    }
    const result = await chat.save();
    return res.status(201).json({ message: "user removed", result });
};
module.exports = {
    getChats,
    getUserChats,
    createNewChat,
    updateChat,
    addChatFile,
    deleteChat,
};
