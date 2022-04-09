const Collection = require('./collection.model');
const Recipe = require('./recipe.model');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'recipesForCollection',
		{
			recipeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Recipe,
					key: 'id',
				},
			},
			collectionId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Collection,
					key: 'id',
				},
			},
		},
		{ timestamps: false },
	);
};
