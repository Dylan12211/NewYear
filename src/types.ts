import * as THREE from "three";

// Gesture types
export type GestureType = "TREE" | "HEART" | "EXPLODE" | "PHOTO";

// MediaPipe types
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandResults {
  image: HTMLVideoElement | HTMLCanvasElement;
  multiHandLandmarks: HandLandmark[][];
}

// Gesture for UI display
export interface Gesture {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Scene objects
export interface SceneObjects {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  groupGold: THREE.Points;
  groupRed: THREE.Points;
  groupGift: THREE.Points;
  photoMeshes: THREE.Mesh[];
  titleMesh: THREE.Mesh;
  starMesh: THREE.Mesh;
  loveMesh: THREE.Mesh;
  messageMesh: THREE.Mesh;
  photoTextures: THREE.Texture[];
}

// Global state
export interface AppState {
  current: GestureType;
  selectedIndex: number;
  handX: number;
  explodeRotation: number;
  gestureBuffer: GestureType[];
  stateFrameCount: number;
  lastHandX: number;
  swipeDirection: -1 | 0 | 1;
  nextPhotoIndex: number;

}

// Config
export interface Config {
  goldCount: number;
  redCount: number;
  giftCount: number;
  explodeRadius: number;
  photoOrbitRadius: number;
  treeHeight: number;
  treeBaseRadius: number;
  PHOTO_COUNT: number;
}

// Particle userData
export interface ParticleUserData {
  tree: number[];
  explode: number[];
  heart: number[];
  phases: number[];
  baseColor: THREE.Color;
  baseSize: number;
}

export type ParticleType = "gold" | "red" | "gift";
