import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import useHttp from "../../hooks/use-http";
import { useState } from "react";
import HorizontalLine from "../../components/UI/HorizontalLine";
import Form from "../../components/UI/Form";
import { Link } from "react-router-dom";
const RegisterForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [registerResponse, setRegisterResponse] = useState(null);
	const saveTokens = (response) => {
		setRegisterResponse(response);
	};
	const onChangeUsernameHandler = (event) => {
		setUsername(event.target.value);
		if (error) setError(null);
	};
	//{path: '/login', method: 'GET', headers:{}, body:{}}, saveTokens
	const requestConfig = {
		path: "/users",
		method: "POST",
		headers: {},
		body: { username, password },
	};
	const { error, isLoading, sendRequest, setError } = useHttp();
	const register = (event) => {
		setRegisterResponse(null);
		event.preventDefault();
		sendRequest(requestConfig, saveTokens);
	};
	const disableLoginButton =
		username.length === 0 ||
		password.length === 0 ||
		repeatPassword !== password ||
		password.length < 10;
	const differentPasswords =
		repeatPassword.length > 0 && repeatPassword !== password;
	return (
		<Card>
			<Form>
				<div>
					<h3>Register</h3>
				</div>
				<div>
					<Input placeholder="Username" onChange={onChangeUsernameHandler} />
				</div>
				<div>
					<Input
						placeholder="Password"
						onChange={(event) => setPassword(event.target.value)}
						type="password"
					/>
				</div>
				<div>
					<Input
						placeholder="Retype-password"
						onChange={(event) => setRepeatPassword(event.target.value)}
						type="password"
					/>
				</div>
				{isLoading && <div>Loading...</div>}
				{error && <div>{error.message}</div>}
				{differentPasswords && <div>⚠️passwords do not match⚠️</div>}
				{password.length > 0 && password.length < 10 && !differentPasswords && (
					<div>⚠️password must has minimum 10 characters⚠️</div>
				)}
				{registerResponse && <div>{registerResponse.message}</div>}
				<div>
					<Button disabled={disableLoginButton} onClick={register}>
						Create account
					</Button>
				</div>
				<HorizontalLine />
				<div>
					<Link to="/login">Login</Link>
				</div>
			</Form>
		</Card>
	);
};
export default RegisterForm;
