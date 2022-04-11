const { macros } = require("../models/index");

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

exports.updateMacro = async (id, newMacro) => {
	const macro = (await macros.findByPk(id)).dataValues;
	await macros.update(
		{
			protein: newMacro.link || macro.link,
			carbs: newMacro.name || macro.name,
			fat: newMacro.fat || macro.fat,
			fiber: newMacro.fiber || macro.fiber,
			sugar: newMacro.sugar || macro.sugar,
			saturated: newMacro.saturated || macro.saturated,
			polyunsaturated: newMacro.polyunsaturated || macro.polyunsaturated,
			monounsaturated: newMacro.monounsaturated || macro.monounsaturated,
			trans: newMacro.trans || macro.trans,
		},
		{
			where: { id: id },
		}
	);
};
