module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"recipe",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(5000),
				allowNull: false,
			},
			prepTime: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			cookingTime: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			servingSize: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			likes: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING,
				defaultValue: "default.png",
			},
			totalCalories: {
				type: DataTypes.FLOAT,
			},
			totalProtein: {
				type: DataTypes.FLOAT,
			},
			totalCarbs: {
				type: DataTypes.FLOAT,
			},
			totalFat: {
				type: DataTypes.FLOAT,
			},
			totalFiber: {
				type: DataTypes.FLOAT,
			},
		},
		{ timestamps: false }
	);
};
