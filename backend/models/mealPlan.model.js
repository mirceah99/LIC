const Recipe = require('./recipe.model');
const User = require('./user.model');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'mealPlan',
		{
			name: {
				type: DataTypes.STRING,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},
			recipeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Recipe,
					key: 'id',
				},
			},
			servingSize: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
