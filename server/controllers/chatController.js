const { isNumber } = require("../functions/isNumber");
const listingModel = require("../models/Listing");
const ROLES_LIST = require("../config/rolesList");
const appVariables = require("../config/appVariables");
const path = require("path");
const fs = require("fs");

const getListings = async (req, res) => {
    let query = { "delete.status": { $ne: true }, catagory: { $in: req.query.c }, _id: { $in: req.query.id }, userId: { $in: req.query.uid } };
    if (!req?.query?.c || req?.query?.c == null) delete query.catagory;
    if (!req?.query?.uid || req?.query?.uid == null) delete query.userId;
    if (!req?.query?.id || req?.query?.id == null) delete query._id;
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = 24;
    listings = await listingModel.find(query).limit(req.query.q);
    if (!listings || listings.length < 1) {
        console.log("no listings found".red);
        return res.status(204).json({ error: "No Listings found" });
    }
    console.log("listngs sent".green);
    return res.json(listings);
};

const getUserListings = async (req, res) => {
    let query = { "delete.status": { $ne: true }, catagory: { $in: req.query.c }, userId: { $in: req.user } };
    if (!req?.query?.c || req?.query?.c == null) delete query.catagory;
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = null;
    listings = await listingModel.find(query).limit(req.query.q);
    if (!listings || listings.length < 1) {
        console.log("no listings found".red);
        return res.status(204).json({ error: "No Listings found" });
    }
    console.log("listngs sent".green);
    return res.json(listings);
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
    expiredAt = date.setDate(date.getDate() + appVariables.listingsExpiryDate);
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

module.exports = {
    getListings,
    getUserListings,
    createNewListing,
    updateListing,
    addListingFile,
    deleteListing,
};
