import classes from "./SuccessAnimation.module.css";
import { createPortal } from "react-dom";
const SuccessAnimation = () => {
	const successJsx = (
		<div className={classes["main-container"]}>
			<div className={classes["check-container"]}>
				<div className={classes["check-background"]}>
					<svg
						viewBox="0 0 65 51"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M7 25L27.3077 44L58.5 7"
							stroke="white"
							strokeWidth="13"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<div className={classes["check-shadow"]}></div>
			</div>
		</div>
	);
	return createPortal(successJsx, document.getElementById("success-animation"));
};
export default SuccessAnimation;
