import { Config, AppState } from "../types";

export const CONFIG: Config = {
  goldCount: 2000,
  redCount: 300,
  giftCount: 150,
  explodeRadius: 65,
  photoOrbitRadius: 25,
  treeHeight: 70,
  treeBaseRadius: 35,
  PHOTO_COUNT: 9,
};

export const MUSIC_URL = `${import.meta.env.BASE_URL}assets/audio/audio.mp3`;

const BASE = import.meta.env.BASE_URL;

export const photoFiles: string[] = [
  `${BASE}assets/images/image1.jpeg`,
  `${BASE}assets/images/image2.jpeg`,
  `${BASE}assets/images/image3.jpeg`,
  `${BASE}assets/images/image4.jpeg`,
  `${BASE}assets/images/image5.jpeg`,
  `${BASE}assets/images/image6.jpeg`,
  `${BASE}assets/images/image7.jpeg`,
  `${BASE}assets/images/image8.jpeg`,
  `${BASE}assets/images/image9.jpeg`,
];


export const photoMessages: string[] = [
  "Chúc Lomiu hay ăn chóng lớn",
  "Chúc Lomiu lớn đẹp như hoa",
  "Chúc Lomiu luôn luôn khỏe mạnh",
  "Chúc Lomiu thúi đừng đánh Cường",
  "Chúc Lomiu tốt nghiệp thành công",
  "Chúc Lomiu ngày càng giàu có",
  "Chúc Lomiu 14/2 vui vẻ",
  "Chúc Lomiu tiền vào như nước sông đà, tiền ra nhỏ giọt như cà phê phin",
  "HAPPY NEW YEAR",
];

export const state: AppState = {
  current: "TREE",
  selectedIndex: 0,
  handX: 0.5,
  explodeRotation: 0,
  gestureBuffer: [],
  stateFrameCount: 0,
  lastHandX: 0.5,
  swipeDirection: 0 as -1 | 0 | 1,
  nextPhotoIndex: 0,
  autoRotateSpeed: 0.003,

};
