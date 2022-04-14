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
function App() {
	const authCtx = useContext(AuthContext);
	return (
		<>
			<NavBar />
			<Routes>
				{!authCtx.isLoggedIn && <Route path="/login" element={<LoginForm />} />}

				<Route path="/register" element={<RegisterForm />} />
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
		</>
	);
}

export default App;
