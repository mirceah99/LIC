import classes from "./MealDetails.module.css";
import { Link } from "react-router-dom";
import Button from "./UI/Button";
import { useState, useEffect, useContext } from "react";
import Toast from "./UI/Toast";
import { useParams } from "react-router-dom";
import useHttp from "../hooks/use-http";
import AuthContext from "../store/auth-context";
import LoadingDots from "./LoadingDots";

const MealDetails = () => {
	const { sendRequest, status } = useHttp();
	const [userLiked, setUserLiked] = useState(false);
	const [showToast, setShowToast] = useState({ show: false });
	const [mealData, setMealData] = useState({});
	const authCtx = useContext(AuthContext);
	let params = useParams();

	useEffect(() => {
		const requestConfig = {
			path: `/recipes/${params.id}`,
			method: "GET",
			headers: {},
		};
		sendRequest(requestConfig, (data) => {
			console.log(data);
			setMealData(data.data);
		});
	}, [params.id, sendRequest]);

	useEffect(() => {
		if (!authCtx.isLoggedIn) return;
		const requestConfig = {
			path: `/recipes/user-like/${authCtx.decodeToken.id}/${params.id}`,
			method: "GET",
			headers: {},
		};
		sendRequest(requestConfig, (data) => {
			setUserLiked(data.data);
			console.log(data);
		});
	}, [mealData]);

	function likeUnlike(like = true) {
		const requestConfig = {
			path: `/recipes/like`,
			method: "POST",
			headers: {},
			body: {
				recipeId: params.id,
			},
		};
		if (like) {
			requestConfig.body.toDo = "like";
		} else {
			requestConfig.body.toDo = "unlike";
		}
		sendRequest(requestConfig, (response) => {
			console.log(response);
		});
	}
	if (!mealData.id)
		return (
			<div className={classes.loading}>
				<LoadingDots />
			</div>
		);

	return (
		<div className={classes["meal-details-wrapper"]}>
			{/* nice bg image  */} {/* order button */}
			<div className={classes["image-wrapper"]}>
				<img className={classes.image} src={mealData.image} alt="food" />
			</div>
			{/* title */}
			<div className={classes.title}>
				<h3>{mealData.name} </h3>
			</div>
			<div className={classes["like-wrapper"]}>
				{mealData.creator && (
					<p>
						Created by: 👉<Link to={mealData.creator}>mircea99</Link>👈
					</p>
				)}
				<Button
					className={`${classes["like-button"]} ${
						userLiked ? classes.liked : classes.grey
					}`}
					onClick={() => {
						if (!authCtx.isLoggedIn) {
							setShowToast({
								show: true,
								message: "You must be logged in to like a recipe.",
							});
							setTimeout(() => {
								setShowToast({ show: false });
							}, 3000);
							return;
						}
						if (userLiked) {
							setShowToast({ show: true, message: "You unlike this meal" });
							likeUnlike(false);
							setTimeout(() => {
								setShowToast({ show: false });
							}, 3000);
						} else {
							setShowToast({ show: true, message: "You like this meal" });
							likeUnlike(true);
							setTimeout(() => {
								setShowToast({ show: false });
							}, 3000);
						}
						setUserLiked((prevState) => !prevState);
					}}
				>
					{`${userLiked ? "Liked" : "Like "}`}
				</Button>
			</div>
			{/* description */}
			<div className={classes.description}>
				<p>{mealData.description}</p>
			</div>
			{/* external links */}
			{mealData.video && (
				<p>
					<Link to={mealData.video}>VIDEO</Link> ▶️
				</p>
			)}
			{/* steps */}
			{mealData?.steps.length &&
				mealData.steps.map((step, index) => {
					return (
						<div className={classes.step} key={index}>
							<p>Step {index}:</p>
							<p>{step}</p>
						</div>
					);
				})}
			<h4>Macros:</h4>
			<p>Protein: {mealData.total.protein}g</p>
			<p>Carbs: {mealData.total.carbs}g</p>
			<p>Fat: {mealData.total.fat}g</p>
			<p>Fiber: {mealData.total.fiber}g</p>
			<p>Sugar: {mealData.total.sugar}g</p>
			<p>Saturated: {mealData.total.saturated}g</p>
			<p>Polyunsaturated: {mealData.total.polyunsaturated}g</p>
			<p>Mono saturated: {mealData.total.monounsaturated}g</p>
			<p>Trans: {mealData.total.trans}g</p>
			<h4>Micros:</h4>
			<p>Sodium: {mealData.total.sodium}mg</p>
			<p>Potassium: {mealData.total.potassium}mg</p>
			<p>Vitamin A: {mealData.total.vitaminA}mg</p>
			<p>Vitamin C: {mealData.total.vitaminC}mg</p>
			<p>Calcium: {mealData.total.calcium}mg</p>
			<p>Iron: {mealData.total.iron}mg</p>
			<p>Sodium: {mealData.total.sodium}mg</p>
			{showToast.show && <Toast message={showToast.message}></Toast>}
		</div>
	);
};
export default MealDetails;
