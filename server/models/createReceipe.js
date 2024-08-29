const mongoose = require('mongoose')

const CreateRecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cookingMethod: {
        type: String,

    },
    description: {
        type: String,

    },
    difficulty: {
        type: String,

    },
    image: [{ type: String }],
    ingredients: [{ type: String }],
    video: {
        type: String,

    },
    cooktime: {
        type: String,

    },
    servingPerson: {
        type: Number,

    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    category_name: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'receipeusers',
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',
        required: true,
    }],
    tag_names: [{
        type: String
    }],
    user_name: {
        type: String
    },
})
const CreateReceipeModel = mongoose.model("createreceipe", CreateRecipeSchema)
module.exports = CreateReceipeModel
