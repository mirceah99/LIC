module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'recipe',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			prepTime: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			cookingTime: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			servingSize: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			likes: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
