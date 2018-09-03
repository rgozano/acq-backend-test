var db = "mongodb://localhost:27017/project";
if (process.env.PORT) {
	db  = "mongodb://romelgozano:123pass@ds141902.mlab.com:41902/project";
}

module.exports = {
	url : db
}

