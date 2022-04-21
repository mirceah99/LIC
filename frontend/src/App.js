import LoginForm from "./pages/Login/LoginForm";
import "./App.css";
import RegisterForm from "./pages/Register/RegisterForm";
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import NavBar from "./components/NavBar";

import Meal from "./components/Meal";
import MealDetails from "./components/MealDetails";
import MyProfile from "./pages/MyProfile/MyProfile";
import AuthContext from "./store/auth-context";
import { useContext } from "react";
import ChangePasswordForm from "./pages/ChangePassword/ChangePasswordForm";
import ResetPasswordForm from "./pages/ResetPassword/ResetPasswordForm";
import Filter from "./components/UI/Filter";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import ChoseCreationType from "./components/ChoseCreationType";
import CreateIngredient from "./components/CreateIngredient";

function App() {
	const authCtx = useContext(AuthContext);

	const theme = createTheme({
		palette: {
			primary: {
				main: "#03d099",
			},
		},
	});
	return (
		<>
			<MuiThemeProvider theme={theme}>
				<NavBar />
				<Routes>
					{!authCtx.isLoggedIn && (
						<Route path="/login" element={<LoginForm />} />
					)}
					<Route path="/search-settings" element={<Filter />} />

					<Route path="/create" element={<ChoseCreationType />} />
					<Route path="/create/ingredient" element={<CreateIngredient />} />

					<Route path="/register" element={<RegisterForm />} />
					<Route path="/reset-password" element={<ResetPasswordForm />} />

					<Route
						path="/change-password/:token"
						element={<ChangePasswordForm />}
					/>

					<Route path="/" element={"maine page TBD"} />
					<Route path="/meal" element={<Meal />} />
					<Route path="/meal-details" element={<MealDetails />} />
					{authCtx.isLoggedIn && (
						<Route path="/my-profile" element={<MyProfile />} />
					)}

					{authCtx.isLoggedIn ? (
						<Route path="*" element={<Navigate to="/" />} />
					) : (
						<Route path="*" element={<Navigate to="/login" />} />
					)}
				</Routes>
			</MuiThemeProvider>
		</>
	);
}

export default App;
