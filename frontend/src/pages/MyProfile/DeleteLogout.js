import classes from "./DeleteLogout.module.css";
import Button from "../../components/UI/Button";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import Input from "../../components/UI/Input";

const DeleteLogout = (props) => {
	const authCtx = useContext(AuthContext);
	const [showDeleteForm, setDeleteForm] = useState(false);
	const [checkText, setCheckText] = useState("");
	const verificationMessage = `I want to delete ${props.username}`;
	const disableButton = checkText !== verificationMessage;

	const onLogoutHandler = () => {
		authCtx.logout();
	};
	const onDeleteOpenFrom = () => {
		setDeleteForm(true);
	};
	const onDeleteHandler = () => {
		alert("Not implemented yet TBD");
	};
	const onCancelHandler = () => {
		setDeleteForm(false);
		setCheckText("");
	};
	const deleteForm = (
		<div className={classes["delete-form"]}>
			<p>
				This operation is <span>permanently</span> and <span>irreversible</span>
				, please type: "{verificationMessage}"
			</p>
			<Input onChange={(event) => setCheckText(event.target.value)} />
			<div
				className={`${classes["delete-logout-div"]} ${classes["delete-form-buttons"]}`}
			>
				<Button
					onClick={onDeleteHandler}
					className={classes["red-button"]}
					disabled={disableButton}
				>
					Delete
				</Button>
				<Button onClick={onCancelHandler}>Cancel</Button>
			</div>
		</div>
	);
	return (
		<>
			<div className={classes["delete-logout-div"]}>
				<Button className={classes["red-button"]} onClick={onDeleteOpenFrom}>
					Delete Account
				</Button>
				<Button className={classes["red-button"]} onClick={onLogoutHandler}>
					Logout
				</Button>
			</div>
			{showDeleteForm && deleteForm}
		</>
	);
};
export default DeleteLogout;
