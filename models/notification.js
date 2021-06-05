const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },      
    where:{
        type: Schema.Types.ObjectId,
        ref: 'Offer'
    },
    postDate: Number,
    dateAgo: String,
    isRead: Boolean
});

module.exports = mongoose.model('Notification', notificationSchema);