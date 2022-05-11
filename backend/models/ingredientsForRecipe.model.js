module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"ingredientsForRecipe",
		{
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
