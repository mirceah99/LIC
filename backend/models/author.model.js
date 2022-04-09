module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'author',
		{
			link: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
