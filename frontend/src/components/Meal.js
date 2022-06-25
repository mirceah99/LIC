import Card from "./UI/Card";
import Carousel from "./UI/Carousel";
import classes from "./Meal.module.css";
import { useNavigate } from "react-router-dom";
import HorizontalLine from "./UI/HorizontalLine";
import { useEffect, useState } from "react";
import useHttp from "../hooks/use-http";
import LoadingDots from "./LoadingDots";
import displayInfoHelper from "../helpers/displayInfo";

const Meal = (props) => {
	const { sendRequest } = useHttp();
	const [meal, setMeal] = useState("loading");
	const navigation = useNavigate();
	const displayInfo = displayInfoHelper.getDisplayInfo();

	useEffect(() => {
		const requestConfig = {
			path: props.link,
			method: "GET",
			headers: {},
		};
		sendRequest(requestConfig, (r) => {
			setMeal(r.data);
		});
	}, []);

	function goToRecipe() {
		navigation(`/meal-details/${meal.id}`);
	}

	if (meal === "loading") return <LoadingDots />;

	return (
		<Card>
			<div className={classes["meals-wrapper"]}>
				<div className={classes.title}>
					<h3>{meal.name} </h3>
				</div>
				<div className={classes.square}>
					<div className={classes.content}>
						<Carousel>
							<img src={meal.image} alt="food" />
						</Carousel>
					</div>
				</div>
				<HorizontalLine />
				<div className={classes.stats}>
					{displayInfo.protein && (
						<span> 🥩 {meal.total.protein}g Protein </span>
					)}
					{displayInfo.fat && <span> 🥑 {meal.total.fat}g Fat </span>}
					{displayInfo.carbs && <span> 🍞 {meal.total.carbs}g Carbs </span>}
					{displayInfo.calories && <span> 🔥 {meal.total.calories} Cal </span>}
					{displayInfo.price && <span> 💵 20 Ron </span>}
					{displayInfo.time && (
						<span> ⏱ {meal.prepTime + meal.cookingTime} Min </span>
					)}
					{/*  {displayInfo.calories	 <span> ❤️ 58</span>} */}
					{displayInfo.sodium && <span> 🧂 {meal.total.sodium} Sodium </span>}
					{displayInfo.potassium && (
						<span> 🍌 {meal.total.potassium} Potassium </span>
					)}
					{displayInfo.vitaminA && (
						<span> 🥕 {meal.total.vitaminA} Vitamin A </span>
					)}
					{displayInfo.vitaminC && (
						<span> 🍊 {meal.total.vitaminC} Vitamin C </span>
					)}
					{displayInfo.calcium && (
						<span> 🥛 {meal.total.calcium} Calcium </span>
					)}
					{displayInfo.iron && <span> ⚓{meal.total.iron} Iron </span>}

					<span className={classes.more} onClick={goToRecipe}>
						MORE
					</span>
				</div>
			</div>
		</Card>
	);
};
export default Meal;
