// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var config = require('./app/config/config'); // get our config file
var usersCtrl = require('./app/controllers/users');
var systemsCtrl = require('./app/controllers/systems');
var setupCtrl = require('./app/controllers/setup');
var authenticateCtrl = require('./app/controllers/authenticate');
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

mongoose.connect(config.database); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
app.get('/setup', setupCtrl.addUser);

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', authenticateCtrl.generateToken);
apiRoutes.put('/users', usersCtrl.add); // sign in

// route middleware to verify a token
apiRoutes.use(authenticateCtrl.checkToken);

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', usersCtrl.find); 
apiRoutes.get('/users/:name', usersCtrl.findByName);

apiRoutes.get('/systems', systemsCtrl.find); 
apiRoutes.get('/systems/:name', systemsCtrl.findByName);


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);