import React, { useEffect, useRef } from "react";
import { init3D, animate, handleResize } from "../logic/scene";
import { detectGesture, initHandTracking, initCamera } from "../logic/gestures";
import { state } from "../logic/config";
import { HandResults } from "../types";

interface ThreeSceneProps {
  started: boolean;
  videoElement: HTMLVideoElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  started,
  videoElement,
  canvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!started || !containerRef.current || initializedRef.current) return;

    // Initialize 3D scene
    init3D(containerRef.current);
    animate();
    window.addEventListener("resize", handleResize);
    initializedRef.current = true;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [started]);

  useEffect(() => {
    if (!started || !videoElement || !canvasRef.current) {
      console.log("⏸️ Waiting for:", {
        started,
        hasVideo: !!videoElement,
        hasCanvas: !!canvasRef.current,
      });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initMediaPipe = (): ReturnType<typeof initCamera> | null => {
      // Kiểm tra video element đã sẵn sàng chưa
      if (videoElement.readyState < 2) {
        console.log(
          "⏳ Video not ready yet, readyState:",
          videoElement.readyState
        );
        return null;
      }

      console.log(
        "🎬 Initializing MediaPipe with video:",
        videoElement.videoWidth,
        "x",
        videoElement.videoHeight
      );

      const hands = initHandTracking((results: HandResults) => {
        // Draw camera preview
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // Detect gesture and update state
        const gesture = detectGesture(results);
        if (gesture !== state.current) {
          console.log("👋 Gesture changed:", state.current, "→", gesture);
        }
        state.current = gesture;
      });

      // Start camera
      console.log("📸 Starting camera with MediaPipe...");
      const cameraUtils = initCamera(videoElement, hands);
      cameraUtils.start();
      return cameraUtils;
    };

    // Thử khởi tạo ngay
    let cameraUtils = initMediaPipe();

    // Nếu chưa ready, đợi video ready
    if (!cameraUtils) {
      const onCanPlay = () => {
        console.log("✅ Video canplay event fired");
        cameraUtils = initMediaPipe();
      };

      videoElement.addEventListener("canplay", onCanPlay);

      return () => {
        videoElement.removeEventListener("canplay", onCanPlay);
        if (cameraUtils) {
          cameraUtils.stop();
        }
      };
    }

    return () => {
      console.log("🛑 Stopping camera...");
      // Cleanup camera
      if (cameraUtils) {
        cameraUtils.stop();
      }
    };
  }, [started, videoElement, canvasRef]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default ThreeScene;
