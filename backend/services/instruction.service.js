const { instructions } = require("../models/index");
const { CustomError } = require("../middleware/utilities");

exports.addInstructionToRecipe = (instruction, recipeId) => {
	if (!instruction.description || !instruction.step)
		throw new CustomError("Instructions should contain description and step", 400);

	return instructions.create({
		description: instruction.description,
		step: instruction.step,
		recipeId: recipeId,
	})
		.then(res => {
			console.log("Added instruction ", instruction, " to recipe with id ", recipeId);
			return res.get();
		})
		.catch(err => {
			console.error(err);
			throw new CustomError("Error while adding instruction to recipe", 500);
		})
};
