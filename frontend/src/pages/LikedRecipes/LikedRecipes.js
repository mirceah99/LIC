import { useEffect, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import Meal from "../../components/Meal";

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
		return <div>You should login to be able to see like recipes!</div>;
	}
	if (recipes.length === 0) {
		return <div>No liked recipes:((!</div>;
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
