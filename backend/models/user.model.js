module.exports = (sequelize, DataTypes) => {
	return sequelize.define("user", {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		youTube: {
			type: DataTypes.STRING,
		},
		instagram: {
			type: DataTypes.STRING,
		},
		facebook: {
			type: DataTypes.STRING,
		},
		twitter: {
			type: DataTypes.STRING,
		},
		tikTok: {
			type: DataTypes.STRING,
		},
		reddit: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		salt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		emailConfirmed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		emailConfirmationCode: {
			type: DataTypes.STRING,
		},
		profilePicture: {
			type: DataTypes.STRING,
			defaultValue: "default",
		},
	});
};
