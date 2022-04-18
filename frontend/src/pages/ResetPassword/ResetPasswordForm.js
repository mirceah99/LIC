import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import useHttp from "../../hooks/use-http";
import { useState } from "react";
import HorizontalLine from "../../components/UI/HorizontalLine";
import Form from "../../components/UI/Form";
import { Link } from "react-router-dom";
const ResetPasswordForm = () => {
	const [email, setEmail] = useState("");
	const [loginResponse, setLoginResponse] = useState(null);
	const [response, setResponse] = useState(null);

	const requestConfig = {
		path: "/users/reset-password",
		method: "PUT",
		headers: {},
		body: { email },
	};
	const { error, isLoading, sendRequest } = useHttp();
	const loginHandler = (event) => {
		event.preventDefault();
		setLoginResponse(null);
		sendRequest(requestConfig, (response) => {
			setResponse(response);
		});
	};
	const disableLoginButton = !email.includes("@");
	return (
		<Card>
			<Form>
				<div>
					<h3>Reset password</h3>
				</div>
				<div>
					<Input
						placeholder="Email"
						onChange={(event) => setEmail(event.target.value)}
					/>
				</div>
				{isLoading && <div>Loading...</div>}
				{error && <div>{error.message}</div>}
				{response && <div>{response.message}</div>}
				{loginResponse && <div>{loginResponse.message}</div>}
				<div>
					<Button disabled={disableLoginButton} onClick={loginHandler}>
						Reset password
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
export default ResetPasswordForm;
