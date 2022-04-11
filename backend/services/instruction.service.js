const { instructions } = require("../models/index");
const { decryptId, CustomError } = require("../middleware/utilities");

exports.addInstructionToRecipe = async (instruction, encryptedRecipeId) => {
	if (!instruction.description || !instruction.step)
		throw new CustomError("Instruction is invalid", 400);
	const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
	return await instructions.create({
		description: instruction.description,
		step: instruction.step,
		recipeId: decryptedRecipeId,
	});
};
