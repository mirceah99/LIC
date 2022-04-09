module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'ingredientUnit',
		{
			ingredientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'ingredients',
					key: 'id',
				},
			},
			unitOfMeasurement: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			miligrams: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
