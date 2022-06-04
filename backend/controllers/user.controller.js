const UserService = require("../services/user.service");
const {
	generateSuccessEmailTemplate,
	generateFailedConfirmEmailTemplate,
} = require("../templates/templates");
const { makeLink, decryptId } = require("../middleware/utilities");

const base = "/users/";

exports.addUser = async (req, res) => {
	try {
		if (!req.body?.username || !req.body?.password) {
			return res.status(400).json({
				message: "Body should contain username and password!",
			});
		}

		if (req.body.username.search("@") !== -1) {
			return res.status(400).json({
				message: "️Username can't contain @!",
			});
		}

		const addedUser = await UserService.addUser(req.body);
		const addUserResponse = makeLink(base, addedUser.id);

		return res.status(200).json({
			data: addUserResponse,
			message: "Successful registration!",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getUserById = async (req, res) => {
	try {
		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "User not found",
			});

		let getUserByIdResponse = await UserService.getUserById(req.params.id);
		delete getUserByIdResponse.password;
		delete getUserByIdResponse.id;
		delete getUserByIdResponse.salt;

		return res.status(200).json({
			data: getUserByIdResponse, message: "User successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getUserByUsernameAndPassword = async (req, res) => {
	try {
		if (!req.body?.username || !req.body?.password) {
			return res.status(400).json({
				message: "Body should contain username and password!",
			});
		}

		const user = await UserService.getUserByUsernameAndPassword(
			req.body.username,
			req.body.password,
		);
		const getUserByUsernameAndPasswordResponse = makeLink(base, user.id);

		return res.status(200).json({
			data: getUserByUsernameAndPasswordResponse,
			message: "User successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.searchUsers = async (req, res) => {
	try {

		const searchedUsers = await UserService.searchUsers(req.body);
		let searchedUsersResponse = [];
		for (let searchedUser of searchedUsers)
			searchedUsersResponse.push(makeLink(base, searchedUser.id));

		return res.status(200).json({
			data: searchedUsersResponse,
			message: "Authors successfully retrieved",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateUserPassword = async (req, res) => {
	try {
		if (!req.body?.oldPassword) {
			return res.status(400).json({
				message: "Body must contain old password for updating user!",
			});
		}

		if (req.body.username === null || req.body.newPassword === null) {
			return res.status(400).json({
				message: "Username or new password cannot be null!",
			});
		}

		if (req.body.username) {
			return res.status(400).json({
				message: "Username cannot be changed!",
			});
		}
		//TODO verify if person that did the request is authorized to do this
		const userLink = await UserService.updateUser(req.params.id, req.body);
		return res
			.status(200)
			.json({ data: userLink, message: "User successfully updated" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({
				message: "Body must exist!",
			});
		}

		if (req.body?.username || req.body?.password) {
			return res.status(400).json({
				message: "Can't change username or password using this route.",
			});
		}
		if (req?.user?.id !== req.params.id) {
			return res.status(403).json({
				message: `Not allowed to change data for this user id ${req.params.id}`,
			});
		}

		const userLink = await UserService.updateUser2(req.params.id, req.body);
		return res.status(200).json({
			data: userLink,
			message: "User successfully updated",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		if (!req.body?.password) {
			return res.status(400).json({
				message: "Body must contain password for deleting user!",
			});
		}

		req.params.id = decryptId(req.params.id)[0];

		if (!req.params.id)
			return res.status(404).json({
				message: "User not found",
			});

		await UserService.deleteUserByIdAndPassword(req.params.id, req.body.password);

		return res.status(200).json({
			message: "User successfully deleted",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const updatedUser = await UserService.verifyEmail(req.params.code);
		if (updatedUser) {
			return res.status(200).setHeader("Content-Type", "text/html").send(
					generateSuccessEmailTemplate(updatedUser.email, updatedUser.username),
				);
		} else
			return res.status(400).setHeader("Content-Type", "text/html").send(generateFailedConfirmEmailTemplate());
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.updateUserProfilePicture = async (req, res) => {
	try {
		if (!req.addedPicture) {
			return res.status(400).json({
				message: "No picture found!",
			});
		}

		if (req?.user?.id !== req.params.id) {
			return res.status(403).json({
				message: `Not allowed to change data for this user id ${req.params.id}`,
			});
		}
		const pictureLink = await UserService.updateUserProfilePicture(
			req,
			req.params.id,
		);
		return res.status(200).json({
			pictureLink: pictureLink,
			message: "User picture successfully updated!",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		if (!req?.body?.email) {
			return res.status(400).json({
				message: "You need to provide an email in body!",
			});
		}
		const pictureLink = await UserService.resetPassword(req.body.email);
		return res.status(200).json({
			pictureLink: pictureLink,
			message:
				"If your email exist and you verified it you will receive a reset password email!",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.changePassword = async (req, res) => {
	try {
		if (!req?.body?.token) {
			return res.status(400).json({
				message: "You need to provide a token in body!",
			});
		}
		if (!req?.body?.password) {
			return res.status(400).json({
				message: "You need to provide a password in body!",
			});
		}
		if (req.body.password.length < 10) {
			return res.status(400).json({
				message: "You need to provide a password with more than 10 characters!",
			});
		}
		const response = await UserService.changePassword(
			req.body.password,
			req.body.token,
		);
		return res.status(200).json({
			username: response.username,
			message: `Successful updated password for user: ${response.username}`,
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
