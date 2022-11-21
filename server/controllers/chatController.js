const { isNumber } = require("../functions/isNumber");
const chatModel = require("../models/Chat");
const userModel = require("../models/User");
const ROLES_LIST = require("../config/rolesList");
const appVariables = require("../config/appVariables");
const path = require("path");
const fs = require("fs");

const fetchChats = async (req, res) => {
    try {
        chatModel
            .find({ users: { $elemMatch: { $eq: req.user } } }, "-delete")
            .populate("users", "-password -refreshToken -roles -delete")
            .populate("groupAdmin", "-password -refreshToken -roles -delete")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await userModel.populate(results, {
                    path: "latestMessage.sender",
                    select: "name img phone",
                });
                return res.status(200).json(results);
            });
    } catch (err) {
        return res.status(500).json({ error: "Error occurd" });
    }
};

const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("Missing fields in request");
        return res.status(400).json({ error: "Missing fields in request" });
    }
    let isChat = await chatModel
        .find({
            isGroupChat: false,
            $and: [{ users: { $elemMatch: { $eq: req.user } } }, { users: { $elemMatch: { $eq: userId } } }],
        })
        .populate("users", "-password -refreshToken -delete")
        .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name img phone",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user, userId],
        };
        try {
            const createdChat = await chatModel.create(chatData);
            const fullChat = await chatModel
                .findOne({ _id: createdChat._id })
                .populate("users", "-password -refreshToken -delete");
            return res.status(200).json(fullChat);
        } catch (err) {
            return res.status(500).json({ error: "Error occurd" });
        }
    }
};

module.exports = {
    fetchChats,
    accessChat,
};
