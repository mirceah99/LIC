import classes from "./NavBar.module.css";
import SearchSvg from "../assets/svg/search.svg";
import TrophySvg from "../assets/svg/trophy.svg";
import UserSvg from "../assets/svg/user.svg";
import RegisterSvg from "../assets/svg/register.svg";
import FavoritesSvg from "../assets/svg/favorites.svg";
import PlusSvg from "../assets/svg/plus-square.svg";

import { createPortal } from "react-dom";
import { useContext } from "react";
import AuthContext from "../store/auth-context";
const NavBar = () => {
	const authCtx = useContext(AuthContext);
	const NavBarJsx = (
		<div className={classes["nav-bar"]}>
			<img src={SearchSvg} alt="search" />
			<img src={TrophySvg} alt="best recipes" />
			<img src={FavoritesSvg} alt="favorites" />
			<img src={PlusSvg} alt="create post" />
			{authCtx.isLoggedIn && <img src={UserSvg} alt="user" />}
			{!authCtx.isLoggedIn && <img src={RegisterSvg} alt="register" />}
		</div>
	);
	return createPortal(NavBarJsx, document.getElementById("nav-bar"));
};
export default NavBar;
