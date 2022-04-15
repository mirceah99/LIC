const crypto = require("crypto");

const { decryptId, makeLink, CustomError } = require("../middleware/utilities");

const { users } = require("../models/index");
const { generateRandomString } = require("../middleware/utilities");
const { sendValidationEmail } = require("../utilities/email.services");
const { getImageLinkById } = require("../utilities/picture.services");
const base = "/users/";

async function userExists(username) {
	const usersResponse = await users.findAll({
		where: {
			username,
		},
	});
	return usersResponse.length !== 0;
}

function checkPassword(storedPassword, salt, passwordToBeVerified) {
	let hashedPassword = passwordToBeVerified;
	const hash = crypto
		.createHmac("sha512", salt)
		.update(hashedPassword)
		.digest("base64");
	hashedPassword = `${salt}$${hash}`;
	if (storedPassword !== hashedPassword) {
		throw new CustomError("Incorrect credentials!", 401);
	}
}

exports.addUser = async (user) => {
	if (await userExists(user.username))
		throw new CustomError("Username already used😞", 409);
	let { password } = user;
	const salt = crypto.randomBytes(16).toString("base64");
	const hash = crypto
		.createHmac("sha512", salt)
		.update(password)
		.digest("base64");
	password = `${salt}$${hash}`;
	const addedUser = await users.create({
		username: user.username,
		password,
		youTube: user?.youTube,
		instagram: user?.instagram,
		facebook: user?.facebook,
		twitter: user?.twitter,
		tikTok: user?.tikTok,
		reddit: user?.reddit,
		salt,
	});
	return makeLink(base, addedUser.dataValues.id.toString());
};

exports.getUserByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let user = await users.findByPk(decryptedId);
	if (!user) throw new CustomError("User does not exist", 404);
	else user = user.dataValues;
	delete user.password;
	delete user.id;
	delete user.salt;
	user.profilePicture = getImageLinkById("profile", user.profilePicture);
	return user;
};

exports.getFullUserByUID = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];
	let user = await users.findByPk(decryptedId);
	if (!user) throw new CustomError("User does not exist", 404);
	else user = user.dataValues;
	return {
		id: user.id,
		username: user.username,
		password: user.password,
		youTube: user.youTube,
		instagram: user.instagram,
		facebook: user.facebook,
		twitter: user.twitter,
		tikTok: user.tikTok,
		reddit: user.reddit,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		salt: user.salt,
	};
};

exports.getUserByUsernameAndPassword = async (username, password) => {
	let user = await users.findAll({
		where: {
			username,
		},
	});
	if (user.length === 0) throw new CustomError("Invalid credentials!", 401);
	else user = user[0].dataValues;
	const { salt } = user;
	checkPassword(user.password, salt, password);
	return makeLink(base, user.id.toString());
};

exports.getUserByUsernameAndPasswordAllData = async (username, password) => {
	let user = await users.findAll({
		where: {
			username,
		},
	});
	if (user.length === 0) throw new CustomError("🍌Invalid credentials!🍌", 401);
	else user = user[0].dataValues;
	const { salt } = user;
	checkPassword(user.password, salt, password);
	user.url = makeLink(base, user.id.toString());
	return user;
};

exports.updateUser = async (id, user) => {
	const oldUser = await this.getFullUserByUID(id);
	const { salt } = oldUser;

	if (user.oldPassword) {
		checkPassword(oldUser.password, salt, user.oldPassword);
	}

	let newPassword;
	let newSalt;
	if (user.newPassword) {
		newPassword = user.newPassword;
		newSalt = crypto.randomBytes(16).toString("base64");
		const newHash = crypto
			.createHmac("sha512", newSalt)
			.update(newPassword)
			.digest("base64");
		newPassword = `${newSalt}$${newHash}`;
	}

	await users.update(
		{
			password: user?.newPassword ? newPassword : oldUser.password,
			youTube: user.youTube || oldUser.youTube,
			instagram: user.instagram || oldUser.instagram,
			facebook: user.facebook || oldUser.facebook,
			twitter: user.twitter || oldUser.twitter,
			tikTok: user.tikTok || oldUser.tikTok,
			reddit: user.reddit || oldUser.reddit,
			salt: user?.newPassword ? newSalt : oldUser.salt,
		},
		{
			where: { id: oldUser.id },
		}
	);
	return makeLink(base, oldUser.id.toString());
};

exports.updateUser2 = async (encryptedId, user) => {
	const id = decryptId(encryptedId)[0];
	delete user.password;
	delete user.username;
	delete user.id;
	delete user.salt;
	delete user.emailConfirmed;
	delete user.emailConfirmationCode;
	if (user.email) {
		const randomString = generateRandomString(100);
		sendValidationEmail(
			user.email,
			`${process.env.baseUrl}/api/users/confirm-email/${randomString}`
		);
		user.emailConfirmationCode = randomString;
		user.emailConfirmed = false;
	}

	await users.update(
		{
			...user,
		},
		{
			where: { id },
		}
	);
	return makeLink(base, id);
};

exports.deleteUser = async (id, password) => {
	const oldUser = await this.getFullUserByUID(id);
	const { salt } = oldUser;

	checkPassword(oldUser.password, salt, password);

	await users.destroy({
		where: { id: oldUser.id },
	});
};
exports.verifyEmail = async (emailConfirmationCode) => {
	if (emailConfirmationCode.length < 10)
		throw new CustomError("Seems suspicious, so not allowed!", 401);
	const response = await users.update(
		{
			emailConfirmed: true,
			emailConfirmationCode: null,
		},
		{ where: { emailConfirmationCode }, returning: true }
	);
	if (response[0] !== 1) return false;
	return response[1][0].dataValues;
};
exports.updateUserProfilePicture = async (picture, userId) => {
	return "TBD";
};
