import Card from "./Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classes from "./Filter.module.css";
import Slider from "@mui/material/Slider";
import { useState } from "react";
const Filter = (props) => {
	const range = { min: 0, max: 120 };
	const [protein, setProtein] = useState([range.min, range.max]);
	const [fat, setFat] = useState([range.min, range.max]);
	const [carbo, setCarbo] = useState([range.min, range.max]);
	const [calories, setCalories] = useState([0, 1000]);
	const [price, setPrice] = useState([0, 200]);
	const [time, setTime] = useState([0, 360]);

	return (
		<Card>
			<div className={classes["container-div"]}>
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
							/>
						</Typography>
					</AccordionDetails>
				</Accordion>
			</div>
		</Card>
	);
};
export default Filter;
