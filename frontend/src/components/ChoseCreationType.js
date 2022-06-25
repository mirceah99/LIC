import Card from "./UI/Card";
import classes from "./ChoseCreationType.module.css";
import milkPng from "../assets/img/milk.png";
import mealPng from "../assets/img/meal.png";

import Button from "./UI/Button";
import HorizontalLine from "./UI/HorizontalLine";
import { useNavigate } from "react-router-dom";

const ChoseCreationType = () => {
	const navigation = useNavigate();

	return (
		<Card>
			<div className={classes.add}>
				<div>
					<h2 className={classes.title}>Ingredient</h2>
					<img src={milkPng} className={classes.img} alt="bottle of milk"></img>
					<p>
						An ingredient is a part of a meal. A meal is composed by more
						ingredients e.g: tomatoes, oil, flour, chocolate, cheese etc. All
						ingredients have micros and macros. Summing all these micros and
						macros of the ingredients used in a recipe will result in the meal
						properties. You can use an ingredient for different recipes and a
						meal can contain more ingredients.
					</p>
				</div>
				<Button
					onClick={() => {
						navigation("/create/ingredient");
					}}
				>
					Add ingredient
				</Button>
			</div>
			<HorizontalLine />
			<div className={classes.add}>
				<div>
					<h2 className={classes.title}>Meal</h2>
					<img src={mealPng} className={classes.img} alt="bottle of milk"></img>
					<p>
						A meal is a dish. As we said earlier, a meal is composed of more
						ingredients. Additionally, a meal can have other attributes like
						preparation time, utensils or a recipe creator. If the recipe
						creator wants to make the ingredients private, he can do so. For
						example, a restaurant may want to do this to prevent other
						restaurants from using their recipe.
					</p>
				</div>
				<Button
					onClick={() => {
						navigation("/create/meal");
					}}
				>
					Add meal
				</Button>
			</div>
		</Card>
	);
};
export default ChoseCreationType;
