module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'loginHistory',
		{
			tries: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			ip: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true
			},
		},
		{timestamp: true},
	);
};
