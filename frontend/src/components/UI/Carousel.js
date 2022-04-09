import classes from "./Carousel.module.css";
const Carousel = (props) => {
	let scrollAction = null;
	const onScrollHandler = (event) => {
		const scrollActualPosition = event.target.scrollLeft;
		const carouselWidth = event.target.offsetWidth;
		const scrollRight =
			scrollActualPosition % carouselWidth > carouselWidth / 2;

		clearTimeout(scrollAction);

		scrollAction = setTimeout(() => {
			let pictureNumber = Math.floor(scrollActualPosition / carouselWidth);

			if (scrollRight) {
				pictureNumber++;
			}
			event.target.scrollTo({
				top: 0,
				left: carouselWidth * pictureNumber,
				behavior: "smooth",
			});
		}, 400);
	};
	return (
		<div className={classes["wrapper-div"]}>
			<div onScroll={onScrollHandler} className={classes.carousel}>
				{props.children}
			</div>
		</div>
	);
};
export default Carousel;
