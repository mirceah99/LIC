const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operatorsAliases: false,
	logging: false,
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.ingredients = require("./ingredient.model")(sequelize, Sequelize);
db.macros = require("./macro.model")(sequelize, Sequelize);
db.micros = require("./micro.model")(sequelize, Sequelize);
db.images = require("./image.model")(sequelize, Sequelize);
db.authors = require("./author.model")(sequelize, Sequelize);
db.review = require("./review.model")(sequelize, Sequelize);
db.recipes = require("./recipe.model")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);
db.tags = require("./tag.model")(sequelize, Sequelize);
db.instructions = require("./instruction.model")(sequelize, Sequelize);
db.ingredientsForRecipe = require("./ingredientsForRecipe.model")(
	sequelize,
	Sequelize
);
db.ustensils = require("./ustensil.model")(sequelize, Sequelize);
db.ustensilsForRecipe = require("./ustensilsForRecipe.model")(
	sequelize,
	Sequelize
);
db.tagsForRecipe = require("./tagsForRecipe.model")(sequelize, Sequelize);
db.ingredientUnits = require("./ingredientUnit.model")(sequelize, Sequelize);
db.collections = require("./collection.model")(sequelize, Sequelize);
db.loginHistory = require("./loginHistory.model")(sequelize, Sequelize);

db.users.hasOne(db.review, {
	foreignKey: "user",
	onDelete: "CASCADE",
});

db.ingredients.belongsTo(db.macros, {
	foreignKey: "macros",
	onDelete: "CASCADE",
});

db.ingredients.belongsTo(db.micros, {
	foreignKey: "micros",
	onDelete: "CASCADE",
});

db.authors.hasOne(db.recipes, {
	foreignKey: "author",
	onDelete: "CASCADE",
});

db.recipes.hasMany(db.instructions, {
	foreignKey: "recipeId",
});

db.users.hasMany(db.images, {
	foreignKey: "userId",
});

db.users.hasMany(db.collections, {
	as: "collections",
});

db.collections.belongsTo(db.users, {
	foreignKey: "userId",
	as: "user",
});

// a user can like more recipe, a recipe can be liked by more users
db.users.belongsToMany(db.recipes, { through: "usersLikes" });
db.recipes.belongsToMany(db.users, { through: "usersLikes" });
db.usersLikes = sequelize.models.usersLikes;

// a recipe has more ingredients
db.recipes.belongsToMany(db.ingredients, { through: db.ingredientsForRecipe });
db.ingredients.belongsToMany(db.recipes, { through: db.ingredientsForRecipe });

module.exports = db;
