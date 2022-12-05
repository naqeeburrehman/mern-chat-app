const { isNumber } = require("../functions/isNumber");
const userModel = require("../models/User");

const search = async (req, res) => {
    if (!req?.query?.q || isNumber(req?.query?.q) === false) req.query.q = 120;
    if (!req?.query?.u || req?.query?.u === undefined) req.query.u = "";
    let query = {
        "delete.status": { $ne: true },
        $or: [{ phone: { $regex: req.query.u, $options: "i" } }, { name: { $regex: req.query.u, $options: "i" } }],
        _id: { $ne: req.user },
    };
    // if (req.query.u == null) delete query._id;
    try {
        users = await userModel
            .find(query, "-roles -password -refreshToken -delete -__v -updatedAt -createdAt")
            .limit(parseInt(req.query.q)); // will implement lazy loading or pagination later but mean while limit is ok
        if (!users) return res.status(204).json({ message: "No Users found" });
        return res.status(200).json(users);
    } catch (err) {
        console.log(`failed to fetch any catrgories : ${err}`.red);
        return res.status(500).json({ message: "internal server error occured" });
    }
};

module.exports = { search};
