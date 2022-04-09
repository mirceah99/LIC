module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'tagsForRecipe',
		{
			tagId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'tags',
					key: 'id',
				},
			},
			recipeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'recipes',
					key: 'id',
				},
			},
		},
		{ timestamps: false },
	);
};
