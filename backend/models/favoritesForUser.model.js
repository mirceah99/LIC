const User = require('./user.model');
const Recipe = require('./recipe.model');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'favoritesForUser',
		{
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
		},
		{ timestamps: false },
	);
};
