const Ustensil = require('./ustensil.model');
const User = require('./user.model');

module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'ustensilsForUser',
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},
			ustensilId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Ustensil,
					key: 'id',
				},
			},
		},
		{ timestamps: false },
	);
};
