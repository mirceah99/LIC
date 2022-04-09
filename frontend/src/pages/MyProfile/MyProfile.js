import classes from "./MyProfile.module.css";
import profilePicture from "../../assets/demo-img/profilePicture.jpg";
import Input from "../../components/UI/Input";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
const MyProfile = () => {
	const authCtx = useContext(AuthContext);

	if (!authCtx.isLoggedIn) {
	}

	const [youTube, setYouTube] = useState("");
	const [instagram, setInstagram] = useState("");
	const [facebook, setFacebook] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tikTok, setTikTok] = useState("");
	const [reddit, setReddit] = useState("");

	return (
		<div>
			<div className={classes["picture-and-username"]}>
				<img
					className={classes["profile-picture"]}
					src={profilePicture}
					alt="you"
				/>
				<p className={classes["user-name"]}>Mircea99</p>
			</div>
			<div className={classes["updatable-info"]}>
				<div>
					<label>YouTube:</label>
					<Input value={youTube} placeholder="set me" />
					<p>🔗</p>
				</div>
				<div>
					<label>Instagram:</label>
					<Input value={instagram} placeholder="set me" />
					<p>🔗</p>
				</div>
				<div>
					<label>Facebook:</label>
					<Input value={facebook} placeholder="set me" />
					<p>🔗</p>
				</div>
				<div>
					<label>Twitter:</label>
					<Input value={twitter} placeholder="set me" />
					<p>🔗</p>
				</div>
				<div>
					<label>TikTok:</label>
					<Input value={tikTok} placeholder="set me" />
					<p>🔗</p>
				</div>
				<div>
					<label>Reddit:</label>
					<Input value={reddit} placeholder="set me" />
					<p>🔗</p>
				</div>
			</div>
		</div>
	);
};
export default MyProfile;
