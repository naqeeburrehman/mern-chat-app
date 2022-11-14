const { isNumber } = require("../functions/isNumber");
const userModel = require("../models/User");

const search = async (req, res) => {
    let query = {
        "delete.status": { $ne: true },
        _id: { $ne: req.user },
        $or: [
            { phone: { $regex: req.query.user, $options: "i" } },
            { name: { $regex: req.query.user, $options: "i" } },
        ],
    };
    let model = null;
    if (!req?.query?.user || req?.query?.user == null) {
        delete query.$or;
        delete query._id;
    } else {
        toString(req.query.user);
        console.log(typeof(req.query.user))
        model = userModel;
    }
    console.log(query);
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = 2400;
    if (model == null) {
        console.log("empty query search request".red);
        return res.status(401).json({ error: "Missing Search Fields" });
    }
    searches = await model.find(query).limit(req.query.q);
    if (!searches || searches.length < 1) {
        console.log("no searches found".red);
        return res.status(204).json({ error: "No Searches found" });
    }
    console.log("listngs sent".green);
    return res.status(200).json(searches);
};

module.exports = { search };
