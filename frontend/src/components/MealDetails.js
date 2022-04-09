import classes from "./MealDetails.module.css";
import Img1 from "../assets/demo-img/meal-1.jpg";
import { Link } from "react-router-dom";
const MealDetails = () => {
	return (
		<div className={classes["meal-details-wrapper"]}>
			{/* nice bg image  */} {/* order button */}
			<div className={classes["image-wrapper"]}>
				<img className={classes.image} src={Img1} />
			</div>
			{/* title */}
			<div className={classes.title}>
				<h3>Green chicken with black and red tomatoes + infinite rice </h3>
			</div>
			{/* some visual info */}
			{/* created by */}
			<p>
				Created by: 👉<Link to="/TBD">mircea99</Link>👈
			</p>
			{/* description */}
			<div className={classes.description}>
				<p>
					Chicken schnitzel is a popular and tasty treat served throughout
					Israel. Schnitzel is Austrian in origin; veal (known as Wiener
					Schnitzel) or pork were the traditional meats of choice. Fried
					schnitzel later found its way to Israel with European Jews.
				</p>
				<p>
					Like many other foods, Jews adapted this regional dish to suit their
					unique dietary kosher laws. Pork (which is treif) and veal (which was
					expensive and difficult to obtain) was replaced by chicken and turkey.
					Fast forward to today, and most restaurants in Israel have some
					version of poultry schnitzel on their menu. Schnitzel is traditionally
					served with fresh lemon juice.
				</p>
				<p>
					Funny enough, the origin of this culinary tradition is less than
					appetizing. Before refrigeration was invented, lemon juice helped mask
					the flavor of meat gone bad. The squeeze of lemon juice stuck, and we
					still serve schnitzel with lemon slices to this day.
				</p>
			</div>
			{/* external links */}
			<p>
				<Link to="/TBD">VIDEO</Link> ▶️
			</p>
			<h4>Macros</h4>
			<p>Protein: 22g</p>
			<p>Carbs: 22g</p>
			<p>Fat: 22g</p>
			<p>Fiber: 22g</p>
			<p>Sugar: 22g</p>
			<p>Saturated: 22g</p>
			<p>Polyunsaturated: 22g</p>
			<p>Mono saturated: 22g</p>
			<p>Trans: 22g</p>
			<h4>Micros</h4>
			<p>Sodium: 223mg</p>
			<p>Potassium: 223mg</p>
			<p>Vitamin A: 223mg</p>
			<p>Vitamin C: 223mg</p>
			<p>Calcium: 223mg</p>
			<p>Iron: 223mg</p>
			<p>Sodium: 223mg</p>
		</div>
	);
};
export default MealDetails;
