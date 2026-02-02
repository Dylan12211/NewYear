import React, { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Snowfall from "./components/Snowfall";
import GestureCard from "./components/GestureCard";
import CameraFeed from "./components/CameraFeed";
import ThreeScene from "./components/ThreeScene";
import { Gesture } from "./types";
import { MUSIC_URL } from "./logic/config";

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Phát nhạc ngay khi vào web
  useEffect(() => {
    const bgMusic = new Audio(MUSIC_URL);
    bgMusic.loop = true;
    bgMusic.volume = 0.5; // Volume 50% để không quá to
    bgMusicRef.current = bgMusic;

    // Tự động phát nhạc
    const playMusic = () => {
      bgMusic.play().catch(() => {
        console.log("🎵 Nhạc sẽ phát sau khi user tương tác với trang");
        // Nếu autoplay bị chặn, phát khi user click start
      });
    };

    playMusic();

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  const gestures: Gesture[] = [
    {
      id: "open-hand",
      name: "Open Hand",
      description: "Spread your hand to rotate photos",
      icon: "🖐️",
      color: "text-yellow-400",
    },
    {
      id: "pinch",
      name: "Pinch",
      description: "Pinch fingers to zoom in photo",
      icon: "👌",
      color: "text-blue-400",
    },
    {
      id: "heart",
      name: "Heart",
      description: "Make heart shape (2 hands)",
      icon: "🫶",
      color: "text-red-400",
    },
    {
      id: "fist",
      name: "Fist",
      description: "Make a fist to see the tree",
      icon: "✊",
      color: "text-green-400",
    },
  ];

  const handleStart = () => {
    setStarted(true);

    // Phát nhạc khi click start (fallback nếu autoplay bị chặn)
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current
        .play()
        .catch((e) => console.log("Could not play music:", e));
    }
  };

  const handleVideoReady = (video: HTMLVideoElement) => {
    setVideoElement(video);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-green-950/40 font-sans selection:bg-xmas-red selection:text-white">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(212,36,38,0.15),transparent_50%)]"></div>
      <Snowfall />

      {/* Three.js Scene */}
      {started && (
        <ThreeScene
          started={started}
          videoElement={videoElement}
          canvasRef={canvasRef}
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-6 min-h-screen flex flex-col">
        {/* Top Section: Header & Camera */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          {/* Header */}
          {!started && (
            <div className="flex-1 text-center lg:text-left pt-4 lg:pt-0">
              <h1 className="font-snowflake text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-xmas-gold via-yellow-200 to-xmas-gold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2 animate-pulse">
                HAPPY NEW YEAR
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide flex items-center justify-center lg:justify-start gap-2">
                <Sparkles size={16} className="text-xmas-gold" />
                Hand Gesture Control
                <Sparkles size={16} className="text-xmas-gold" />
              </p>
            </div>
          )}

          {/* Camera Feed */}
          {started && (
            <div className="w-full max-w-[320px] mx-auto lg:mx-0">
              <CameraFeed
                onVideoReady={handleVideoReady}
                canvasRef={canvasRef}
              />
              {/* Gesture Guide Below Camera */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {gestures.map((gesture) => (
                  <div
                    key={gesture.id}
                    className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{gesture.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`${gesture.color} font-semibold text-xs truncate`}
                        >
                          {gesture.name}
                        </p>
                        <p className="text-gray-400 text-[10px] leading-tight">
                          {gesture.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Section: Instructions */}
        {!started && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 md:px-12">
              {gestures.map((gesture) => (
                <GestureCard key={gesture.id} gesture={gesture} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section: Action & Footer */}
        {!started && (
          <div className="mt-16 pb-8 flex flex-col items-center gap-8">
            {/* Main Button */}
            <button
              onClick={handleStart}
              className="
                relative group overflow-hidden rounded-full px-12 py-5
                bg-gradient-to-r from-red-700 to-xmas-red
                border-2 border-xmas-gold
                shadow-[0_0_40px_rgba(212,36,38,0.6)]
                hover:shadow-[0_0_60px_rgba(248,178,41,0.6)]
                transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0
              "
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 group-hover:translate-y-[-150%] transition-transform duration-700 ease-in-out"></div>

              <div className="relative flex items-center gap-4 text-white font-bold text-xl md:text-2xl tracking-widest uppercase">
                <span className="text-3xl filter drop-shadow-lg">🎅</span>
                <span>Start Magic</span>
                <span className="text-3xl filter drop-shadow-lg">✨</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Decorative side lights */}
      <div className="fixed left-0 top-0 h-full w-20 bg-gradient-to-r from-xmas-red/5 to-transparent pointer-events-none"></div>
      <div className="fixed right-0 top-0 h-full w-20 bg-gradient-to-l from-xmas-green/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default App;
