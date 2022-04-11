const { micros } = require("../models/index");

exports.addMicro = async (micro) => {
	return await micros.create({
		sodium: micro?.sodium,
		potassium: micro?.potassium,
		vitaminA: micro?.vitaminA,
		vitaminC: micro?.vitaminC,
		calcium: micro?.calcium,
		iron: micro?.iron,
	});
};

exports.getMicro = async (id) => {
	const micro = (await micros.findByPk(id)).dataValues;
	return {
		sodium: micro.sodium,
		potassium: micro.potassium,
		vitaminA: micro.vitaminA,
		vitaminC: micro.vitaminC,
		calcium: micro.calcium,
		iron: micro.iron,
	};
};

exports.updateMicro = async (id, newMicro) => {
	const micro = (await micros.findByPk(id)).dataValues;
	await micros.update(
		{
			sodium: newMicro.sodium || micro.sodium,
			potassium: newMicro.potassium || micro.potassium,
			vitaminA: newMicro.vitaminA || micro.vitaminA,
			vitaminC: newMicro.vitaminC || micro.vitaminC,
			calcium: newMicro.calcium || micro.calcium,
			iron: newMicro.iron || micro.iron,
		},
		{
			where: { id: id },
		}
	);
};
