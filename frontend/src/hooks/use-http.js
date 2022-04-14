import { useCallback, useContext, useState } from "react";
import AuthContext from "../store/auth-context";
const baseUrl = "http://localhost:8080/api";
const useHttp = () => {
	const authCtx = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const sendRequest = useCallback(
		async (
			requestConfig = {
				path: "/example",
				method: "GET",
				headers: {},
				body: {},
			},
			applyDataFunction
		) => {
			setIsLoading(true);
			setError(null);
			try {
				const url = requestConfig.path.includes(baseUrl)
					? requestConfig.path
					: `${baseUrl}${requestConfig.path}`;
				const response = await fetch(url, {
					method: requestConfig.method,
					headers: {
						"Content-Type": "application/json",
						AuthorizationToken: authCtx.token,
						...requestConfig.headers,
					},
					body: JSON.stringify(requestConfig.body),
				});

				if (!response.ok) {
					throw new Error((await response.json()).message || "Request failed!");
				}

				const data = await response.json();
				applyDataFunction(data);
			} catch (err) {
				console.log(err);
				setError(err || "Something failed, idk what bananas happens!🍌🍌");
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return { error, isLoading, sendRequest, setError };
};
export default useHttp;
