const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })

const getImageLinkById = (folder, id, extension = "png") => {
	return `${process.env.baseUrl}/static/images/${folder}/${id}.${extension}`;
};
module.exports = { getImageLinkById };
