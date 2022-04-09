const LoginService = require("../services/login.service");

exports.login = async (req, res) => {
	try {
		//check if the request is not to often #no brute force
		await LoginService.checkForToManyAttempts(req.ip); //TODO NEED TO CHECK IF THIS IS THE CORRECT IP

		if (!req.body?.username || !req.body?.password) {
			return res.status(400).json({
				message: "Body should contain username and password!",
			});
		}
		const tokens = await LoginService.login(req.body);
		return res.status(200).json({
			data: tokens,
			message: "Success login!",
		});
	} catch (e) {
		return res.status(e.statusCode || 500).json({ message: e.message });
	}
};
