import Card from "./Card";
import Button from "./Button";
import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import classes from "./UploadPicture.module.css";
import getCroppedImg from "./cropImage";

const UploadPicture = (props) => {
	const [imageSrc, setImageSrc] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	const [previewPicture, setPreviewPicture] = useState(null);
	const uploadPicture = useRef(null);
	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const saveCroppedImage = useCallback(async () => {
		try {
			const returnedCroppedImage = await getCroppedImg(
				imageSrc,
				croppedAreaPixels,
				rotation
			);
			setCroppedImage(returnedCroppedImage);
			setPreviewPicture(returnedCroppedImage);
			setImageSrc(null);
		} catch (e) {
			console.error(e);
		}
	}, [croppedAreaPixels, imageSrc, rotation]);

	function readFile(file) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.addEventListener("load", () => resolve(reader.result), false);
			reader.readAsDataURL(file);
		});
	}
	const handleUploadPicture = async (event) => {
		const uploadedImage = event.target.files[0];
		let imageDataUrl = await readFile(uploadedImage);

		setImageSrc(imageDataUrl);
	};

	const rotateHandler = () => {
		setRotation((prevState) => {
			return (prevState + 90) % 360;
		});
	};
	const cancelHandler = () => {
		setImageSrc(null);
	};
	return (
		<Card>
			<div className={classes["image-upload"]}>
				<img
					className={classes.image}
					src={previewPicture || props.actualImageUrl}
					alt="your profile"
				></img>
				<input
					ref={uploadPicture}
					style={{ display: "none" }}
					onChange={handleUploadPicture}
					type="file"
					accept="image/*"
				></input>
				<Button
					onClick={() => {
						uploadPicture.current.click();
					}}
				>
					Change
				</Button>
			</div>
			{imageSrc && (
				<>
					<Cropper
						image={imageSrc}
						crop={crop}
						zoom={zoom}
						rotation={rotation}
						aspect={1 / 1}
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
						onZoomChange={setZoom}
					/>
					<div className={classes.controls}>
						<Button onClick={rotateHandler}>Rotate</Button>
						<Button onClick={saveCroppedImage}>Ok</Button>
						<Button onClick={cancelHandler}> Cancel</Button>
					</div>
				</>
			)}
			<div className={classes["d-flex"]}>
				<Button
					onClick={() => {
						props.changeImage(croppedImage);
						props.onCancel();
					}}
				>
					Save
				</Button>
				<Button onClick={props.onCancel}>Cancel</Button>
			</div>
		</Card>
	);
};
export default UploadPicture;
