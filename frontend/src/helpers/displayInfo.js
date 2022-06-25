const defaultSettings = {
	protein: true,
	fat: true,
	carbs: true,
	time: true,
	calories: true,
	price: false,
	sodium: false,
	potassium: false,
	vitaminC: false,
	vitaminA: false,
	calcium: false,
	iron: false,
	likes: false,
};

function getDisplayInfo() {
	if (localStorage.getItem("displayInfo") !== null) {
		return JSON.parse(localStorage.getItem("displayInfo"));
	} else {
		setDisplayInfo(defaultSettings);
		return defaultSettings;
	}
}
function setDisplayInfo(displayInfo) {
	localStorage.setItem("displayInfo", JSON.stringify(displayInfo));
}
function getDefault() {
	return defaultSettings;
}
function getAllFalse() {
	const allFalse = { ...defaultSettings };
	for (const prop in allFalse) {
		allFalse[prop] = false;
	}
	return allFalse;
}
const displayInfo = { getDisplayInfo, setDisplayInfo, getDefault, getAllFalse };
export default displayInfo;
