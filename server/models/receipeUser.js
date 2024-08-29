const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
})
const ReceipeModel = mongoose.model("receipeuser", RecipeSchema)
module.exports = ReceipeModel