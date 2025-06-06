// models/user.model.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    middlename: { type: String, default: "" },
    role: { type: String, default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
