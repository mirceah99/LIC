const multer = require("multer");
const { generateRandomString } = require("../middleware/utilities");
const profileStorage = multer.diskStorage({
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
const ingredientStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public-static/images/ingredients/");
	},
	filename: function (req, file, cb) {
		req.addedPicture = `${new Date().getTime()}-${generateRandomString(
			30
		)}.jpg`;
		cb(null, req.addedPicture);
	},
});
const recipeStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public-static/images/recipes/");
	},
	filename: function (req, file, cb) {
		req.addedPicture = `${new Date().getTime()}-${generateRandomString(
			30
		)}.jpg`;
		cb(null, req.addedPicture);
	},
});

const uploadProfilePic = multer({ storage: profileStorage });
const uploadIngredientPic = multer({ storage: ingredientStorage });
const uploadRecipePic = multer({ storage: recipeStorage });

// const upload = multer({ dest: 'uploads/' })

const getImageLinkById = (folder, id) => {
	return `${process.env.baseUrl}/static/images/${folder}/${id}`;
};
const uploadProfilePictureMiddleware =
	uploadProfilePic.single("profilePicture");
const uploadIngredientPictureMiddleware =
	uploadIngredientPic.single("ingredientPicture");
const uploadRecipePictureMiddleware = uploadRecipePic.single("recipePicture");

module.exports = {
	getImageLinkById,
	uploadProfilePictureMiddleware,
	uploadIngredientPictureMiddleware,
	uploadRecipePictureMiddleware,
};
