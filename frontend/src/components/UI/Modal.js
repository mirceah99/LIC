import { createPortal } from "react-dom";
import classes from "./Modal.module.css";

const Modal = (props) => {
	return createPortal(
		<div className={classes.background}>
			<div className={classes.modal}>{props.children}</div>
		</div>,
		document.getElementById("modal")
	);
};
export default Modal;
