import classes from "./Input.module.css";
import React from "react";
const Input = (props, ref) => {
	return (
		<input
			{...props}
			className={`${classes["input-class"]} ${props.className}`}
			ref={ref}
		></input>
	);
};

export default React.forwardRef(Input);
