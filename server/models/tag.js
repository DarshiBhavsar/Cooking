const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // Ensure no unique constraint is set
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'receipeusers',
        required: true
    }
});

const TagModel = mongoose.model('tags', TagSchema);

module.exports = TagModel;
