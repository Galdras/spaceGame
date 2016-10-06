// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Planet', new Schema({ 
    name: { type: String, unique : true }, 
    systemId : Schema.Types.ObjectId,
    extra : [String],
    owner : String,
    headquarter : Boolean,
    buildings : {type : Array , default : ["type", "level", "module"]},
    ships : {type : Array, default : [ "type", "count"]},
    resources : {
    	basic : Number,
    	artefact : Number
    }
},
{ collection : 'planets'}));
