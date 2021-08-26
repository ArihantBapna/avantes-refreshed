var mongoose = require('mongoose');
var servers = mongoose.model('servers',{
    _id: {type: String, required: true}, // Object id for mongodb
    id: {type: Number, required: true}, //Counting id
    sid: {type: String, required: true}, // Discord guild/server id
    name: {type: String, required: true} // Server name
}, "servers");
module.exports = servers;