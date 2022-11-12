const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        phone: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux6W-JOnzu6w_aZW0TO1OqEqexEaBOtQ9sgWDDZlJUsz0Lso&s",
        },
        roles: {
            User: {
                type: Number,
                default: 2001,
            },
            Manager: Number,
            Admin: Number,
        },
        refreshToken: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
