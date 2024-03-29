import classes from "./MyProfile.module.css";
import Input from "../../components/UI/Input";
import { useContext, useEffect, useState } from "react";
import Button from "../../components/UI/Button";
import useHttp from "../../hooks/use-http";
import AuthContext from "../../store/auth-context";
import SuccessAnimation from "../../components/UI/SuccessAnimation";
import HorizontalLine from "../../components/UI/HorizontalLine";
import DeleteLogout from "./DeleteLogout";
import UploadPicture from "../../components/UI/UploadPicture";
import Modal from "../../components/UI/Modal";
const MyProfile = () => {
	const authCtx = useContext(AuthContext);
	const [youTube, setYouTube] = useState("");
	const [instagram, setInstagram] = useState("");
	const [facebook, setFacebook] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tikTok, setTikTok] = useState("");
	const [reddit, setReddit] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [needToCheckEmail, setNeedToCheckEmail] = useState(false);
	const [success, setSuccess] = useState(false);
	const [profilePicture, setProfilePicture] = useState(null);
	const [uploadPicture, setUploadPicture] = useState(false);
	const { error, isLoading, sendRequest } = useHttp();
	const openUrl = (url) => {
		if (url) window.open(url, "_blank").focus();
	};

	const showUploadPictureModal = () => {
		setUploadPicture(true);
	};
	const hideUploadPictureModal = () => {
		setUploadPicture(false);
	};
	const showSuccessAnimation = (response) => {
		if (
			response.message.includes("success") ||
			response.message.includes("Success")
		) {
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
		}
	};
	//update profile picture request
	const changeProfilePicture = async (picture) => {
		let blobImage = await fetch(picture);
		blobImage = await blobImage.blob();
		const formData = new FormData();
		formData.append("profilePicture", blobImage);
		const requestConfig = {
			path: `/users/profile-picture/${authCtx.decodeToken.id}`,
			method: "PUT",
			headers: {
				"Content-Type": "multipart/form-data;",
			},
			body: formData,
		};
		sendRequest(requestConfig, (response) => {
			showSuccessAnimation(response);
		});
	};
	const changeImage = (url) => {
		setProfilePicture(url);
		// need to send a request on database
		changeProfilePicture(url);
	};
	const submitHandler = (event) => {
		event.preventDefault();
		const requestConfig = {
			path: `/users/${authCtx.decodeToken.id}`,
			method: "PUT",
			headers: {},
			body: {
				youTube,
				instagram,
				facebook,
				twitter,
				tikTok,
				reddit,
			},
		};
		sendRequest(requestConfig, handlerUpdateResponse);
	};

	const submitHandlerEmail = (event) => {
		event.preventDefault();
		const requestConfig = {
			path: `/users/${authCtx.decodeToken.id}`,
			method: "PUT",
			headers: {},
			body: {
				email,
			},
		};
		setNeedToCheckEmail(true);
		sendRequest(requestConfig, handlerUpdateResponse);
	};

	const handlerUpdateResponse = (response) => {
		showSuccessAnimation(response);
	};
	const consumeResponseFromApi = (response) => {
		response.data.youTube && setYouTube(response.data.youTube);
		response.data.facebook && setFacebook(response.data.facebook);
		response.data.instagram && setInstagram(response.data.instagram);
		response.data.twitter && setTwitter(response.data.twitter);
		response.data.tikTok && setTikTok(response.data.tikTok);
		response.data.reddit && setReddit(response.data.reddit);
		response.data.email && setEmail(response.data.email);
		response.data.username && setUsername(response.data.username);
		response.data.profilePicture &&
			setProfilePicture(response.data.profilePicture);

		if (response.data.email && !response.data.emailConfirmed)
			setNeedToCheckEmail(true);
	};
	useEffect(() => {
		const requestConfig = {
			path: authCtx.decodeToken.url,
			method: "GET",
			headers: {},
		};
		sendRequest(requestConfig, consumeResponseFromApi);
	}, []);
	return (
		<>
			{uploadPicture && (
				<Modal>
					<UploadPicture
						actualImageUrl={profilePicture}
						onCancel={hideUploadPictureModal}
						changeImage={changeImage}
					/>
				</Modal>
			)}
			<div className={classes["picture-and-username"]}>
				<img
					onClick={showUploadPictureModal}
					className={classes["profile-picture"]}
					src={profilePicture}
					alt="you"
				/>
				<p className={classes["user-name"]}>{username}</p>
			</div>
			<form onSubmit={submitHandler}>
				<div className={classes["updatable-info"]}>
					<div>
						<label>YouTube:</label>
						<Input
							type="url"
							value={youTube}
							onChange={(event) => setYouTube(event.target.value)}
							placeholder="set me"
						/>
						<p onClick={openUrl.bind(null, youTube)}>🔗</p>
					</div>
					<div>
						<label>Instagram:</label>
						<Input
							type="url"
							value={instagram}
							onChange={(event) => setInstagram(event.target.value)}
							placeholder="set me"
						/>
						<p onClick={openUrl.bind(null, instagram)}>🔗</p>
					</div>
					<div>
						<label>Facebook:</label>
						<Input
							type="url"
							value={facebook}
							onChange={(event) => setFacebook(event.target.value)}
							placeholder="set me"
						/>
						<p onClick={openUrl.bind(null, facebook)}>🔗</p>
					</div>
					<div>
						<label>Twitter:</label>
						<Input
							type="url"
							value={twitter}
							onChange={(event) => setTwitter(event.target.value)}
							placeholder="set me"
						/>
						<p onClick={openUrl.bind(null, twitter)}>🔗</p>
					</div>
					<div>
						<label>TikTok:</label>
						<Input
							type="url"
							value={tikTok}
							onChange={(event) => setTikTok(event.target.value)}
							placeholder="set me"
						/>
						<p onClick={openUrl.bind(null, tikTok)}>🔗</p>
					</div>
					<div>
						<label>Reddit:</label>
						<Input
							type="url"
							value={reddit}
							onChange={(event) => setReddit(event.target.value)}
							placeholder="set me"
						/>
						<p onClick={openUrl.bind(null, reddit)}>🔗</p>
					</div>
				</div>
				{error && "Oops we had some problems..."}
				{isLoading && "Loading..."}
				<div className={classes["update-button"]}>
					<Button type="submit">Update Links</Button>
				</div>
			</form>
			<HorizontalLine />
			<form onSubmit={submitHandlerEmail}>
				<div className={classes["updatable-info"]}>
					<div>
						<label>Email:</label>
						<Input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="set me"
						/>
					</div>
				</div>
				{error && "Oops we had some problems..."}
				{isLoading && "Loading..."}
				{needToCheckEmail && (
					<div className={classes["confirm-email"]}>
						<span>
							You need to confirm your email. Please check your email address.
						</span>
					</div>
				)}
				<div className={classes["update-button"]}>
					<Button type="submit">Update Email</Button>
				</div>
			</form>
			<HorizontalLine />

			<div className={classes["updatable-info"]}>
				<DeleteLogout username={username} />
			</div>
			{success && <SuccessAnimation />}
		</>
	);
};
export default MyProfile;
