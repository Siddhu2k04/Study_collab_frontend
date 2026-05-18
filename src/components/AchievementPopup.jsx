import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { SocketContext } from '../context/SocketContext';
import { Award, Target, Flame } from 'lucide-react';

const icons = {
  Award: <Award className="w-8 h-8 text-yellow-400" />,
  Target: <Target className="w-8 h-8 text-primary" />,
  Flame: <Flame className="w-8 h-8 text-orange-500" />
};

const AchievementPopup = () => {
  const socket = useContext(SocketContext);
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('achievement_unlocked', (data) => {
      setAchievements((prev) => [...prev, ...data.achievements]);
      setShowConfetti(true);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setAchievements((prev) => prev.slice(data.achievements.length));
      }, 5000);

      // Stop confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    });

    return () => {
      socket.off('achievement_unlocked');
    };
  }, [socket]);

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={false}
            numberOfPieces={500}
          />
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {achievements.map((ach, idx) => (
            <motion.div
              key={`${ach.name}-${idx}`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-surface border border-white/20 shadow-[0_0_30px_rgba(255,215,0,0.3)] rounded-2xl p-4 flex items-center gap-4 backdrop-blur-xl w-80 pointer-events-auto"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                {icons[ach.icon] || icons['Award']}
              </div>
              <div>
                <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">Achievement Unlocked!</p>
                <h4 className="text-white font-bold text-lg leading-tight">{ach.name}</h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AchievementPopup;
