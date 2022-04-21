const Hashids = require("hashids/cjs");
const jwt = require("jsonwebtoken");
const salt = "mirceaalex36592";
const hashLength = 20;
const hashids = new Hashids(salt, hashLength);

const link = "http://localhost:8080/api";

function encryptId(id) {
	return hashids.encode(id);
}

function decryptId(encryptedId) {
	return hashids.decode(encryptedId);
}

function makeLink(base, id) {
	return link + base + encryptId(id);
}

class CustomError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode || 500;
	}
}

function createToken(payload) {
	return jwt.sign(payload, process.env.secret, {
		expiresIn: 60 * +process.env.tokenTimeMinutes,
	}); // last argument is in seconds
}

function decryptToke(token) {
	return jwt.verify(token, process.env.secret);
}
function verifyToken(req, res, next) {
	if (!+process.env.authorizationActivated) return next();
	try {
		req.user = decryptToke(req.header("AuthorizationToken"));
		return next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized!" });
	}
}
function generateRandomString(length = 100) {
	const characters =
		"qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
	let randomString = "";
	for (let i = 0; i < length; i++) {
		randomString =
			randomString +
			characters[Math.floor(Math.random() * 1000000) % characters.length];
	}
	return randomString;
}

module.exports = {
	encryptId,
	decryptId,
	makeLink,
	CustomError,
	createToken,
	decryptToke,
	verifyToken,
	generateRandomString,
};
