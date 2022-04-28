import { useState } from "react";
import classes from "./Steps.module.css";
let realSteps = {}; //TODO CHANGE THIS STRANGE THING
const Step = (props) => {
	const [steps, setSteps] = useState(() => {
		return {
			values: [""],
			ui: [
				<div key={1} className={classes.steps}>
					<p>Step 1:</p>
					<textarea
						placeholder="Describe the steps here. ENTER = new step"
						onKeyDown={(event) => {
							if (event.key === "Enter" && realSteps.ui.length === 1) {
								event.preventDefault();
								createNewStep();
							}
						}}
						className={classes["text-area"]}
						onChange={(event) => {
							setSteps((prevState) => {
								const newState = {
									values: [...prevState.values],
									ui: [...prevState.ui],
								};
								newState.values[0] = event.target.value;
								props.onChange && props.onChange(newState);
								return newState;
							});
						}}
					></textarea>
				</div>,
			],
		};
	});
	realSteps = steps;
	function createNewStep() {
		setSteps((prevState) => {
			const newState = { values: [...prevState.values], ui: [...prevState.ui] };
			const myIndex = newState.ui.length + 1;
			newState.ui.push(
				<div key={newState.ui.length + 1} className={classes.steps}>
					<p>{`Step ${newState.ui.length + 1}:`}</p>
					<textarea
						onKeyDown={(event) => {
							if (event.key === "Enter" && myIndex === realSteps.ui.length) {
								event.preventDefault();
								createNewStep();
							}
						}}
						className={classes["text-area"]}
						onChange={(event) => {
							setSteps((prevState) => {
								const newState = {
									values: [...prevState.values],
									ui: [...prevState.ui],
								};
								newState.values[myIndex - 1] = event.target.value;
								props.onChange && props.onChange(newState);
								return newState;
							});
						}}
					></textarea>
				</div>
			);
			return newState;
		});
	}
	return <>{steps.ui}</>;
};
export default Step;
