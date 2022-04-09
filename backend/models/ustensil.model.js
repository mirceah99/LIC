module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'ustensil',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
