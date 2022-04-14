const { getUserByUsernameAndPasswordAllData } = require("./user.service");
const { createToken } = require("../middleware/utilities");
const { loginHistory } = require("../models/index");
const { CustomError } = require("../middleware/utilities");

exports.login = async ({ username, password }) => {
	const user = await getUserByUsernameAndPasswordAllData(username, password);
	const payload = {
		id: user.url.substring(user.url.lastIndexOf("/") + 1),
		url: user.url,
	};
	const accessToken = createToken(payload);
	const refreshToken = "refreshToken"; //TODO
	return { accessToken, refreshToken };
};
exports.checkForToManyAttempts = async (ip) => {
	const usersResponse = await loginHistory.findOne({
		where: {
			ip,
		},
	});

	//if i can't find the ip i will insert it and return true
	if (usersResponse === null) {
		await loginHistory.create({
			ip,
			tries: 1,
		});
		return true;
	} else {
		const timePassedInSeconds =
			(new Date() - usersResponse.dataValues.updatedAt) / 1000;
		// if passed more than 30 sec i can reset the tries counter
		if (timePassedInSeconds > 30) {
			await loginHistory.upsert(
				{
					ip,
					tries: 1,
				},
				{
					where: {
						ip,
					},
				}
			);
			return true;
		}
		if (usersResponse.dataValues.tries < 6) {
			// increment tries
			loginHistory.increment("tries", {
				where: {
					ip,
				},
			});
			return true;
		}
		//if the user did more than 5 request in last 1 minute (actually i take in count just the time of the last request, but is fine, you can check this if you want)
		//he is not allowed to run the request logic 🛑✋🛑
		throw new CustomError("Try later, to many attempts! 🛑✋🛑", 429);
	}
};
