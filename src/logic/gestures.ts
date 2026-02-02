declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

import { HandResults, GestureType } from "../types";
import { state } from "./config";

export function detectGesture(results: HandResults): GestureType {
  let rawGesture: GestureType = "TREE";

  // Debug: log số tay phát hiện được
  if (results.multiHandLandmarks.length > 0) {
    console.log("👋 Detected hands:", results.multiHandLandmarks.length);
  }

  // Check for two-hand heart gesture
  if (results.multiHandLandmarks.length === 2) {
    const h1 = results.multiHandLandmarks[0];
    const h2 = results.multiHandLandmarks[1];
    const distIndex = Math.hypot(h1[8].x - h2[8].x, h1[8].y - h2[8].y);
    const distThumb = Math.hypot(h1[4].x - h2[4].x, h1[4].y - h2[4].y);

    if (distIndex < 0.2 && distThumb < 0.2) {
      rawGesture = "HEART";
    } else if (
      state.current === "HEART" &&
      distIndex < 0.28 &&
      distThumb < 0.28
    ) {
      rawGesture = "HEART";
    } else {
      rawGesture = "EXPLODE";
    }
  }
  // Single hand gestures
  else if (results.multiHandLandmarks.length === 1) {
    const lm = results.multiHandLandmarks[0];
    state.handX = lm[9].x;
    // ===== SWIPE DETECTION =====
    const deltaX = state.handX - state.lastHandX;

    // Chỉ nhận vuốt khi KHÔNG ở chế độ pinch (PHOTO)
    if (state.current !== "PHOTO" && Math.abs(deltaX) > 0.12) {
      state.swipeDirection = deltaX > 0 ? 1 : -1;
    }

    state.lastHandX = state.handX;
    const tips = [8, 12, 16, 20];
    const wrist = lm[0];
    let openDist = 0;
    tips.forEach(
      (i) => (openDist += Math.hypot(lm[i].x - wrist.x, lm[i].y - wrist.y))
    );
    const avgDist = openDist / 4;
    const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);

    if (avgDist < 0.25) {
      rawGesture = "TREE";
    } else if (pinchDist < 0.045) {
      rawGesture = "PHOTO";
    } else if (state.current === "PHOTO" && pinchDist < 0.07) {
      rawGesture = "PHOTO";
    } else {
      rawGesture = "EXPLODE";
    }
  }

  // Gesture stabilization
  state.gestureBuffer.push(rawGesture);
  if (state.gestureBuffer.length > 5) {
    state.gestureBuffer.shift();
  }

  const counts: Record<string, number> = {};
  state.gestureBuffer.forEach((g) => (counts[g] = (counts[g] || 0) + 1));

  let maxCount = 0;
  let stableGesture = state.current;
  for (const [gesture, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      stableGesture = gesture as GestureType;
    }
  }

  if (stableGesture !== state.current && maxCount >= 3) {
    return stableGesture;
  }

  return state.current;
}

export function initHandTracking(onResults: (results: HandResults) => void) {
  if (!window.Hands) {
    console.error("MediaPipe Hands chưa load!");
    return null as any;
  }

  const hands = new window.Hands({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults as any);
  return hands;
}



export function initCamera(video: HTMLVideoElement, hands: any) {
  const cameraUtils = new window.Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 320,
    height: 240,
  });

  return cameraUtils;
}

