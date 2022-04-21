import Card from "./UI/Card";
import classes from "./CreateIngredient.module.css";
import Input from "./UI/Input";
import HorizontalLine from "./UI/HorizontalLine";
import Button from "./UI/Button";
import UploadPicture from "./UI/UploadPicture";
import React, { useState, useRef } from "react";
import Modal from "./UI/Modal";
import useHttp from "../hooks/use-http";
import SuccessAnimation from "./UI/SuccessAnimation";

const CreateIngredient = () => {
	const ingredientAttributes = {
		macros: [
			"protein",
			"carbs",
			"fat",
			"fiber",
			"sugar",
			"saturated",
			"polyunsaturated",
			"monounsaturated",
			"trans",
		],
		micros: ["sodium", "potassium", "vitaminA", "vitaminC", "calcium", "iron"],
	};
	const otherMeasureUnits = {
		sodium: "mg/100g",
		potassium: "mg/100g",
		vitaminA: "µg/100g",
	};
	const maxLength = 6;
	const allowJustNumbers = (event) => {
		const isNUmber =
			(event.charCode >= 48 && event.charCode <= 57) || event.charCode === 46;
		if (!isNUmber) event.preventDefault();
	};
	const measureUnit = "grams/100g";
	const [ingredientData, setIngredientData] = useState({});
	const [ingredientName, setIngredientName] = useState("");
	const [uploadedPicture, setUploadedPicture] = useState(null);
	const [uploadPicture, setUploadPicture] = useState(false);
	const { sendRequest, status } = useHttp();
	const nameInputElement = useRef();
	const [success, setSuccess] = useState(false);

	const showSuccessAnimation = (response) => {
		if (
			response.message.includes("success") ||
			response.message.includes("Success")
		) {
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
		}
	};

	// her i need to implement it better i think
	const ingredientInputs = [];

	for (const key in ingredientAttributes) {
		ingredientInputs.push(<h2 key={key}>{key}</h2>);
		ingredientAttributes[key].forEach((attribute, index) => {
			ingredientInputs.push(
				<React.Fragment key={attribute}>
					<Input
						required
						maxLength={maxLength}
						placeholder={attribute}
						onKeyPress={allowJustNumbers}
						onChange={(event) => {
							setIngredientData((oldState) => {
								const copyIngredientData = {};
								Object.assign(copyIngredientData, oldState);
								if (copyIngredientData[key] === undefined)
									copyIngredientData[key] = {};
								copyIngredientData[key][attribute] = event.target.value;
								return copyIngredientData;
							});
						}}
					/>
					<p>
						{otherMeasureUnits[attribute]
							? otherMeasureUnits[attribute]
							: measureUnit}
					</p>
				</React.Fragment>
			);
		});
		ingredientInputs.push(<HorizontalLine key={key + "-line"} />);
	}

	const saveIngredientHandler = async (event) => {
		event.preventDefault();
		let blobImage = await fetch(uploadedPicture);
		blobImage = await blobImage.blob();
		const formData = new FormData();
		formData.append("ingredientPicture", blobImage);
		const body = ingredientData;
		body.name = ingredientName;
		formData.append("data", JSON.stringify(ingredientData));

		const requestConfig = {
			path: `/ingredients/`,
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data;",
			},
			body: formData,
		};
		sendRequest(
			requestConfig,
			(response) => {
				if (response.status === 200) {
					showSuccessAnimation(response);
				}
			},
			(response) => {
				if (response.status === 409) {
					nameInputElement.current.focus();
				} else {
					alert(" we had some problems :(");
				}
			}
		);
	};

	return (
		<>
			<Card>
				<h2 className={classes.title}>New ingredient</h2>
				<form onSubmit={saveIngredientHandler}>
					<div className={classes["input-container"]}>
						<Input
							required
							maxLength={255}
							placeholder="Name"
							ref={nameInputElement}
							onChange={(event) => {
								setIngredientName(event.target.value);
							}}
						/>
						{status === 409 && (
							<p className={classes.error}>
								Name already used, please insert other name.
							</p>
						)}
						{ingredientInputs}

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
						<HorizontalLine key="last line" />
						<div className={classes.center}>
							<Button key="submit button" type="submit">
								Save ingredient
							</Button>
						</div>
					</div>
				</form>
			</Card>
			{success && <SuccessAnimation />}
		</>
	);
};
export default CreateIngredient;
