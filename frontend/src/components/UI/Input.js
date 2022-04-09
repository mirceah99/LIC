import classes from "./Input.module.css";
const Input = (props) => {
  return <input className={classes["input-class"]} {...props}></input>;
};
export default Input;
