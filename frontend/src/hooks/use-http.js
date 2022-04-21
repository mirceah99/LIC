import { useCallback, useContext, useState } from "react";
import AuthContext from "../store/auth-context";
const baseUrl = "http://localhost:8080/api";
const useHttp = () => {
	const authCtx = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const [status, setStatus] = useState(0);

	const sendRequest = useCallback(
		async (
			requestConfig = {
				path: "/example",
				method: "GET",
				headers: {},
				body: {},
			},
			applyDataFunction,
			inCaseOfError = () => {}
		) => {
			setIsLoading(true);
			setError(null);
			let response;
			try {
				const headers = {
					"Content-Type": "application/json",
					AuthorizationToken: authCtx.token,
					...requestConfig.headers,
				};
				let body;
				if (headers["Content-Type"] === "multipart/form-data;") {
					body = requestConfig.body;
					delete headers["Content-Type"];
				} else {
					body = JSON.stringify(requestConfig.body);
				}
				const url = requestConfig.path.includes(baseUrl)
					? requestConfig.path
					: `${baseUrl}${requestConfig.path}`;
				response = await fetch(url, {
					method: requestConfig.method,
					headers,
					body,
				});

				if (!response.ok) {
					throw new Error(
						(await response.json())?.message || "Request failed!"
					);
				}

				const data = await response.json();
				data.status = response.status;
				setStatus(response.status);
				applyDataFunction(data);
			} catch (err) {
				console.log(err);
				setStatus(response.status);
				inCaseOfError(response);
				setError(err || "Something failed, idk what bananas happens!🍌🍌");
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return { error, isLoading, sendRequest, setError, status };
};
export default useHttp;
