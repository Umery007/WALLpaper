import styled from "styled-components";

export const CardContainer = styled.div`
	width: min(100%, 520px);
    height: 100%;
	box-sizing: border-box;
	border-radius: 18px;
	padding: 9px;
	background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
	border-radius: 18px;
	position: relative;
	border: 1px solid rgba(255,255,255,0.04);
	box-shadow: 0 8px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
	overflow: visible;
	cursor: pointer;

	.more-button {
		opacity: 0;
		transform: translateY(-4px) scale(0.88);
	}

	&:hover .more-button,
	&:focus-within .more-button {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	@media (hover: none) {
		.more-button { opacity: 1; transform: none; }
	}
`;

export const CardsWrapper = styled.div`
	width: min(1600px, 95%);
	margin: 40px auto;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
	gap: 52px;
	justify-items: center;

	@media (max-width: 520px) {
		grid-template-columns: 1fr;
		gap: 28px;
	}
`;

export const TopBar = styled.div`
	position: absolute;
	left: 12px;
	right: 12px;
	top: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 6;
`;

export const TagList = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
`;

export const Tag = styled.span`
	background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
	color: #e6e6e6;
	padding: 6px 10px;
	border-radius: 999px;
	font-size: 12px;
	border: 1px solid rgba(255,255,255,0.06);
	box-shadow: 0 2px 6px rgba(0,0,0,0.5);
`;

export const HeartButton = styled.button`
	flex: 0 0 40px;
	width: 40px;
	height: 40px;
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: ${props => (props.$active ? "color-mix(in srgb, var(--primary-color-accent) 22%, #111827)" : "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))")};
	color: #fff;
	border: 1px solid ${props => (props.$active ? "var(--primary-color-accent)" : "rgba(255,255,255,0.08)")};
	cursor: pointer;
	backdrop-filter: blur(4px);

	svg path {
		transition: fill .18s ease, stroke .18s ease;
		fill: ${props => (props.$active ? "var(--primary-color-accent)" : "none")};
		stroke: ${props => (props.$active ? "var(--primary-color-accent)" : "#fff")};
	}
`;

export const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 260px;
	border-radius: 14px;
	overflow: hidden;
	border-radius: 14px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.65);
	border: 1px solid rgba(255,255,255,0.03);
	background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
	backdrop-filter: blur(6px);

	@media (max-width: 520px) {
		height: 220px;
	}
`;

export const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

export const Overlay = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 12px;
	display: flex;
	justify-content: center;
	pointer-events: none;
`;

export const DownloadButton = styled.button`
	pointer-events: auto;
	background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
	color: #fff;
	border: 1px solid rgba(255,255,255,0.09);
	padding: 10px 26px;
	border-radius: 999px;
	backdrop-filter: blur(6px);
	cursor: pointer;
	font-weight: 700;
	font-size: 14px;
	letter-spacing: 0.6px;
	transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 18px 40px rgba(0,0,0,0.6);
		background: linear-gradient(90deg, rgba(255,77,85,0.14), rgba(255,255,255,0.02));
	}
`;

export const CardActions = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const MoreButton = styled.button.attrs({ className: "more-button" })`
	display: grid;
	flex: 0 0 40px;
	place-items: center;
	width: 40px;
	height: 40px;
	padding: 0;
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 999px;
	background: rgba(9, 12, 19, 0.72);
	backdrop-filter: blur(8px);
	cursor: pointer;
	transition: opacity 160ms ease, transform 160ms ease, background 160ms ease;

	&:hover { background: rgba(35, 39, 50, 0.95); }
	&:focus-visible { opacity: 1; outline: 2px solid #fff; outline-offset: 2px; }
`;

export const ActionMenu = styled.div`
	position: absolute;
	top: 60px;
	right: 12px;
	z-index: 10;
	display: grid;
	gap: 4px;
	width: 180px;
	padding: 6px;
	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 12px;
	background: rgba(16, 18, 25, 0.96);
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(12px);
	animation: card-menu-arrive 140ms ease-out both;

	@keyframes card-menu-arrive {
		from { opacity: 0; transform: translateY(-5px) scale(0.97); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
`;

export const ActionMenuButton = styled.button`
	display: flex;
	align-items: center;
	gap: 9px;
	width: 100%;
	min-height: 38px;
	padding: 8px 10px;
	color: #f6f6f8;
	text-align: left;
	border: 0;
	border-radius: 8px;
	background: transparent;
	font: inherit;
	font-size: 13px;
	cursor: pointer;

	&:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
	&:focus-visible { outline: 2px solid #fff; outline-offset: -2px; }
	&:disabled { opacity: 0.45; cursor: not-allowed; }
`;

export const SaveDialogOverlay = styled.div`
	position: fixed;
	z-index: 1500;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 20px;
	background: rgba(0, 0, 0, 0.72);
	backdrop-filter: blur(5px);
	animation: save-dialog-fade 150ms ease-out both;

	@keyframes save-dialog-fade {
		from { opacity: 0; }
		to { opacity: 1; }
	}
`;

export const SaveDialog = styled.div`
	display: grid;
	gap: 16px;
	width: min(420px, 100%);
	max-height: min(620px, 90vh);
	overflow-y: auto;
	padding: 20px;
	color: #f5f5f7;
	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 16px;
	background: linear-gradient(155deg, #1b1d25, #101116);
	box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
`;

export const SaveDialogHeader = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;

	h2 {
		margin: 0;
		font-size: 18px;
		font-weight: 650;
	}
`;

export const SaveDialogClose = styled.button`
	display: grid;
	flex: 0 0 34px;
	place-items: center;
	width: 34px;
	height: 34px;
	padding: 0;
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.14);
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.07);
	font-size: 23px;
	cursor: pointer;

	&:hover { background: rgba(255, 255, 255, 0.15); }
	&:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const FolderOptions = styled.div`
	display: grid;
	gap: 7px;
	max-height: 230px;
	overflow-y: auto;
`;

export const FolderOption = styled.label`
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto;
	align-items: center;
	gap: 10px;
	min-height: 46px;
	padding: 8px 10px;
	border: 1px solid ${({ $selected }) =>
		$selected ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.1)"};
	border-radius: 9px;
	background: ${({ $selected }) =>
		$selected ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.035)"};
	cursor: pointer;

	input { accent-color: var(--primary-color-accent, #ff4d55); }
	span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
	small { color: rgba(255, 255, 255, 0.55); font-size: 10px; white-space: nowrap; }
`;

export const FolderCreateForm = styled.form`
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 8px;

	input {
		min-width: 0;
		padding: 0 11px;
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 8px;
		outline: 0;
		background: rgba(255, 255, 255, 0.05);
		font: inherit;
		font-size: 12px;
	}
	input:focus { border-color: rgba(255, 255, 255, 0.55); }
	input::placeholder { color: rgba(255, 255, 255, 0.48); }
	button {
		min-height: 38px;
		padding: 0 11px;
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.11);
		font: inherit;
		font-size: 11px;
		font-weight: 650;
		cursor: pointer;
	}
	button:hover { background: rgba(255, 255, 255, 0.19); }
	button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

export const FolderStatus = styled.p`
	margin: 0;
	color: ${({ role }) => (role === "alert" ? "#ffb4ad" : "rgba(255, 255, 255, 0.62)")};
	font-size: 12px;
	line-height: 1.5;
`;

export const GalleryStatus = styled.p`
	width: min(1600px, 95%);
	margin: 40px auto;
	padding: 28px;
	text-align: center;
	font-family: "Roboto Slab", serif;
	font-size: 1rem;
	line-height: 1.6;
	color: #e9e4da;
	background: rgba(0, 0, 0, 0.28);
	border: 1px solid rgba(233, 228, 218, 0.18);
	border-radius: 14px;
`;

export const GalleryActions = styled.div`
	display: flex;
	justify-content: center;
	margin: 0 auto 48px;
`;

export const LoadMoreButton = styled.button`
	padding: 12px 28px;
	font-family: "Roboto Slab", serif;
	font-size: 0.95rem;
	color: #1b1b1b;
	background: #e9e4da;
	border: none;
	border-radius: 999px;
	cursor: pointer;
	transition: opacity 0.2s ease, transform 0.2s ease;

	&:hover:not(:disabled) {
		transform: translateY(-1px);
		opacity: 0.92;
	}

	&:disabled {
		opacity: 0.6;
		cursor: default;
	}
`;
