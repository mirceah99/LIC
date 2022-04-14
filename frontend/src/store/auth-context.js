import { createContext, useEffect, useState } from "react";

function parseJwt(token) {
	if (!token || token === "null") return null;
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	return JSON.parse(jsonPayload);
}

const AuthContext = createContext({
	token: "",
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
	decodeToken: { id: 0, url: "" },
});
export const AuthContextProvider = (props) => {
	const [token, setToken] = useState(localStorage.token);
	const [decodeToken, setDecodedToken] = useState(parseJwt(localStorage.token));
	const isLoggedIn = !!token;

	const loginHandler = (token) => {
		setToken(token);
		localStorage.setItem("token", token);
		const decodeToken = parseJwt(token);
		setDecodedToken(decodeToken);
		const timeout = +decodeToken.exp - new Date().getTime() / 1000;
		// if the token expired log out
		if (timeout < 0) {
			return logoutHandler();
		} else {
			// i will set a timeout //TODO NEED TO REMOVE IT not sure
			return setTimeout(logoutHandler, timeout * 1000);
		}
	};
	const logoutHandler = () => {
		setToken(null);
		localStorage.removeItem("token");
		console.log("initiate logout logic...");
	};

	// first time when we load the app i want to see if i have a token and to login with it
	useEffect(() => {
		const storedToken = localStorage.getItem("token");

		if (storedToken === "null" || storedToken === null) {
			return logoutHandler(); // if is no stored token i will log out
		}
		loginHandler(storedToken);
	}, []);

	const contestValue = {
		token,
		isLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
		decodeToken,
	};

	return (
		<AuthContext.Provider value={contestValue}>
			{props.children}
		</AuthContext.Provider>
	);
};
export default AuthContext;
