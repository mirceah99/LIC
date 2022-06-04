const crypto = require("crypto");

const { CustomError } = require("../middleware/utilities");

const { users } = require("../models/index");
const { generateRandomString } = require("../middleware/utilities");
const { sendValidationEmail, sendResetPasswordEmail, } = require("../utilities/email.services");
const { getImageLinkById } = require("../utilities/picture.services");

exports.addUser = async (user) => {
	const searchedUser = await this.searchAuthors({
		username: user.username,
	});
	if (searchedUser) throw new CustomError("User already exists", 409);

	let { password } = user;
	const salt = crypto.randomBytes(16).toString("base64");
	const hash = crypto
		.createHmac("sha512", salt)
		.update(password)
		.digest("base64");
	password = `${salt}$${hash}`;

	return users.create({
		username: user.username,
		password,
		youTube: user?.youTube,
		instagram: user?.instagram,
		facebook: user?.facebook,
		twitter: user?.twitter,
		tikTok: user?.tikTok,
		reddit: user?.reddit,
		salt,
	})
		.then(res => {
			console.log("Added user ", res.get());
			return res.get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while adding user", 500);
		})
};

exports.searchUserById = async (userId) => {
	const user = await users.findByPk(userId)
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching user by id", 500);
		})
	if (!user) {
		console.log("User with id ", userId, " not found");
		return null;
	}
	console.log("User with id ", userId, " found ", user.get());
	return user.get();
}

exports.searchUsers = async (userData) => {
	const searchedUsers = await users.findAll({
		where: {
			...userData,
		},
	})
		.then(res => res)
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while searching users", 500);
		})

	if (!searchedUsers) {
		console.log("Users with ", userData, " not found");
		return null;
	}
	console.log("Users with ", userData, " found ");

	let foundUsers = [];
	for (let searchedUser of searchedUsers)
		foundUsers.push(searchedUser.get());
	return foundUsers;
}

function checkPassword(storedPassword, salt, passwordToBeVerified) {
	let hashedPassword = passwordToBeVerified;
	const hash = crypto
		.createHmac("sha512", salt)
		.update(hashedPassword)
		.digest("base64");
	hashedPassword = `${salt}$${hash}`;
	if (storedPassword !== hashedPassword) {
		console.log("Passwords do not match");
		throw new CustomError("Incorrect credentials!", 401);
	}
}

exports.getUserById = async (userId) => {
	let user = await this.searchUserById(userId);
	if (!user) throw new CustomError("User not found", 404);
	user.profilePicture = getImageLinkById("profile", user.profilePicture);
	return user;
};

exports.getUserByUsernameAndPassword = async (username, password) => {
	let user = await this.searchAuthors({
		username: username,
	});
	if (!user) throw new CustomError("Invalid credentials!", 401);
	else user = user[0].get();
	const { salt } = user;
	checkPassword(user.password, salt, password);
	console.log("User with username ", username, " and correct password found");
	return user;
};

exports.updateUserById = async (userId, newUser, password) => {
	const oldUser = await this.getUserById(userId);
	const { salt } = oldUser;

	checkPassword(oldUser.password, salt, password);

	let newPassword;
	let newSalt;
	if (newUser.newPassword) {
		newPassword = newUser.newPassword;
		newSalt = crypto.randomBytes(16).toString("base64");
		const newHash = crypto
			.createHmac("sha512", newSalt)
			.update(newPassword)
			.digest("base64");
		newPassword = `${newSalt}$${newHash}`;
	}

	return users.update(
		{
			password: newUser?.newPassword ? newPassword : oldUser.password,
			youTube: newUser.youTube || oldUser.youTube,
			instagram: newUser.instagram || oldUser.instagram,
			facebook: newUser.facebook || oldUser.facebook,
			twitter: newUser.twitter || oldUser.twitter,
			tikTok: newUser.tikTok || oldUser.tikTok,
			reddit: newUser.reddit || oldUser.reddit,
			salt: newUser?.newPassword ? newSalt : oldUser.salt,
			resetPasswordToken:
				newUser?.resetPasswordToken || oldUser.resetPasswordToken,
		},
		{
			where: { id: oldUser.id },
			returning: true,
		},
	)
		.then(res => {
			console.log("Updated user ", res[1][0].get());
			return res[1][0].get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while updating user", 500);
		})
};

exports.updateUser2 = async (userId, user) => {
	delete user.password;
	delete user.username;
	delete user.id;
	delete user.salt;
	delete user.emailConfirmed;
	delete user.emailConfirmationCode;
	delete user.profilePicture;
	if (user.email) {
		const randomString = generateRandomString(100);
		sendValidationEmail(
			user.email,
			`${process.env.baseUrl}/api/users/confirm-email/${randomString}`,
		);
		user.emailConfirmationCode = randomString;
		user.emailConfirmed = false;
	}

	return users.update(
		{
			...user,
		},
		{
			where: { id: userId },
			returning: true,
		},
	)
		.then(res => {
			console.log("Updated user ", res[1][0].get());
			return res[1][0].get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while updating user", 500);
		})
};

exports.deleteUserByIdAndPassword = async (userId, password) => {
	const oldUser = await this.getUserById(userId);
	const { salt } = oldUser;

	checkPassword(oldUser.password, salt, password);

	return users.destroy({
		where: { id: userId },
	})
		.then(res => {
			console.log("Deleted user with id ", userId);
			return res;
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while deleting user", 500);
		})
};

exports.verifyEmail = async (emailConfirmationCode) => {
	if (emailConfirmationCode.length < 10)
		throw new CustomError("Seems suspicious, so not allowed!", 401);
	const response = await users.update(
		{
			emailConfirmed: true,
			emailConfirmationCode: null,
		},
		{
			where: { emailConfirmationCode },
			returning: true,
		},
	);
	if (response[0] !== 1) return false;
	return response[1][0].get();
};

exports.updateUserProfilePicture = async (req, userId) => {
	const pictureLink = getImageLinkById("profile", req.addedPicture);
	await users.update(
		{
			profilePicture: req.addedPicture,
		},
		{
			where: {
				id,
			},
		},
	);
	return pictureLink;
};

exports.resetPassword = async (email) => {
	const token = generateRandomString(200);

	const response = await users.update(
		{
			resetPasswordToken: token,
		},
		{
			where: {
				email,
				emailConfirmed: 1,
			},
		},
	);
	if (response[0]) {
		sendResetPasswordEmail(
			email,
			`${process.env.fontEndBaseUrl}/change-password/${token}`,
		);
	}
	return true;
};

exports.changePassword = async (password, token) => {
	const user = { newPassword: password };
	const response = await users.update(
		{
			resetPasswordToken: null,
		},
		{
			where: {
				resetPasswordToken: token,
			},
			returning: true,
		},
	);
	if (response[0] === 0)
		throw new CustomError("This token is incorrect or already used!", 403);

	const { id, username } = response[1][0].dataValues;

	await this.updateUser(id, user);

	return { success: true, username };
};
