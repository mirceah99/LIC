const Ingredient = require('./ingredient.model');
const User = require('./user.model');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'shoppingForUser',
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
		},
		{ timestamps: false },
	);
};
