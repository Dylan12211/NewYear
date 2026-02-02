import React, { useEffect, useRef } from "react";
import { Camera } from "lucide-react";

interface CameraFeedProps {
  onVideoReady?: (video: HTMLVideoElement) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onVideoReady, canvasRef }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user",
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Đợi video thực sự playing trước khi callback
          videoRef.current.onloadedmetadata = async () => {
            if (videoRef.current) {
              try {
                await videoRef.current.play();
                console.log("▶️ Video playing");

                // Đợi thêm một chút để đảm bảo frame đầu tiên đã có
                setTimeout(() => {
                  if (videoRef.current && onVideoReady) {
                    console.log(
                      "📹 Video ready:",
                      videoRef.current.videoWidth,
                      "x",
                      videoRef.current.videoHeight,
                      "readyState:",
                      videoRef.current.readyState
                    );
                    onVideoReady(videoRef.current);
                  }
                }, 200);
              } catch (err) {
                console.error("❌ Error playing video:", err);
              }
            }
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onVideoReady]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-4 border-xmas-gold/50 shadow-[0_0_20px_rgba(248,178,41,0.3)] bg-black/60 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 bg-black/50 p-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xmas-gold text-xs font-bold uppercase tracking-wider">
          <Camera size={14} />
          <span>Camera</span>
        </div>
      </div>

      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="w-full h-full object-cover transform -scale-x-100"
      />

      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-xmas-gold/70 rounded-br-sm"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-xmas-gold/70 rounded-bl-sm"></div>
    </div>
  );
};

export default CameraFeed;
