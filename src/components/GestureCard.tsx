import React from "react";
import { Gesture } from "../types";

interface GestureCardProps {
  gesture: Gesture;
}

const GestureCard: React.FC<GestureCardProps> = ({ gesture }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border-2 border-xmas-gold/30 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:border-xmas-gold hover:shadow-[0_0_30px_rgba(248,178,41,0.3)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-xmas-gold/20 rounded-full blur-xl group-hover:bg-xmas-gold/40 transition-all duration-300"></div>
      <div className="text-6xl mb-4 relative z-10 drop-shadow-md">
        {gesture.icon}
      </div>
      <h3 className="text-xl font-bold text-xmas-gold mb-2 uppercase tracking-wide group-hover:text-amber-300 transition-colors">
        {gesture.name}
      </h3>
      <p className="text-gray-200 text-sm font-medium leading-relaxed">
        {gesture.description}
      </p>
    </div>
  );
};

export default GestureCard;
