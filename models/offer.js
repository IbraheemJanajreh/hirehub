const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    title: String,
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    appliers:[
        {
            type:Schema.Types.ObjectId,
            ref:"Applier"
        }
    ],
    postDate: Number,
    dateAgo: String
});

module.exports = mongoose.model('Offer', OfferSchema);