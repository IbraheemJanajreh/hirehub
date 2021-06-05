const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const applierSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postDate: Number,
    dateAgo: String
});
module.exports = mongoose.model("Applier", applierSchema);