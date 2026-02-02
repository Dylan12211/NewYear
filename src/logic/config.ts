import { Config, AppState } from "../types";

export const CONFIG: Config = {
  goldCount: 2000,
  redCount: 300,
  giftCount: 150,
  explodeRadius: 65,
  photoOrbitRadius: 25,
  treeHeight: 70,
  treeBaseRadius: 35,
  PHOTO_COUNT: 5,
};

export const MUSIC_URL = `${import.meta.env.BASE_URL}assets/audio/audio.mp3`;

const BASE = import.meta.env.BASE_URL;

export const photoFiles: string[] = [
  `${BASE}assets/images/image1.jpeg`,
  `${BASE}assets/images/image2.jpeg`,
  `${BASE}assets/images/image3.jpeg`,
  `${BASE}assets/images/image4.jpeg`,
  `${BASE}assets/images/image5.jpeg`,
];


export const photoMessages: string[] = [
  "Wishing you joy and happiness",
  "May your dreams come true",
  "Season's greetings and best wishes",
  "Sending love and warm wishes",
  "Happy holidays and new year",
];

export const state: AppState = {
  current: "TREE",
  selectedIndex: 0,
  handX: 0.5,
  explodeRotation: 0,
  gestureBuffer: [],
  stateFrameCount: 0,
};
