import Card from "./UI/Card";
import Carousel from "./UI/Carousel";
import classes from "./Meal.module.css";
import Img1 from "../assets/demo-img/meal-1.jpg";
import Img2 from "../assets/demo-img/meal-2.jpg";
import Img3 from "../assets/demo-img/meal-3.jpg";
import HorizontalLine from "./UI/HorizontalLine";
const Meal = (props) => {
	return (
		<Card>
			<div className={classes["meals-wrapper"]}>
				<div className={classes.title}>
					<h3>Green chicken with black and red tomatoes + infinite rice </h3>
				</div>
				<div className={classes.square}>
					<div className={classes.content}>
						<Carousel>
							<img src={Img1} />
							<img src={Img2} />
							<img src={Img3} />
						</Carousel>
					</div>
				</div>
				<HorizontalLine />
				<div className={classes.stats}>
					<span> 🥩 46g Protein </span>
					<span> 🥑 16g Fat </span>
					<span> 🍞 27g Carbs </span>
					<span> 🔥 680g Cal </span>
					<span> 💵 20 Ron </span>
					<span> ⏱ 15 Min </span>
					<span> ❤️ 58</span>
					<span className={classes.more}> MORE </span>
				</div>
			</div>
		</Card>
	);
};
export default Meal;
