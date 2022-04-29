import { useState } from "react";
import classes from "./Toast.module.css";
const Toast = ({ message, timeout = 3000 }) => {
	const [show, setShow] = useState(true);
	setTimeout(() => {
		setShow(false);
	}, timeout);
	return (
		<div className={`${classes.snackbar} ${show ? classes.show : ""}`}>
			{message}
		</div>
	);
};
export default Toast;
