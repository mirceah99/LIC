import classes from "./NavBar.module.css";
import SearchSvg from "../assets/svg/search.svg";
import TrophySvg from "../assets/svg/trophy.svg";
import UserSvg from "../assets/svg/user.svg";
import FavoritesSvg from "../assets/svg/favorites.svg";
import PlusSvg from "../assets/svg/plus-square.svg";
import Login from "../assets/svg/login.svg";
import { createPortal } from "react-dom";
import { useContext } from "react";
import AuthContext from "../store/auth-context";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
	const navigation = useNavigate();
	const authCtx = useContext(AuthContext);
	const NavBarJsx = (
		<div className={classes["nav-bar"]}>
			<img
				src={SearchSvg}
				onClick={() => {
					navigation("/search-settings");
				}}
				alt="search"
			/>
			<img src={TrophySvg} alt="best recipes" />
			<img src={FavoritesSvg} alt="favorites" />
			<img
				src={PlusSvg}
				onClick={() => {
					navigation("/create");
				}}
				alt="create post"
			/>
			{authCtx.isLoggedIn && (
				<img
					src={UserSvg}
					onClick={() => {
						navigation("/my-profile");
					}}
					alt="User"
				/>
			)}
			{!authCtx.isLoggedIn && (
				<img
					src={Login}
					onClick={() => {
						navigation("/login");
					}}
					alt="Login"
				/>
			)}
		</div>
	);
	return createPortal(NavBarJsx, document.getElementById("nav-bar"));
};
export default NavBar;
