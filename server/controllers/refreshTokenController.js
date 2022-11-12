const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtFunctions = require("../functions/jwtFunctions");
const cookieFunctions = require("../functions/cookieFunctions");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        console.log("no jwt cookie found".red);
        return res.sendStatus(401);
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + cookies.jwt);
    const refreshToken = cookies.jwt;
    cookieFunctions.deleteCookie(res);

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            console.log("no user is found".red);
            if (err) return res.sendStatus(403); //Forbidden
            console.log("attempted refresh token reuse!".magenta);
            const hackedUser = await User.findOne({ _id: decoded.id }).exec();
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
        });
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();
            // console.log(result);
        }

        if (err || foundUser.id !== decoded.id) {
            console.log("expired or incorrect token".red);
            return res.sendStatus(403);
        }

        // Refresh token was still valid
        const roles = Object.values(foundUser.roles);
        const accessToken = jwtFunctions.generateAccessToken({ username: foundUser.username, id: foundUser.id }, roles);
        const newRefreshToken = jwtFunctions.generateRefreshToken(foundUser.id);

        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        cookieFunctions.createCookie(res, newRefreshToken);

        console.log("cookie and token created successfully".green);
        return res.json({ accessToken });
    });
};

module.exports = { handleRefreshToken };
