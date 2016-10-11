var mongoose    = require('mongoose');

var config = require('../config/config'); // get our config file
var Alliance   = require('../models/alliances'); // get our mongoose model

// Function Promise for search/update/create users
var findPromiseByName = function(name) {
		var p = new Promise(function(resolve,reject) {
		  Alliance.findOne({'name' : name}, function(err,alliance) {
		    if(err) reject(err);
		    resolve(alliance);
		  });
		});
		return p;
	};

var findPromiseByUser = function(name) {
		var p = new Promise(function(resolve,reject) {
		  Alliance.findOne({'users' : {$in : [name]}}, function(err,alliance) {
		    if(err) reject(err);
		    resolve(alliance);
		  });
		});
		return p;
	};	


var updatePromise = function(id,update) {
	var p = new Promise(function(resolve,reject) {
		Alliance.update({ _id: id }, { $set: update}, function(err,alliance){
			 if (err) reject(err);
		    resolve(alliance);
		});
	});
	return p;
};

var addPromise = function(newalliance) {
	var p = new Promise(function(resolve,reject) {
			  newalliance.save(function(err) {
			    if (err) reject(err);
			    console.log('Alliance saved successfully');
			    resolve({ success: true }) ;
		});
	});
	return p;
}

var addUser = function(id,user) {
	var p = new Promise(function(resolve,reject) {
		Alliance.update({ _id: id }, { $push: {"users" : user}}, function(err,alliance){
			 if (err) reject(err);
		    resolve(alliance);
		});
	});
	return p;
};

module.exports = {

	findPromiseByName : findPromiseByName,
	findPromiseByUser : findPromiseByUser,

	//Request by client
	find : function(req, res) {
	  Alliance.find({}, function(err, alliances) {
	    res.json(alliances);
	  });
	},

	findByName : function(req, res) {
		findPromiseByName(req.params.name)
		.then(function(alliance) {
			res.json(alliance);
		})
		.catch(function(err) {
			throw err;
		});

	},

	add : function(req,res) {
		console.log(req.body.name);
		findPromiseByName(req.body.name)
		.then(function(alliance) {
			if(!alliance) {
			  var newalliance = new Alliance({ 
			    name: req.body.name, 
			    users:[req.body.user]
			  });

			  addPromise(newalliance)
			  .then(function(result){
			  	res.json(result) ;
			  })
			  .catch(function(err){
			  	console.log(err);
			  	return err;
			  });

			}else{
				console.log('Alliance already exists');
				res.json({ success : false , message : 'Alliance already exists'}) ;
			}
		})
		.catch(function(err) {
			throw err;
		});
	},

	addUser : function(req,res) {
		findPromiseByName(req.body.name)
		.then(function(alliance) {
			if(alliance.users.indexOf(req.body.user) < 0){
				addUser(alliance.id,req.body.user)
				.then(function(alliance) {
					res.json(alliance);
				})
				.catch(function(err){
			  		return err;
			  	});
			}else{
				console.log('User is already a member of the alliance');
				res.json({ success : false , message : 'Alliance already exists'}) ;
			}

		})
		.catch(function(err) {
			throw err;
		});
	}
};