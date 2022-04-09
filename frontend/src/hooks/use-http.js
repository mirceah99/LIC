import { useCallback, useState } from "react";
const baseUrl = "http://localhost:8080/api";
const useHttp = () => {
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
				const response = await fetch(`${baseUrl}${requestConfig.path}`, {
					method: requestConfig.method,
					headers: {
						"Content-Type": "application/json",
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
