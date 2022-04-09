module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'nutrientUnit',
		{
			nutrientName: {
				type: DataTypes.STRING,
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
