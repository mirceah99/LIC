module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		'image',
		{
			content: {
				type: DataTypes.BLOB,
				allowNull: false,
			},
		},
		{ timestamps: false },
	);
};
