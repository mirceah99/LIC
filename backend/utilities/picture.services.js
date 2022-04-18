const multer = require("multer");
const { generateRandomString } = require("../middleware/utilities");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public-static/images/profile/");
	},
	filename: function (req, file, cb) {
		req.addedPicture = `${new Date().getTime()}-${generateRandomString(
			30
		)}.jpg`;
		cb(null, req.addedPicture);
	},
});

const uploadProfilePic = multer({ storage });

// const upload = multer({ dest: 'uploads/' })

const getImageLinkById = (folder, id) => {
	return `${process.env.baseUrl}/static/images/${folder}/${id}`;
};
const uploadProfilePictureMiddleware =
	uploadProfilePic.single("profilePicture");

module.exports = {
	getImageLinkById,
	uploadProfilePictureMiddleware,
};
