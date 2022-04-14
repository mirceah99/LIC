var fs = require("fs");

require.extensions[".html"] = function (module, filename) {
	module.exports = fs.readFileSync(filename, "utf8");
};

function generateSuccessEmailTemplate(email, username) {
	const successResponse = require("./success.html");

	let response = successResponse.replace("{email}", email);
	response = response.replace("{username}", username);
	return response;
}
function generateFailedConfirmEmailTemplate() {
	const invalidConfirmationLink = require("./invalidConfirmationLink.html");

	return invalidConfirmationLink;
}

module.exports = {
	generateSuccessEmailTemplate,
	generateFailedConfirmEmailTemplate,
};
