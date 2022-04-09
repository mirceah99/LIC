module.exports = (sequelize, DataTypes) => {
	return sequelize.define('review', {
		comment: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});
};
