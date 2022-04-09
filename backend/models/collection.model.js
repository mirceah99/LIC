module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'collection',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
