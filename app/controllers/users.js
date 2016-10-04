var mongoose    = require('mongoose');

var config = require('../config/config'); // get our config file
var User   = require('../models/users'); // get our mongoose model

// Function Promise for search/update/create users
var findPromiseByName = function(name) {
		var p = new Promise(function(resolve,reject) {
		  User.findOne({'name' : name}, function(err,user) {
		    if(err) reject(err);
		    resolve(user);
		  });
		});
		return p;
	};

var findPromiseByToken = function(token) {
		var p = new Promise(function(resolve,reject) {
		  User.findOne({'token' : token}, function(err,user) {
		    if(err) reject(err);
		    resolve(user);
		  });
		});
		return p;
	};

var updatePromise = function(id,update) {
	var p = new Promise(function(resolve,reject) {
		User.update({ _id: id }, { $set: update}, function(err,user){
			 if (err) reject(err);
		    resolve(user);
		});
	});
	return p;
};

var addPromise = function(newuser) {
	var p = new Promise(function(resolve,reject) {
			  newuser.save(function(err) {
			    if (err) reject(err);
			    console.log('User saved successfully');
			    resolve({ success: true }) ;
		});
	});
	return p;
}

module.exports = {

	findPromiseByName : findPromiseByName,
	findPromiseByToken : findPromiseByToken,

	//Request by client
	find : function(req, res) {
	  User.find({}, function(err, users) {
	    res.json(users);
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

	},

	add : function(req,res) {
		console.log(req.body.name)
		findPromiseByName(req.body.name)
		.then(function(user) {
			if(!user) {
			  var newuser = new User({ 
			    name: req.body.name, 
			    password: req.body.password,
			    admin: false,
			    token:''
			  });

			  addPromise(newuser)
			  .then(function(result){
			  	res.json(result) ;
			  })
			  .catch(function(err){
			  	return err;
			  });

			}else{
				console.log('User already exists');
				res.json({ success : false , message : 'User already exists'}) ;
			}
		})
		.catch(function(err) {
			throw err;
		});
	},

	//Request by server
	addUser : function(newuser) {
		findPromiseByName(newuser.name)
		.then(function(user){
			if(!user){
			  addPromise(newuser)
			  .then(function(result){
			  	return result ;
			  })
			  .catch(function(err){
			  	return err;
			  });
			}else{
				console.log('User already exists');
				return { success: false } ;
			}
		})
		.catch(function(err) {
			throw err;
		});
	},

	updateUser : function(user,update) {
		updatePromise(user.id,update)
		.then(function(user){
			console.log('User update successfully');
			return { success: true } ;
		})
		.catch(function(err) {
			throw err;
		});
	}
};