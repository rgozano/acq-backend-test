// Note: Requirements
const express = require ('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const database = require('./config/db');

// Note: Initialized express;
const app = express();

const port = 3000;

// Note: Middleware parser
app.use(bodyParser.urlencoded({ extended: true }));

// Note: Load css file.
app.use('/css', express.static(__dirname + '/assets/css'));

// Note: Load Database
MongoClient.connect(database.url, function(err, db) {
	if (err) {
		return console.log('Database Not Connected:' + err);
	}
	
	require('./app/user')(app, db);
});


app.listen(port, function() {
	console.log("Server Loaded at:" + port);
});
