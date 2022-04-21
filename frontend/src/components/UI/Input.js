import classes from "./Input.module.css";
import React from "react";
const Input = (props, ref) => {
	return (
		<input className={classes["input-class"]} {...props} ref={ref}></input>
	);
};

export default React.forwardRef(Input);
