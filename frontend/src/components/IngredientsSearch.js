import { Button } from "@mui/material";
import { useState } from "react";
import classes from "./IngredientsSearch.module.css";
import LoadingDots from "./LoadingDots";
import Input from "./UI/Input";
import useHttp from "../hooks/use-http";

const IngredientsSearch = (props) => {
	const [search, setSearch] = useState("");
	const { sendRequest, isLoading } = useHttp();

	function fetchIngredients(event) {
		event.preventDefault();
		const requestConfig = {
			path: `/ingredients/query`,
			method: "POST",
			headers: {},
			body: {
				query: {
					name: search,
				},
			},
		};

		sendRequest(requestConfig, (data) => {
			console.log(data);
			props.onIngredientsFetched(data);
		});
	}

	return (
		<div>
			<form onSubmit={fetchIngredients}>
				<Input
					onChange={(event) => {
						setSearch(event.target.value);
					}}
					placeholder="Search"
				></Input>
				<Button type="submit" hidden></Button>
				{isLoading && <LoadingDots />}
			</form>
		</div>
	);
};
export default IngredientsSearch;
