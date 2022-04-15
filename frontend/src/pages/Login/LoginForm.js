import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import useHttp from "../../hooks/use-http";
import { useContext, useState } from "react";
import HorizontalLine from "../../components/UI/HorizontalLine";
import Form from "../../components/UI/Form";
import AuthContext from "../../store/auth-context";
import { Link } from "react-router-dom";
const LoginForm = () => {
	const authCtx = useContext(AuthContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loginResponse, setLoginResponse] = useState(null);

	const saveTokens = (response) => {
		authCtx.login(response.data.accessToken);
		setLoginResponse(response);
	};

	const requestConfig = {
		path: "/login",
		method: "POST",
		headers: {},
		body: { username, password },
	};
	const { error, isLoading, sendRequest } = useHttp();
	const loginHandler = (event) => {
		event.preventDefault();
		setLoginResponse(null);
		sendRequest(requestConfig, saveTokens);
	};
	const disableLoginButton = username.length === 0 || password.length === 0;
	return (
		<Card>
			<Form>
				<div>
					<h3>First login</h3>
				</div>
				<div>
					<Input
						placeholder="Username"
						onChange={(event) => setUsername(event.target.value)}
					/>
				</div>
				<div>
					<Input
						placeholder="Password"
						onChange={(event) => setPassword(event.target.value)}
						type="password"
					/>
				</div>
				{isLoading && <div>Loading...</div>}
				{error && <div>{error.message}</div>}
				{loginResponse && <div>{loginResponse.message}</div>}
				<div>
					<Button disabled={disableLoginButton} onClick={loginHandler}>
						Login
					</Button>
				</div>
				<HorizontalLine />
				<div>
					<Link to="/TBD">Forgot password</Link>
					<Link to="/register">Create account</Link>
				</div>
			</Form>
		</Card>
	);
};
export default LoginForm;
