module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"ingredientsForRecipe",
		{
			ingredientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "ingredients",
					key: "id",
				},
			},
			recipeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "recipes",
					key: "id",
				},
			},
			quantity: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			unitOfMeasurement: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			optionality: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
		},
		{ timestamps: false }
	);
};
