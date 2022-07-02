import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import Meal from "../../components/Meal";
import notFound from "../../assets/img/notFound.png";

const MainPage = () => {
	const { sendRequest } = useHttp();
	const [recipes, setRecipes] = useState([]);
	useEffect(() => {
		const requestConfig = {
			path: `/recipes/search`,
			method: "POST",
			headers: {},
			body: {
				order: [["id", "DESC"]],
				limit: 150,
			},
		};
		sendRequest(requestConfig, (r) => {
			setRecipes(r.data);
		});
	}, []);
	if (recipes.length === 0) {
		return <img className="not-found" src={notFound} alt="no item found"></img>;
	}
	return (
		<div>
			{recipes.map((mealUrl) => (
				<Meal key={mealUrl.slice(-15)} link={mealUrl} />
			))}
		</div>
	);
};
export default MainPage;
