import { useEffect, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import Meal from "../../components/Meal";
import classes from "./LikedRecipes.module.css";

const LikedRecipes = () => {
	const authCtx = useContext(AuthContext);
	const { sendRequest } = useHttp();
	const [recipes, setRecipes] = useState([]);
	useEffect(() => {
		if (!authCtx.isLoggedIn) return;
		const requestConfig = {
			path: `/recipes/liked/${authCtx.decodeToken.id}`,
			method: "GET",
			headers: {},
		};
		sendRequest(requestConfig, (r) => {
			setRecipes(r.data);
		});
	}, []);
	if (!authCtx.isLoggedIn) {
		return (
			<div className={classes["centered-message"]}>
				You should login to be able to see liked recipes!
			</div>
		);
	}
	if (recipes.length === 0) {
		return <div className={classes["centered-message"]}>0 recipes liked</div>;
	}
	return (
		<div>
			{recipes.map((mealUrl) => (
				<Meal key={mealUrl.slice(-15)} link={mealUrl} />
			))}
		</div>
	);
};
export default LikedRecipes;
