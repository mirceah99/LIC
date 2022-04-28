import classes from "./IngredientQuantity.module.css";
import Input from "./UI/Input";
const IngredientQuantity = (props) => {
	return (
		<div className={classes.wrapper}>
			<p>{props.title}</p>
			<Input
				onChange={(event) => {
					props.onChangeInput(props.id, event.target.value);
				}}
				placeholder="100 grams"
				className={classes["quantity-input"]}
			/>
		</div>
	);
};
export default IngredientQuantity;
