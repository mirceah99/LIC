var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const {
	redirectUris,
	clientSecret,
	clientId,
	emailRefreshToken,
	emailUsername,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
	clientId,
	clientSecret,
	redirectUris
);
oAuth2Client.setCredentials({ refresh_token: emailRefreshToken });

async function sendEmail(receiverEmail, subject, text, html) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();
		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "Oauth2",
				user: emailUsername,
				clientId,
				clientSecret,
				refreshToken: emailRefreshToken,
				accessToken,
			},
		});
		const mailOptions = {
			from: "FIT MEAL PLANNER",
			to: receiverEmail,
			subject,
			text,
			html,
		};
		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (e) {
		console.log(e);
		return false;
	}
}

async function sendValidationEmail(receiverEmail, link) {
	const text = `To verify your account please use this link: ${link}`;
	const html = `<h2>Fit meals is here for you!</h2>
			      <h2>To verify your account please use this <a href="${link}">link</a>.</h2>
				  <h4>If you can't press the link press Report not spam, or just move the email from spam, if doesn't work here is the link ( ${link} ).</h4>`;
	const subject = "Verify your account.";
	const response = await sendEmail(receiverEmail, subject, text, html);
	if (response) {
		console.log("EMAIL SENT SUCCESSFUL ", response.envelope);
	} else {
		console.log("Error sending email 😔😔😔😔");
	}
}

async function sendResetPasswordEmail(receiverEmail, link) {
	const text = `To reset your password please use this link: ${link}`;
	const html = `<h2>Fit meals is here for you!</h2>
			      <h2>To reset your password please use this <a href="${link}">link</a>.</h2>
				  <h4>If you can't press the link press Report not spam, or just move the email from spam, if doesn't work here is the link ( ${link} ).</h4>`;
	const subject = "Reset password";
	const response = await sendEmail(receiverEmail, subject, text, html);
	if (response) {
		console.log("EMAIL SENT SUCCESSFUL ", response.envelope);
	} else {
		console.log("Error sending email 😔😔😔😔");
	}
}

module.exports = { sendValidationEmail, sendResetPasswordEmail };
