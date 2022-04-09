module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'micro',
		{
			sodium: {
				type: DataTypes.FLOAT,
			},
			potassium: {
				type: DataTypes.FLOAT,
			},
			vitaminA: {
				type: DataTypes.FLOAT,
			},
			vitaminC: {
				type: DataTypes.FLOAT,
			},
			calcium: {
				type: DataTypes.FLOAT,
			},
			iron: {
				type: DataTypes.FLOAT,
			},
		},
		{ timestamps: false },
	);
};
