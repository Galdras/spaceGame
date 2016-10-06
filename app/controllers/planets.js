var mongoose    = require('mongoose');

var Planet   = require('../models/planets'); // get our mongoose model

// Function Promise for search/update/create systems
var findPromiseByName = function(name) {
		var p = new Promise(function(resolve,reject) {
		  Planet.findOne({'name' : name}, function(err,user) {
		    if(err) reject(err);
		    resolve(user);
		  });
		});
		return p;
	};

var updatePromise = function(id,update) {
	var p = new Promise(function(resolve,reject) {
		Planet.update({ _id: id }, { $set: update}, function(err,user){
			 if (err) reject(err);
		    resolve(user);
		});
	});
	return p;
};

var addPromise = function(newsystem) {
	var p = new Promise(function(resolve,reject) {
			  newsystem.save(function(err) {
			    if (err) reject(err);
			    console.log('Planet saved successfully');
			    resolve({ success: true }) ;
		});
	});
	return p;
}

module.exports = {

	findPromiseByName : findPromiseByName,

	//Request by client
	find : function(req, res) {
	  Planet.find({}, function(err, systems) {
	    res.json(systems);
	  });
	},

	findByName : function(req, res) {
		findPromiseByName(req.params.name)
		.then(function(user) {
			res.json(user);
		})
		.catch(function(err) {
			throw err;
		});

	}
};