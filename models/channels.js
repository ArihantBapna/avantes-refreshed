var mongoose = require('mongoose');
var channels = mongoose.model('channels',{
    _id: {type: String, required: true}, // Object id for mongodb
    id: {type: Number, required: true}, // Counting id
    cid: {type: String, required: true}, // Discord channel id
    sid: {type: String, required: true}, // Guild/server id
    name: {type: String, required: true}, // Channel name
    desc: {type: String, required: true} // Channel description
}, "channels");
module.exports = channels;