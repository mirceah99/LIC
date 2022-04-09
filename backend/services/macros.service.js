const { macros } = require('../models/index');

exports.addMacro = async (macro) => {
	return await macros.create({
		protein: macro.protein,
		carbs: macro.carbs,
		fat: macro.fat,
		fiber: macro?.fiber,
		sugar: macro?.sugar,
		saturated: macro?.saturated,
		polyunsaturated: macro?.polyunsaturated,
		monounsaturated: macro?.monounsaturated,
		trans: macro?.trans,
	});
};

exports.getMacro = async (id) => {
	const macro = (await macros.findByPk(id)).dataValues;
	return {
		protein: macro.protein,
		carbs: macro.carbs,
		fat: macro.fat,
		fiber: macro.fiber,
		sugar: macro.sugar,
		saturated: macro.saturated,
		polyunsaturated: macro.polyunsaturated,
		monounsaturated: macro.monounsaturated,
		trans: macro.trans,
	};
};
