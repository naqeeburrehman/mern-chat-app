const { isNumber } = require("../functions/isNumber");
const chatModel = require("../models/Chat");
const ROLES_LIST = require("../config/rolesList");
const appVariables = require("../config/appVariables");
const path = require("path");
const fs = require("fs");

const createGroupChat = async (req, res) => {
    const { users, name } = req.body;
    if (!req.body?.users || !req.body?.name) return res.status(400).json({ message: "please fill all the fields" });
    if (users.length < 2) return res.status(400).json({ message: "More than 2 users are required" });
    users.push(req.user)
    try {
        const groupChat = await chatModel.create({
            chatName: name,
            users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await chatModel
            .findOne({ _id: groupChat._id })
            .populate("users", "-password -refreshToken -roles -delete")
            .populate("groupAdmin", "-password -refreshToken -roles -delete");
        return res.status(201).json({ message: "group created", chat: fullGroupChat });
    } catch (error) {
        return res.status(500).json({ message: "server error occured" });
    }
};

const updateGroup = async (req, res) => {
    const { chatName } = req.body;
    if (!req.params?.id) return res.status(400).json({ message: "please fill all the fields" });
    if (req.body?.renameGroup) {
        if (!req.body?.chatName) return res.status(400).json({ message: "please fill all the fields" });
        const updatedChat = await chatModel
            .findOneAndUpdate({ _id: req.params.id, groupAdmin: { $eq: req.user } }, { chatName }, { new: true })
            .populate("users", "-password -refreshToken -roles -delete")
            .populate("groupAdmin", "-password -refreshToken -roles -delete");
        if (!updatedChat) {
            return res.status(404).json({ message: "chat not found" });
        } else {
            return res.status(201).json({ message: "Group name updated", chat: updatedChat });
        }
    }
    return res.status(200).json({ message: "nothing to update" });
};

const addToGroup = async (req, res) => {
    const { userId } = req.body;
    if (!req.params?.id || !req.body?.userId) return res.status(400).json({ message: "please fill all the fields" });
    const updatedChat = await chatModel
        .findOneAndUpdate(
            { _id: req.params.id, groupAdmin: { $eq: req.user }, users: { $nin: userId } },
            { $push: { users: userId } },
            { new: true }
        )
        .populate("users", "-password -refreshToken -roles -delete")
        .populate("groupAdmin", "-password -refreshToken -roles -delete");
    if (!updatedChat) {
        console.log("no updatedChat".red);
        return res.status(404).json({ message: "chat not found" });
    } else {
        console.log(updatedChat);
        return res.status(201).json({ message: "user added", chat: updatedChat });
    }
};

const removeFromGroup = async (req, res) => {
    const { userId } = req.body;
    if (!req.params?.id || !req.body?.userId) return res.status(400).json({ message: "please fill all the fields" });
    const updatedChat = await chatModel
        .findOneAndUpdate(
            { _id: req.params.id, groupAdmin: { $eq: req.user }, users: { $in: userId } },
            { $pull: { users: userId } },
            { new: true }
        )
        .populate("users", "-password -refreshToken -roles -delete")
        .populate("groupAdmin", "-password -refreshToken -roles -delete");
    if (!updatedChat) {
        return res.status(404).json({ message: "chat not found" });
    } else {
        return res.status(201).json({ message: "user removed", chat: updatedChat });
    }
};

module.exports = {
    createGroupChat,
    updateGroup,
    addToGroup,
    removeFromGroup,
    // getChats,
    // getUserChats,
    // createNewChat,
    // updateChat,
    // addChatFile,
    // deleteChat,
};
