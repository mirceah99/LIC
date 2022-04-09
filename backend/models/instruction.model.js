module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'instruction',
		{
			step: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
