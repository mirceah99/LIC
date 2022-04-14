const UserService = require("../services/user.service");
const {
	generateSuccessEmailTemplate,
	generateFailedConfirmEmailTemplate,
} = require("../templates/templates");

exports.addUser = async (req, res) => {
	try {
		if (!req.body?.username || !req.body?.password) {
			console.log("problem!");
			return res.status(400).json({
				message: "Body should contain username and password!",
			});
		}
		if (req.body.username.search("@") !== -1) {
			return res.status(400).json({
				message: "️Username can't contain @!",
			});
		}

		const userLink = await UserService.addUser(req.body);
		return res
			.status(200)
			.json({ data: userLink, message: "Successful registration!" });
	} catch (e) {
		console.log(e);
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};

exports.getUserByUID = async (req, res) => {
	try {
		const user = await UserService.getUserByUID(req.params.id);
		return res
			.status(200)
			.json({ data: user, message: "User successfully retrieved" });
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

		const userLink = await UserService.getUserByUsernameAndPassword(
			req.body.username,
			req.body.password
		);
		return res
			.status(200)
			.json({ data: userLink, message: "User successfully retrieved" });
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
		return res
			.status(200)
			.json({ data: userLink, message: "User successfully updated" });
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

		await UserService.deleteUser(req.params.id, req.body.password);
		return res.status(200).json({ message: "User successfully deleted" });
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
exports.verifyEmail = async (req, res) => {
	try {
		const updatedUser = await UserService.verifyEmail(req.params.code);
		if (updatedUser) {
			return res
				.status(200)
				.setHeader("Content-Type", "text/html")
				.send(
					generateSuccessEmailTemplate(updatedUser.email, updatedUser.username)
				);
		} else
			return res
				.status(400)
				.setHeader("Content-Type", "text/html")
				.send(generateFailedConfirmEmailTemplate());
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
