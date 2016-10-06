var mongoose    = require('mongoose');

var Fleet   = require('../models/fleet'); // get our mongoose model

// Function Promise for search/update/create fleet
var findPromiseByOwner = function(owner) {
		var p = new Promise(function(resolve,reject) {
		  Fleet.findOne({'owner' : owner}, function(err,user) {
		    if(err) reject(err);
		    resolve(user);
		  });
		});
		return p;
	};

var updatePromise = function(id,update) {
	var p = new Promise(function(resolve,reject) {
		Fleet.update({ _id: id }, { $set: update}, function(err,user){
			 if (err) reject(err);
		    resolve(user);
		});
	});
	return p;
};

var addPromise = function(newfleet) {
	var p = new Promise(function(resolve,reject) {
			  newfleet.save(function(err) {
			    if (err) reject(err);
			    console.log('Fleet saved successfully');
			    resolve({ success: true }) ;
		});
	});
	return p;
}

module.exports = {

	findPromiseByOwner : findPromiseByOwner,

	//Request by client
	find : function(req, res) {
	  Fleet.find({}, function(err, systems) {
	    res.json(systems);
	  });
	},

	findByOwner : function(req, res) {
		findPromiseByOwner(req.params.owner)
		.then(function(user) {
			res.json(user);
		})
		.catch(function(err) {
			throw err;
		});

	}
};