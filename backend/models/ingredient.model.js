module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"ingredient",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			image: {
				type: DataTypes.STRING,
				defaultValue: "default.png",
			},
		},
		{ timestamps: false }
	);
};
