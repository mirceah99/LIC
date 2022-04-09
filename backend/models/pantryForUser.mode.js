const User = require('./user.model');
const Ingredient = require('./ingredient.model');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'pantryForUser',
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},
			ingredientId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Ingredient,
					key: 'id',
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
			expirationDate: {
				type: DataTypes.DATEONLY,
			},
		},
		{ timestamps: false },
	);
};
