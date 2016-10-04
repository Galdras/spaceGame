var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('../config/config'); // get our config file
var User   = require('../models/users'); // get our mongoose model
var userCtrl = require('../controllers/users');

var generateTokenForUser = function(user, password){
	    if (!user) {
	      return { success: false, message: 'Authentication failed. User not found.', token : '' };
	    } else if (user) {

	      // check if password matches
	      if (user.password != password) {
	        return { success: false, message: 'Authentication failed. Wrong password.', token : '' };
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign(user, config.secret, {
	          expiresIn: config.timeTokenBeforeExpiration // expires in one week
	        });

	        userCtrl.updateUser(user,{token : token });

	        // return the information including token as JSON
	        return { success: true, message: 'Enjoy your token!', token: token};
	      }   
	    }
	} ;

module.exports = {
	//Generate a new token for user.name
	generateToken : function(req, res) {
	  // find the user
	  userCtrl.findPromiseByName(req.body.name)
	  .then(function(user) {
	  	//console.log(user) ;
	  	 res.json(generateTokenForUser(user, req.body.password)) ;
	  })
	  .catch(function(err) {
			throw err;
		});
	},

	//Check if token is valid and update it if token expires soon
	checkToken : function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, config.secret, function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	        
	        // modify token if expired in 2 days or less
	        //console.log((req.decoded.exp - Math.floor(Date.now() / 1000))) ;
	        //console.log(config.timeGenerateTokenBeforeExpiration) ;
	        if((req.decoded.exp - Math.floor(Date.now() / 1000)) < config.timeGenerateTokenBeforeExpiration){
	        	console.log('Token expire soon ...') ;
		        userCtrl.findPromiseByToken(token)
		        .then(function(user){
				  	//console.log(user);
				  	res.setHeader('x-access-token' , generateTokenForUser(user, user.password).token);
		        })
		        .catch(function(err) {
					throw err;
				});
	        }else{
	        	console.log('Token valid.');
	        }

	        next();
	      }
	    });

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({ success: false, message: 'No token provided.' });
	  }
	}
};