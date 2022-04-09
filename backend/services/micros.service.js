const { micros } = require('../models/index');

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
