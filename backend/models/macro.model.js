module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'macro',
		{
			protein: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			carbs: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			fat: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			fiber: {
				type: DataTypes.FLOAT,
			},
			sugar: {
				type: DataTypes.FLOAT,
			},
			saturated: {
				type: DataTypes.FLOAT,
			},
			polyunsaturated: {
				type: DataTypes.FLOAT,
			},
			monounsaturated: {
				type: DataTypes.FLOAT,
			},
			trans: {
				type: DataTypes.FLOAT,
			},
		},
		{ timestamps: false },
	);
};
