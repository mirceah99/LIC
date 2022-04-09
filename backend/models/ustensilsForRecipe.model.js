module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'ustensilsForRecipe',
		{
			ustensilId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'ustensils',
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
