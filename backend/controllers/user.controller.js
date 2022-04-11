const UserService = require("../services/user.service");

exports.addUser = async (req, res) => {
	try {
		if (!req.body?.username || !req.body?.password) {
			console.log("problem!");
			return res.status(400).json({
				message: "Body should contain username and password!",
			});
		}
		if (req.body.username.search("@") !== -1) {
			console.log("okay");
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

		const userLink = await UserService.updateUser(req.params.id, req.body);
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
