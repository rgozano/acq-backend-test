const ObjectID = require('mongodb').ObjectID;
const path = require('path');

const crypto = require('crypto');
const password_salt = "<>*&^%!@#$";

module.exports = function(app, db) {

	// Note: Index page.
	app.get('/', function(req, res) {
		res.sendFile('index.html', {root : path.join(__dirname, './views')});
	});

	// Note: User Login
	app.post('/user/login', function(req, res) {

		var password_hash = req.body.password;
		if (password_hash) {
			password_hash = crypto.createHmac('sha256', password_hash).update(password_salt).digest('hex');
		}

		const data = { username: req.body.username, password: password_hash};
		if (data.username && data.password) {
			db.collection('users').findOne(data, function(err, user) {
				if (err) {
					res.send({
						"status": "failed",
						"message": "error ocurred"
					});
				} else {
					if (user) {
						res.send({
							"status": "success",
							"message": "login successful",
							"result": {
								"user": {
									"_id" : user._id,
									"username": user.username
								}
							}
						});
					} else {
						res.send({
							"status": "failed",
							"message": "authentication failed",
						});
					}
				}
			});
		} else {
			res.send({
				"status": "failed",
				"message": "username and password required",
			});
		}
	});

	// Note: Register Users Data : username and password required
	app.post('/user/register', function(req, res) {
		// Note: Set static tokens for authentication
		var tokens = ['', 'apitoken2018', 'apiapptoken2018'];
		var token = req.body.token;

		// NoteL Hash password
		var password_hash = req.body.password;
		if (password_hash) {
			password_hash = crypto.createHmac('sha256', password_hash).update(password_salt).digest('hex');
		}

		const data = { username: req.body.username, password: password_hash};

		if (data.username && data.password && tokens.indexOf(token) >= 0) {
			db.collection('users').insert(data, function(err, result) {
				if (err) {
					res.send({
						"status": "failed",
						"message": "error ocurred"
					});
				} else {
					res.send({
						"status": "success",
						"message": "register successful",
						"result": {
							"user": result.ops[0]
						}
					});
				}
			});
		} else {
			// Note: Error detection.
			var message = {};
			if (!data.username) {
				message.username = "username is required";
			}

			if (!data.password) {
				message.password = "password is required";
			}
			
			if (!req.body.token) {
				message.token = "token is required";
			} else if (tokens.indexOf(token) == -1) {
				message.token = "token not authenticated"
			}

			res.send({
				"status": "failed",
				"message": message
			});
		}
	});
};