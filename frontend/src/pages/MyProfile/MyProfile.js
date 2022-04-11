import classes from "./MyProfile.module.css";
import profilePicture from "../../assets/demo-img/profilePicture.jpg";
import Input from "../../components/UI/Input";
import { useState } from "react";
import Button from "../../components/UI/Button";
const MyProfile = () => {
	const [youTube, setYouTube] = useState("");
	const [instagram, setInstagram] = useState("");
	const [facebook, setFacebook] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tikTok, setTikTok] = useState("");
	const [reddit, setReddit] = useState("");
	const submitHandler = () => {};
	return (
		<form>
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
					<Input
						value={youTube}
						onChange={(event) => setYouTube(event.target.value)}
						placeholder="set me"
					/>
					<p>🔗</p>
				</div>
				<div>
					<label>Instagram:</label>
					<Input
						value={instagram}
						onChange={(event) => setInstagram(event.target.value)}
						placeholder="set me"
					/>
					<p>🔗</p>
				</div>
				<div>
					<label>Facebook:</label>
					<Input
						value={facebook}
						onChange={(event) => setFacebook(event.target.value)}
						placeholder="set me"
					/>
					<p>🔗</p>
				</div>
				<div>
					<label>Twitter:</label>
					<Input
						value={twitter}
						onChange={(event) => setTwitter(event.target.value)}
						placeholder="set me"
					/>
					<p>🔗</p>
				</div>
				<div>
					<label>TikTok:</label>
					<Input
						value={tikTok}
						onChange={(event) => setTikTok(event.target.value)}
						placeholder="set me"
					/>
					<p>🔗</p>
				</div>
				<div>
					<label>Reddit:</label>
					<Input
						value={reddit}
						onChange={(event) => setReddit(event.target.value)}
						placeholder="set me"
					/>
					<p>🔗</p>
				</div>
			</div>
			<div className={classes["update-button"]}>
				<Button onClick={submitHandler} type="submit">
					Update
				</Button>
			</div>
		</form>
	);
};
export default MyProfile;
