import Card from "./Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classes from "./Filter.module.css";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import Button from "./Button";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Input from "./Input";
import useHttp from "../../hooks/use-http";
import Meal from "../Meal";
import displayInfoHelper from "../../helpers/displayInfo";
const Filter = (props) => {
	const range = { min: 0, max: 120 };
	const [protein, setProtein] = useState([range.min, range.max]);
	const [fat, setFat] = useState([range.min, range.max]);
	const [carbo, setCarbo] = useState([range.min, range.max]);
	const [calories, setCalories] = useState([0, 1000]);
	const [price, setPrice] = useState([0, 200]);
	const [time, setTime] = useState([0, 360]);
	const [sodium, setSodium] = useState([0, 60]);
	const [potassium, setPotassium] = useState([0, 60]);
	const [vitaminA, setVitaminA] = useState([0, 60]);
	const [vitaminC, setVitaminC] = useState([0, 60]);
	const [calcium, setCalcium] = useState([0, 60]);
	const [iron, setIron] = useState([0, 60]);
	const [orderBy, setOrderBy] = useState("");
	const [searchName, setSearchName] = useState("");
	const [foundRecipes, setFoundRecipes] = useState(null);
	const [displayInfo, steDisplayInfo] = useState(
		displayInfoHelper.getDisplayInfo()
	);
	const { sendRequest } = useHttp();
	const clearAllHandler = () => {
		setProtein([range.min, range.max]);
		setFat([range.min, range.max]);
		setCarbo([range.min, range.max]);
		setCalories([0, 1000]);
		setPrice([0, 200]);
		setTime([0, 360]);
		setSodium([0, 60]);
		setPotassium([0, 60]);
		setVitaminA([0, 60]);
		setVitaminC([0, 60]);
		setCalcium([0, 60]);
		setIron([0, 60]);
		setOrderBy("");
		setSearchName("");
		steDisplayInfo(displayInfoHelper.getAllFalse());
	};
	function fetchIngredients() {
		console.log("orderBy", orderBy);
		let order = null;
		switch (orderBy) {
			case "Protein":
				order = [["totalProtein", "DESC"]];
				break;
			case "Date":
				// order = [["date", "DESC"]]; //NOT IMPLEMENTED YET TODO
				break;
			case "Calories":
				order = [["totalCalories", "ASC"]];
				break;
			case "Likes":
				order = [["likes", "DESC"]];
				break;
			default:
				break;
		}

		// set display info
		displayInfoHelper.setDisplayInfo(displayInfo);
		const requestConfig = {
			path: `/recipes/search`,
			method: "POST",
			headers: {},
			body: {
				filter: {
					name: searchName,
					cookingTime: {
						start: time[0],
						end: time[1],
					},
					calories: {
						start: calories[0],
						end: calories[1],
					},
					protein: {
						start: protein[0],
						end: protein[1],
					},
					carbs: {
						start: carbo[0],
						end: carbo[1],
					},
					fat: {
						start: fat[0],
						end: fat[1],
					},
					// author: "Mircea",
					// anyOfTags: ["SWEET", "QUICK FOOD"],
					// allOfTags: ["SWEET", "QUICK FOOD"],
				},
				order: order ? order : undefined,
			},
		};

		sendRequest(requestConfig, (response) => setFoundRecipes(response.data));
	}

	const sx = {
		"& .MuiSlider-thumb": {
			color: "#03d099",
		},
		"& .MuiSlider-track": {
			color: "#03d099",
		},
		"& .MuiSlider-rail": {
			color: "#6abda6",
		},
	};
	return (
		<>
			<Card>
				<div className={classes["container-div"]}>
					<div className={classes.input}>
						<Input
							style={{ flexGrow: 1.1 }}
							value={searchName}
							onChange={(event) => {
								setSearchName(event.target.value);
							}}
							placeholder="key words"
						></Input>
					</div>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Macros</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<p>{`Protein 🥩: ${protein[0]}g - ${protein[1]}g`}</p>
							<Slider
								onChange={(e, data) => {
									setProtein(data);
								}}
								valueLabelDisplay="auto"
								value={protein}
								min={range.min}
								max={range.max}
								sx={sx}
							/>
							<p>{`Fat 🥑: ${fat[0]}g - ${fat[1]}g`}</p>
							<Slider
								onChange={(e, data) => {
									setFat(data);
								}}
								valueLabelDisplay="auto"
								value={fat}
								min={range.min}
								max={range.max}
								sx={sx}
							/>
							<p>{`Carbo 🍞: ${carbo[0]}g - ${carbo[1]}g`}</p>
							<Slider
								onChange={(e, data) => {
									setCarbo(data);
								}}
								valueLabelDisplay="auto"
								value={carbo}
								min={range.min}
								max={range.max}
								sx={sx}
							/>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography>{"Calorie & price & time"}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								<p>{`Calories 🔥: ${calories[0]}cal - ${calories[1]}cal`}</p>
								<Slider
									onChange={(e, data) => {
										setCalories(data);
									}}
									valueLabelDisplay="auto"
									value={calories}
									min={0}
									max={1000}
									sx={sx}
								/>
								<p>{`Price 💵: ${price[0]}ron - ${price[1]}ron`}</p>
								<Slider
									onChange={(e, data) => {
										setPrice(data);
									}}
									valueLabelDisplay="auto"
									value={price}
									min={0}
									max={200}
									sx={sx}
								/>
								<p>{`Time ⏱: ${time[0]}min - ${time[1]}min`}</p>
								<Slider
									onChange={(e, data) => {
										setTime(data);
									}}
									valueLabelDisplay="auto"
									value={time}
									min={range.min}
									max={360}
									sx={sx}
								/>
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2a-content"
							id="panel2a-header"
						>
							<Typography>Micros</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								<p>{`Sodium 🧂: ${sodium[0]}g - ${sodium[1]}g`}</p>
								<Slider
									onChange={(e, data) => {
										setSodium(data);
									}}
									valueLabelDisplay="auto"
									value={sodium}
									min={0}
									max={60}
									sx={sx}
								/>
								<p>{`Potassium 🍌: ${potassium[0]}g - ${potassium[1]}g`}</p>
								<Slider
									onChange={(e, data) => {
										setPotassium(data);
									}}
									valueLabelDisplay="auto"
									value={potassium}
									min={0}
									max={60}
									sx={sx}
								/>
								<p>{`VitaminA 🥕: ${vitaminA[0]}g - ${vitaminA[1]}g`}</p>
								<Slider
									onChange={(e, data) => {
										setVitaminA(data);
									}}
									valueLabelDisplay="auto"
									value={vitaminA}
									min={range.min}
									max={60}
									sx={sx}
								/>
								<p>{`VitaminC 🍊: ${vitaminC[0]}g - ${vitaminC[1]}g`}</p>
								<Slider
									onChange={(e, data) => {
										setVitaminC(data);
									}}
									valueLabelDisplay="auto"
									value={vitaminC}
									min={range.min}
									max={60}
									sx={sx}
								/>
								<p>{`Calcium 🥛: ${calcium[0]}g - ${calcium[1]}g`}</p>
								<Slider
									onChange={(e, data) => {
										setCalcium(data);
									}}
									valueLabelDisplay="auto"
									value={calcium}
									min={range.min}
									max={60}
									sx={sx}
								/>
								<p>{`Iron ⚓: ${iron[0]}g - ${iron[1]}g`}</p>
								<Slider
									onChange={(e, data) => {
										setIron(data);
									}}
									valueLabelDisplay="auto"
									value={iron}
									min={range.min}
									max={60}
									sx={sx}
								/>
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>Display info </Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className={classes["display-info"]}>
								<div>
									<p>{`Protein 🥩`}</p>{" "}
									<Checkbox
										checked={displayInfo.protein}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.protein = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Fat 🥑`}</p>
									<Checkbox
										checked={displayInfo.fat}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.fat = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Carbs 🍞`}</p>
									<Checkbox
										checked={displayInfo.carbs}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.carbs = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Calories 🔥`}</p>
									<Checkbox
										checked={displayInfo.calories}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.calories = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Price 💵:`}</p>
									<Checkbox
										checked={displayInfo.price}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.price = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Time ⏱`}</p>
									<Checkbox
										checked={displayInfo.time}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.time = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Sodium 🧂`}</p>
									<Checkbox
										checked={displayInfo.sodium}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.sodium = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Potassium 🍌`}</p>
									<Checkbox
										checked={displayInfo.potassium}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.potassium = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`VitaminA 🥕`}</p>
									<Checkbox
										checked={displayInfo.vitaminA}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.vitaminA = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`VitaminC 🍊`}</p>
									<Checkbox
										checked={displayInfo.vitaminC}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.vitaminC = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Calcium 🥛`}</p>
									<Checkbox
										checked={displayInfo.calcium}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.calcium = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Iron ⚓`}</p>
									<Checkbox
										checked={displayInfo.iron}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.iron = checked;
												return newState;
											});
										}}
									/>
								</div>
								<div>
									<p>{`Likes ❤️`}</p>
									<Checkbox
										checked={displayInfo.like}
										onChange={(event, checked) => {
											steDisplayInfo((prevState) => {
												const newState = { ...prevState };
												newState.like = checked;
												return newState;
											});
										}}
									/>
								</div>
							</div>
						</AccordionDetails>
					</Accordion>
					<div style={{ height: "10px" }}></div>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Order by </InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={orderBy}
							label="Order by"
							onChange={(event) => {
								setOrderBy(event.target.value);
							}}
						>
							{/* <MenuItem value={"Price"}>Price</MenuItem> NOT READY YET  */}
							<MenuItem value={"Date"}>Date</MenuItem>
							<MenuItem value={"Likes"}>Likes</MenuItem>
							<MenuItem value={"Calories"}>Calories</MenuItem>
							<MenuItem value={"Protein"}>Protein</MenuItem>
						</Select>
					</FormControl>
					<div className={classes["buttons-container"]}>
						<Button onClick={clearAllHandler}>Clear All</Button>
						<Button onClick={fetchIngredients}>Apply </Button>
					</div>
				</div>
			</Card>
			{foundRecipes &&
				foundRecipes.length > 0 &&
				foundRecipes.map((recipe, index) => (
					<Meal key={recipe} link={recipe} />
				))}
			{foundRecipes && foundRecipes.length === 0 && <p>No recipe found :(</p>}
		</>
	);
};
export default Filter;
