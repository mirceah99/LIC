import Card from "./UI/Card";
import Button from "./UI/Button";
import classes from "./CreateMeal.module.css";
import Input from "./UI/Input";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import UploadPicture from "./UI/UploadPicture";
import Modal from "./UI/Modal";
import Steps from "./Steps";
import IngredientsSearch from "./IngredientsSearch";
import MiniIngredientDisplay from "./MiniIngredientDisplay";
import IngredientQuantity from "./IngredientQuantity";
import useHttp from "../hooks/use-http";

const CreateMeal = () => {
	const hoursOptions = [];
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [prepTime, setPrepTime] = useState({ hours: 0, minutes: 0 });
	const [cookingTime, setCookingTime] = useState({ hours: 0, minutes: 0 });
	const [prepHourSize, setPrepHourSize] = useState(1);
	const [prepMinuteSize, setPrepMinuteSize] = useState(1);
	const [servingSize, setServingSize] = useState(1);
	const [nrOfServings, setNrOfServings] = useState(0);
	const [cookingHourSize, setCookingHourSize] = useState(1);
	const [cookingMinuteSize, setCookingMinuteSize] = useState(1);
	const [uploadPicture, setUploadPicture] = useState(false);
	const [uploadedPicture, setUploadedPicture] = useState(null);
	const [steps, setSteps] = useState({});
	const [foundIngredients, setFoundIngredients] = useState(null);
	const [addedIngredients, setAddedIngredients] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	const { sendRequest, status } = useHttp();

	const tags = [
		{ label: "High Protein" },
		{ label: "Low Carbs" },
		{ label: "0 Sugar" },
		{ label: "Sweet" },
		{ label: "Quick food" },
		{ label: "3 ingredients" },
	];

	for (let i = 0; i <= 12; i++) {
		hoursOptions.push(
			<option key={i} value={i}>
				{i}
			</option>
		);
	}
	const minOptions = [];
	for (let i = 0; i <= 60; i++) {
		minOptions.push(
			<option key={i} value={i}>
				{i}
			</option>
		);
	}
	function addNewAddedIngredient(newIngredient) {
		for (let ingredient of addedIngredients) {
			if (newIngredient.id === ingredient.id) return;
		}
		setAddedIngredients((prevState) => {
			const newState = [...prevState];
			newState.push(newIngredient);
			return newState;
		});
	}
	const saveMeal = async () => {
		const ingredientsWithUnit = [];
		addedIngredients.forEach((ingredient) => {
			ingredientsWithUnit.push({ ...ingredient, unitOfMeasurement: "100g" });
		});
		const data = {
			name,
			description,
			prepTime: +prepTime.minutes + +prepTime.hours * 60,
			cookingTime: +cookingTime.minutes + +cookingTime.hours * 60,
			servingSize: nrOfServings,
			ingredients: ingredientsWithUnit,
			instructions: steps.values,
			tags: selectedTags,
		};

		let blobImage = await fetch(uploadedPicture);
		blobImage = await blobImage.blob();
		const formData = new FormData();
		formData.append("recipePicture", blobImage);

		formData.append("data", JSON.stringify(data));

		const requestConfig = {
			path: `/recipes/`,
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data;",
			},
			body: formData,
		};
		sendRequest(requestConfig, (response) => {
			console.log(response);
		});
		console.log(data);
	};
	return (
		<Card>
			<div className={classes["create-meal"]}>
				<h2>New meal</h2>
				<Input
					onChange={(event) => {
						setName(event.target.value);
					}}
					placeholder="Name"
				/>
				<h3>{"Description:"}</h3>

				<textarea
					className={classes["text-area"]}
					placeholder="Here you need to add the description about your meal. Nice and easy."
					onChange={(event) => {
						setDescription(event.target.value);
					}}
				></textarea>
				<div className={classes.duration}>
					<h3>Prep time:</h3>
					<select
						size={prepHourSize}
						className={classes["duration-select"]}
						name="hours"
						onFocus={() => {
							setPrepHourSize(4);
						}}
						onBlur={() => {
							setPrepHourSize(1);
						}}
						onChange={(event) => {
							setPrepHourSize(1);
							event.target.blur();
							setPrepTime((prevState) => {
								const newStare = { ...prevState };
								newStare.hours = event.target.value;
								return newStare;
							});
						}}
					>
						{hoursOptions}
					</select>
					<p>hours</p>
					<select
						size={prepMinuteSize}
						className={classes["duration-select"]}
						name="minutes"
						onFocus={() => {
							setPrepMinuteSize(4);
						}}
						onBlur={() => {
							setPrepMinuteSize(1);
						}}
						onChange={(event) => {
							event.target.blur();
							setPrepMinuteSize(1);
							setPrepTime((prevState) => {
								const newStare = { ...prevState };
								newStare.minutes = event.target.value;
								return newStare;
							});
						}}
					>
						{minOptions}
					</select>
					<p>min</p>
				</div>
				<div className={classes.duration}>
					<h3>Cooking time:</h3>
					<select
						size={cookingHourSize}
						className={classes["duration-select"]}
						name="hours"
						onFocus={() => {
							setCookingHourSize(4);
						}}
						onBlur={() => {
							setCookingHourSize(1);
						}}
						onChange={(event) => {
							setCookingHourSize(1);
							event.target.blur();
							setCookingTime((prevState) => {
								const newStare = { ...prevState };
								newStare.hours = event.target.value;
								return newStare;
							});
						}}
					>
						{hoursOptions}
					</select>
					<p>hours</p>
					<select
						size={cookingMinuteSize}
						className={classes["duration-select"]}
						name="minutes"
						onFocus={() => {
							setCookingMinuteSize(4);
						}}
						onBlur={() => {
							setCookingMinuteSize(1);
						}}
						onChange={(event) => {
							event.target.blur();
							setCookingMinuteSize(1);
							setCookingTime((prevState) => {
								const newStare = { ...prevState };
								newStare.minutes = event.target.value;
								return newStare;
							});
						}}
					>
						{minOptions}
					</select>
					<p>min</p>
				</div>
				<div className={classes.servings}>
					<h3>Nr. of servings:</h3>
					<select
						size={servingSize}
						className={classes["duration-select"]}
						name="minutes"
						onFocus={() => {
							setServingSize(4);
						}}
						onBlur={() => {
							setServingSize(1);
						}}
						onChange={(event) => {
							event.target.blur();
							setServingSize(1);
							setNrOfServings(event.target.value);
						}}
					>
						{hoursOptions}
					</select>
				</div>
				<div className={classes["tags-div"]}>
					<Autocomplete
						multiple
						disablePortal
						options={tags}
						renderInput={(params) => <TextField {...params} label="Tags" />}
						sx={{ width: 1 }}
						isOptionEqualToValue={(option, value) =>
							option.label === value.label
						}
						onChange={(event, newValue) => {
							setSelectedTags(
								newValue.reduce((newTags, tag) => {
									newTags.push(tag.label);
									return newTags;
								}, [])
							);
							return newValue;
						}}
					/>
				</div>
				<div className={classes["picture-zone"]}>
					{uploadedPicture && (
						<img
							className={classes["meal-picture"]}
							src={uploadedPicture}
							alt="meal"
						></img>
					)}
					<Button
						key="upload picture"
						type="button"
						onClick={() => {
							setUploadPicture(true);
						}}
					>
						{uploadedPicture ? "Change Picture" : "Upload Picture"}
					</Button>
					{uploadPicture && (
						<Modal>
							<UploadPicture
								onCancel={() => {
									setUploadPicture(false);
								}}
								changeImage={(img) => {
									setUploadedPicture(img);
								}}
							/>
						</Modal>
					)}
				</div>
				<div>
					<h3>Instructions:</h3>
					<Steps onChange={setSteps}></Steps>
				</div>
				<div>
					<h3>Ingredients:</h3>
					<IngredientsSearch
						onIngredientsFetched={(response) => {
							setFoundIngredients(response.data);
						}}
					></IngredientsSearch>
				</div>
				<div className={classes.ingredients}>
					{foundIngredients &&
						foundIngredients.map((ingredient) => {
							return (
								<MiniIngredientDisplay
									onAdd={addNewAddedIngredient}
									data={ingredient}
									key={ingredient.id}
								/>
							);
						})}
					{foundIngredients && foundIngredients.length === 0 && (
						<p>No ingredient found 😔</p>
					)}
				</div>
				<div>
					<h3>Added ingredients:</h3>
					{addedIngredients?.length === 0 && (
						<p>please search and add an ingredient</p>
					)}
					{addedIngredients?.length > 0 &&
						addedIngredients.map((ingredient) => {
							return (
								<IngredientQuantity
									onChangeInput={(id, text) => {
										setAddedIngredients((prevState) => {
											const newState = [...prevState];
											for (let ingredient of newState) {
												if (ingredient.id === id) {
													ingredient.quantity = text;
													return newState;
												}
											}
											return newState;
										});
									}}
									key={ingredient.id}
									title={ingredient.name}
									id={ingredient.id}
								/>
							);
						})}
				</div>
				<div className={classes.save}>
					<Button onClick={saveMeal}>Save</Button>
				</div>
			</div>
		</Card>
	);
};
export default CreateMeal;
