const ObjectID = require('mongodb').ObjectID;
const crypto = require('crypto');
const password_salt = "<>*&^%!@#$";

module.exports = function(app, db) {

	// Note: Register Users Data : username and password required
	app.post('/users', function(req, res) {
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
					res.send({ 'error': 'An error has occured' });
				} else {
					res.send(result.ops[0]);
				}
			});
		} else {
			// Note: Error detection.
			var error = {};
			if (!data.username) {
				error.username = "Username is required.";
			}

			if (!data.password) {
				error.password = "Password is required.";
			}

			if (tokens.indexOf(token) == -1) {
				error.token = "Token can't be used as authentication.";
			} else {
				error.token = "Authentication token required.";
			}

			res.send(error);
		}
	});

	

};