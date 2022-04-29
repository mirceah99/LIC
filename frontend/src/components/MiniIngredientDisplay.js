import classes from "./MiniIngredientDisplay.module.css";
import Button from "./UI/Button";
const MiniIngredientDisplay = (props) => {
	return (
		<div className={classes["parent-div"]}>
			<h2>{props.data.name}</h2>
			<div className={classes["wrapper-div"]}>
				<img alt="ingredient" src={props.data.image}></img>
				<div>
					<p>{`Protein 🥩 ${props.data.macro.protein}`}</p>
					<p>{`Fat 🥑 ${props.data.macro.fat}`}</p>
					<p>{`Carbo 🍞 ${props.data.macro.carbs}`}</p>
				</div>
				<Button
					onClick={props.onAdd.bind(null, {
						id: props.data.id,
						name: props.data.name,
					})}
					className={classes["add-button"]}
				>
					Add
				</Button>
			</div>
		</div>
	);
};
export default MiniIngredientDisplay;
