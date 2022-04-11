module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"tag",
		{
			text: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{ timestamps: false }
	);
};
