// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Fleet', new Schema({ 
    owner: String, 
    from : Schema.Types.ObjectId,
    to : Schema.Types.ObjectId,
    action : String,
    ships : {type : Array, default : [ "type", "count"]},
    assaultDate : Date
},
{ collection : 'fleet'}));
