import Card from "./UI/Card";
import Carousel from "./UI/Carousel";
import classes from "./Meal.module.css";
import { useNavigate } from "react-router-dom";
import HorizontalLine from "./UI/HorizontalLine";
import { useEffect, useState } from "react";
import useHttp from "../hooks/use-http";
import LoadingDots from "./LoadingDots";
const Meal = (props) => {
	const { sendRequest } = useHttp();
	const [meal, setMeal] = useState("loading");
	const navigation = useNavigate();

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
					<span> 🥩 {meal.total.protein}g Protein </span>
					<span> 🥑 {meal.total.carbs}g Fat </span>
					<span> 🍞 {meal.total.fat}g Carbs </span>
					<span> 🔥 {meal.total.calories} Cal </span>
					{/* <span> 💵 20 Ron </span> */}
					<span> ⏱ {meal.prepTime + meal.cookingTime} Min </span>
					{/* <span> ❤️ 58</span> */}
					<span className={classes.more} onClick={goToRecipe}>
						MORE
					</span>
				</div>
			</div>
		</Card>
	);
};
export default Meal;
