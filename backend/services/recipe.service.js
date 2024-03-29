const {
	recipes,
	instructions,
	ingredientsForRecipe,
	tags,
} = require("../models/index");
const { usersLikes } = require("../models/index");

const {
	decryptId,
	encryptId,
	CustomError,
} = require("../middleware/utilities");
const ImageService = require("./image.service");
const TagService = require("./tag.service");
const InstructionService = require("./instruction.service");
const IngredientService = require("./ingredient.service");
const UstensilService = require("./ustensil.service");
const { getImageLinkById } = require("../utilities/picture.services");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.addRecipe = (recipe) => {
	return recipes
		.create({
			name: recipe.name,
			description: recipe.description,
			prepTime: recipe.prepTime,
			cookingTime: recipe.cookingTime,
			servingSize: recipe.servingSize,
			likes: 0,
			author: recipe.author || null,
			image: recipe.pictureName
				? getImageLinkById("recipes", recipe.pictureName)
				: "default.jpg",
		})
		.then(async (res) => {
			console.log("Added recipe", res.get());
			const recipeId = res.get().id;

			for (let ingredientForRecipe of recipe.ingredients) {
				await this.linkIngredientToRecipe(ingredientForRecipe, recipeId);
			}

			await this.updateTotalsOfRecipeById(recipeId);

			for (let index = 0; index < recipe.instructions.length; index++) {
				let instructionObject = {
					step: index + 1,
					description: recipe.instructions[index],
				};
				await this.addInstructionToRecipe(instructionObject, recipeId);
			}

			if (recipe.tags) {
				for (let tag of recipe.tags) {
					await this.linkTagToRecipeByText(tag, recipeId);
				}
			}

			return res.get();
		})
		.catch((err) => {
			console.error(err);
			throw new CustomError(err.message, err.statusCode || 500);
		});
};

exports.getRecipeById = async (encryptedId) => {
	const decryptedId = decryptId(encryptedId)[0];

	//get recipe main data
	let recipe = await recipes.findByPk(decryptedId);

	//get recipe steps
	const stepsResponse = await instructions.findAll({
		where: {
			recipeId: decryptedId,
		},
		order: ["step"],
	});
	const steps = [];

	stepsResponse.forEach(({ dataValues: values }) => {
		steps.push(values.description);
	});

	//get recipe ingredients
	const ingredients = await recipe.getIngredients();

	//get data for each ingredient and sum macros and micros
	const total = {
		protein: 0,
		carbs: 0,
		fat: 0,
		fiber: 0,
		sugar: 0,
		saturated: 0,
		polyunsaturated: 0,
		monounsaturated: 0,
		trans: 0,
		sodium: 0,
		potassium: 0,
		vitaminA: 0,
		vitaminC: 0,
		calcium: 0,
		iron: 0,
	};
	for (let ingredient of ingredients) {
		const { dataValues: macros } = await ingredient.getMacro();
		const { dataValues: micros } = await ingredient.getMicro();
		const multiplier =
			ingredient.dataValues.ingredientsForRecipe.dataValues.quantity;
		ingredient.dataValues.macros = macros;
		ingredient.dataValues.micros = micros;
		for (let attr in macros) {
			total[attr] += +macros[attr] * multiplier;
		}
		for (let attr in micros) {
			total[attr] += +micros[attr] * multiplier;
		}
	}
	// calculate total calories
	total.calories = total.protein * 4 + total.carbs * 4 + total.fat * 9;

	recipe = recipe.dataValues;
	let recipeResponse = {
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: recipe.likes,
		image: recipe.image,
		id: encryptId(recipe.id),
	};
	recipeResponse.steps = steps;
	recipeResponse.ingredients = ingredients;
	recipeResponse.total = total;
	delete recipeResponse.total.id;
	return recipeResponse;
};

// exports.getRecipeById = async (encryptedId) => {
// 	const decryptedId = decryptId(encryptedId)[0];

// 	//get recipe main data
// 	let recipe = await recipes.findByPk(decryptedId);

// 	//get recipe ingredients
// 	const ingredients = await IngredientService.getIngredientsByRecipeId(
// 		recipe.get().id
// 	);

// 	//get data for each ingredient and sum macros and micros
// 	let total = await this.calculateMacros(ingredients);

// 	recipe = recipe.dataValues;
// 	let recipeResponse = {
// 		name: recipe.name,
// 		description: recipe.description,
// 		prepTime: recipe.prepTime,
// 		cookingTime: recipe.cookingTime,
// 		servingSize: recipe.servingSize,
// 		likes: recipe.likes,
// 		image: recipe.image,
// 		id: encryptId(recipe.id),
// 	};
// 	// recipeResponse.steps = steps; //TODO FIX THIS STEPS THING
// 	recipeResponse.ingredients = ingredients;
// 	recipeResponse.total = total;
// 	delete recipeResponse.total.id;
// 	return recipeResponse;
// };

exports.calculateMacros = async (ingredients) => {
	let total = {
		protein: 0,
		carbs: 0,
		fat: 0,
		fiber: 0,
		sugar: 0,
		saturated: 0,
		polyunsaturated: 0,
		monounsaturated: 0,
		trans: 0,
		sodium: 0,
		potassium: 0,
		vitaminA: 0,
		vitaminC: 0,
		calcium: 0,
		iron: 0,
	};
	for (let ingredient of ingredients) {
		const { dataValues: macros } = await ingredient.getMacro();
		const { dataValues: micros } = await ingredient.getMicro();
		const multiplier =
			ingredient.dataValues.ingredientsForRecipe.dataValues.quantity;
		ingredient.dataValues.macros = macros;
		ingredient.dataValues.micros = micros;
		for (let attr in macros) {
			total[attr] += +macros[attr] * multiplier;
		}
		for (let attr in micros) {
			total[attr] += +micros[attr] * multiplier;
		}
	}
	// calculate total calories
	total.calories = total.protein * 4 + total.carbs * 4 + total.fat * 9;
	return total;
};

exports.getRecipeByDecryptedId = async (decryptedId) => {
	//get recipe main data
	let recipe = await recipes.findByPk(decryptedId);

	//get recipe ingredients
	const ingredients = await IngredientService.getIngredientsByRecipeId(
		recipe.get().id
	);

	recipe = recipe.dataValues;
	let recipeResponse = {
		id: recipe.id,
		name: recipe.name,
		description: recipe.description,
		prepTime: recipe.prepTime,
		cookingTime: recipe.cookingTime,
		servingSize: recipe.servingSize,
		likes: recipe.likes,
	};
	recipeResponse.ingredients = ingredients;
	return recipeResponse;
};

exports.getRecipesByIngredientId = async (ingredientId) => {
	let recipes = [];
	return ingredientsForRecipe
		.findAll({
			where: {
				ingredientId: ingredientId,
			},
		})
		.then(async (res) => {
			for (let ingredientForRecipe of res) {
				let recipe = await this.getRecipeByDecryptedId(
					ingredientForRecipe.recipeId
				);
				recipes.push(recipe);
			}
			return recipes;
		})
		.catch((err) => {
			console.error(err);
			throw new CustomError("Error while getting recipes by ingredient", 500);
		});
};

exports.updateTotalsOfRecipeByIngredientId = async (ingredientId) => {
	let recipes = await this.getRecipesByIngredientId(ingredientId);
	for (let recipe of recipes) this.updateTotalsOfRecipeById(recipe.id);
};

exports.updateTotalsOfRecipeById = async (recipeId) => {
	let ingredients = await ingredientsForRecipe.findAll({
		where: {
			recipeId: recipeId,
		},
	});
	let totals = {
		totalCalories: 0,
		totalProtein: 0,
		totalCarbs: 0,
		totalFat: 0,
		totalFiber: 0,
		totalSodium: 0,
		totalPotassium: 0,
		totalVitaminA: 0,
		totalVitaminC: 0,
		totalCalcium: 0,
		totalIron: 0,
	};
	for (let ingredientForRecipe of ingredients) {
		let ingredient = await IngredientService.getIngredientById(
			ingredientForRecipe.ingredientId
		);
		totals.totalProtein += ingredient.macros.protein;
		totals.totalCarbs += ingredient.macros.carbs;
		totals.totalFat += ingredient.macros.fat;
		totals.totalFiber += ingredient.macros.fiber;
		totals.totalSodium += ingredient.micros.sodium;
		totals.totalPotassium += ingredient.micros.potassium;
		totals.totalVitaminA += ingredient.micros.vitaminA;
		totals.totalVitaminC += ingredient.micros.vitaminC;
		totals.totalCalcium += ingredient.micros.calcium;
		totals.totalIron += ingredient.micros.iron;
	}

	let recipe = (await recipes.findByPk(recipeId)).get();

	totals.totalProtein = totals.totalProtein * recipe.servingSize;
	totals.totalCarbs = totals.totalCarbs * recipe.servingSize;
	totals.totalFat = totals.totalFat * recipe.servingSize;
	totals.totalFiber = totals.totalFiber * recipe.servingSize;
	totals.totalSodium = totals.totalSodium * recipe.servingSize;
	totals.totalPotassium = totals.totalPotassium * recipe.servingSize;
	totals.totalVitaminA = totals.totalVitaminA * recipe.servingSize;
	totals.totalVitaminC = totals.totalVitaminC * recipe.servingSize;
	totals.totalCalcium = totals.totalCalcium * recipe.servingSize;
	totals.totalIron = totals.totalIron * recipe.servingSize;

	totals.totalCalories =
		totals.totalProtein * 4 + totals.totalCarbs * 4 + totals.totalFat * 9;

	return await recipes
		.update(
			{
				...totals,
			},
			{
				where: { id: recipeId },
			}
		)
		.then((res) => {
			console.log("Updated recipe", res, " with totals ", totals);
			return res;
		})
		.catch((err) => {
			console.error(err);
			throw new CustomError("Error while updating recipe totals", 500);
		});
};

exports.addImageToRecipe = async (image, recipeId) => {
	await ImageService.addImageToRecipe(image, recipeId);
};

exports.linkTagToRecipeByText = async (tagText, recipeId) => {
	await TagService.linkTagToRecipeByText(tagText, recipeId);
};

exports.addInstructionToRecipe = async (instruction, recipeId) => {
	await InstructionService.addInstructionToRecipe(instruction, recipeId);
};

exports.linkIngredientToRecipe = async (ingredientForRecipe, recipeId) => {
	await IngredientService.linkIngredientToRecipe(ingredientForRecipe, recipeId);
};

exports.linkUstensilToRecipe = async (ustensilId, recipeId) => {
	await UstensilService.linkUstensilToRecipe(ustensilId, recipeId);
};

exports.like = async ({ recipeId, toDo }, userId) => {
	const decryptedRecipeId = decryptId(recipeId)[0];
	const decryptedUserId = decryptId(userId)[0];
	if (toDo === "like") {
		await usersLikes.create({
			userId: decryptedUserId,
			recipeId: decryptedRecipeId,
		});
		// increment likes
		await recipes.increment("likes", {
			by: 1,
			where: { id: decryptedRecipeId },
		});
	}
	if (toDo === "unlike") {
		await usersLikes.destroy({
			where: {
				userId: decryptedUserId,
				recipeId: decryptedRecipeId,
			},
		});
		// decrement likes
		await recipes.decrement("likes", {
			by: 1,
			where: { id: decryptedRecipeId },
		});
	}
};

exports.searchRecipes = async (searchOptions) => {
	let queryOptions = {};
	if (searchOptions.filter) {
		queryOptions.where = {
			name: searchOptions.filter.name
				? { [Op.iLike]: `%${searchOptions.filter.name}%` }
				: undefined,
			description: searchOptions.filter.description
				? { [Op.iLike]: `%${searchOptions.filter.description}%` }
				: undefined,
			prepTime: searchOptions.filter.prepTime
				? {
						[Op.gte]:
							searchOptions.filter.prepTime.start !== undefined
								? searchOptions.filter.prepTime.start
								: undefined,
						[Op.lte]: searchOptions.filter.prepTime.end
							? searchOptions.filter.prepTime.end
							: undefined,
				  }
				: undefined,
			cookingTime: searchOptions.filter.cookingTime
				? {
						[Op.gte]:
							searchOptions.filter.cookingTime.start !== undefined
								? searchOptions.filter.cookingTime.start
								: undefined,
						[Op.lte]: searchOptions.filter.cookingTime.end
							? searchOptions.filter.cookingTime.end
							: undefined,
				  }
				: undefined,
			servingSize: searchOptions.filter.servingSize
				? {
						[Op.gte]:
							searchOptions.filter.servingSize.start !== undefined
								? searchOptions.filter.servingSize.start
								: undefined,
						[Op.lte]: searchOptions.filter.servingSize.end
							? searchOptions.filter.servingSize.end
							: undefined,
				  }
				: undefined,
			totalCalories: searchOptions.filter.calories
				? {
						[Op.gte]:
							searchOptions.filter.calories.start !== undefined
								? searchOptions.filter.calories.start
								: undefined,
						[Op.lte]: searchOptions.filter.calories.end
							? searchOptions.filter.calories.end
							: undefined,
				  }
				: undefined,
			totalProtein: searchOptions.filter.protein
				? {
						[Op.gte]:
							searchOptions.filter.protein.start !== undefined
								? searchOptions.filter.protein.start
								: undefined,
						[Op.lte]: searchOptions.filter.protein.end
							? searchOptions.filter.protein.end
							: undefined,
				  }
				: undefined,
			totalCarbs: searchOptions.filter.carbs
				? {
						[Op.gte]:
							searchOptions.filter.carbs.start !== undefined
								? searchOptions.filter.carbs.start
								: undefined,
						[Op.lte]: searchOptions.filter.carbs.end
							? searchOptions.filter.carbs.end
							: undefined,
				  }
				: undefined,
			totalFat: searchOptions.filter.fat
				? {
						[Op.gte]:
							searchOptions.filter.fat.start !== undefined
								? searchOptions.filter.fat.start
								: undefined,
						[Op.lte]: searchOptions.filter.fat.end
							? searchOptions.filter.fat.end
							: undefined,
				  }
				: undefined,
			totalFiber: searchOptions.filter.fiber
				? {
						[Op.gte]:
							searchOptions.filter.fiber.start !== undefined
								? searchOptions.filter.fiber.start
								: undefined,
						[Op.lte]: searchOptions.filter.fiber.end
							? searchOptions.filter.fiber.end
							: undefined,
				  }
				: undefined,
			totalSodium: searchOptions.filter.sodium
				? {
						[Op.gte]:
							searchOptions.filter.sodium.start !== undefined
								? searchOptions.filter.sodium.start
								: undefined,
						[Op.lte]: searchOptions.filter.sodium.end
							? searchOptions.filter.sodium.end
							: undefined,
				  }
				: undefined,
			totalPotassium: searchOptions.filter.potassium
				? {
						[Op.gte]:
							searchOptions.filter.potassium.start !== undefined
								? searchOptions.filter.potassium.start
								: undefined,
						[Op.lte]: searchOptions.filter.potassium.end
							? searchOptions.filter.potassium.end
							: undefined,
				  }
				: undefined,
			totalVitaminA: searchOptions.filter.vitaminA
				? {
						[Op.gte]:
							searchOptions.filter.vitaminA.start !== undefined
								? searchOptions.filter.vitaminA.start
								: undefined,
						[Op.lte]: searchOptions.filter.vitaminA.end
							? searchOptions.filter.vitaminA.end
							: undefined,
				  }
				: undefined,
			totalVitaminC: searchOptions.filter.vitaminC
				? {
						[Op.gte]:
							searchOptions.filter.vitaminC.start !== undefined
								? searchOptions.filter.vitaminC.start
								: undefined,
						[Op.lte]: searchOptions.filter.vitaminC.end
							? searchOptions.filter.vitaminC.end
							: undefined,
				  }
				: undefined,
			totalCalcium: searchOptions.filter.calcium
				? {
						[Op.gte]:
							searchOptions.filter.calcium.start !== undefined
								? searchOptions.filter.calcium.start
								: undefined,
						[Op.lte]: searchOptions.filter.calcium.end
							? searchOptions.filter.calcium.end
							: undefined,
				  }
				: undefined,
			totalIron: searchOptions.filter.iron
				? {
						[Op.gte]:
							searchOptions.filter.iron.start !== undefined
								? searchOptions.filter.iron.start
								: undefined,
						[Op.lte]: searchOptions.filter.iron.end
							? searchOptions.filter.iron.end
							: undefined,
				  }
				: undefined,
			likes: searchOptions.filter.likes
				? {
						[Op.gte]:
							searchOptions.filter.likes.start !== undefined
								? searchOptions.filter.likes.start
								: undefined,
						[Op.lte]: searchOptions.filter.likes.end
							? searchOptions.filter.likes.end
							: undefined,
				  }
				: undefined,
			author: searchOptions.filter.author
				? { [Op.iLike]: `%${searchOptions.filter.author}%` }
				: undefined,
		};
	}
	if (searchOptions.order) {
		queryOptions.order = searchOptions.order;
	}
	if (searchOptions.limit) {
		queryOptions.limit = searchOptions.limit;
	}
	if (searchOptions.offset) {
		queryOptions.offset = searchOptions.offset;
	}
	queryOptions.include = [
		{
			model: tags,
			attributes: ["text"],
			as: "tags",
		},
	];
	queryOptions.attributes = [
		"id",
		"name",
		"description",
		"prepTime",
		"cookingTime",
		"servingSize",
		"likes",
		"author",
		"totalCalories",
		"totalProtein",
		"totalCarbs",
		"totalFat",
		"totalFiber",
		"totalSodium",
		"totalPotassium",
		"totalVitaminA",
		"totalVitaminC",
		"totalCalcium",
		"totalIron",
	];
	for (let attr in queryOptions.where) {
		if (queryOptions.where[attr] === undefined) {
			delete queryOptions.where[attr];
		}
	}
	console.log("queryOptions.where", queryOptions.where);

	let recipesList = await recipes
		.findAll(queryOptions)
		.then((res) => res)
		.catch((err) => {
			console.error(err);
			throw new CustomError("Error while searching recipes", 500);
		});

	let recipesResponse = [];
	for (let recipe of recipesList) {
		if (searchOptions?.filter?.allOfTags) {
			let tags = recipe.get().tags.map((tag) => tag.get().text);
			let hasAllOfTags = true;
			for (let filterTag of searchOptions.filter.allOfTags)
				if (!tags.includes(filterTag)) hasAllOfTags = false;
			if (!hasAllOfTags) continue;
		}
		recipesResponse.push(recipe.get());
	}
	return recipesResponse;
};

exports.getLiked = async (userId) => {
	const decryptedUserId = decryptId(userId)[0];
	const recipes = await usersLikes.findAll({
		attributes: ["recipeId"],
		where: {
			userId: decryptedUserId,
		},
	});
	const encryptedRecipes = [];
	recipes.forEach((recipe) => {
		encryptedRecipes.push(
			`${process.env.baseUrl}/api/recipes/${encryptId(
				recipe.dataValues.recipeId
			)}`
		);
	});
	return encryptedRecipes;
};

exports.userLike = async (userId, recipeId) => {
	const decryptedUserId = decryptId(userId)[0];
	const decryptedRecipeId = decryptId(recipeId)[0];

	const recipes = await usersLikes.findAll({
		limit: 1,
		where: {
			recipeId: decryptedRecipeId,
			userId: decryptedUserId,
		},
	});

	return !!recipes.length;
};
