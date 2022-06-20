module.exports = (sequelize) => {
	return sequelize.define(
		'tagsForRecipe',
		{
		},
		{ timestamps: false },
	);
};
