const { instructions } = require('../models/index');
const { decryptId } = require('../middleware/utilities');

exports.addInstructionToRecipe = async (instruction, encryptedRecipeId) => {
	try {
		if (!instruction.description || !instruction.step) throw Error('Instruction is invalid');
		const decryptedRecipeId = decryptId(encryptedRecipeId)[0];
		return await instructions.create({
			description: instruction.description,
			step: instruction.step,
			recipeId: decryptedRecipeId,
		});
	} catch (e) {
		throw Error(e);
	}
};
