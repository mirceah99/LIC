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
						ingredients eg: tomatoes, oil, flour, chocolate, cheese etc... All
						ingredients has micros and macros. Sum of all of this ingredients
						that compose a meal will result in the meal props. You can use an
						ingredient for mor meals, and a meal can has more ingredients.
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
						A meal is a dish. As we said upper a meal is composed by more
						ingredients. In plus a meal has hew other attributes like: time for
						preparation ustensils or a owner that made this recipe. If the owner
						want can do the ingredients private, for example a restaurant may
						want to do this to prevent other restaurants form stilling their
						recipe.
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
