var User   = require('../models/users'); // get our mongoose model
var usersCtrl = require('../controllers/users');

// Request to add an admin (play once)
module.exports = {

	addUser : function(req, res) {

	  // create a sample user
	  var newuser = new User({ 
	    name: 'admin', 
	    password: 'admin',
	    admin: true,
	    token:''
	  });

	  // save the sample user
	  res.json(usersCtrl.addUser(newuser));
	}


};