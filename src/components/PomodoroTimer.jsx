import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { Play, Pause, RefreshCw, Coffee, Focus } from 'lucide-react';

const PomodoroTimer = ({ roomCode }) => {
  const socket = useContext(SocketContext);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // focus or break
  const timerRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!socket || !roomCode) return;

    socket.on('sync_timer_start', (data) => {
      setMode(data.mode);
      setTimeLeft(data.duration);
      setIsRunning(true);
    });

    socket.on('sync_timer_pause', (data) => {
      setTimeLeft(data.time_left);
      setIsRunning(false);
    });

    socket.on('sync_timer_complete', () => {
      setIsRunning(false);
      // Play sound or notification
    });

    socket.on('room_state_sync', (state) => {
      if (state.timer) {
        setMode(state.timer.mode);
        if (state.timer.running && state.timer.started_at) {
          const startedAt = new Date(state.timer.started_at).getTime();
          const now = new Date().getTime();
          const diffSeconds = Math.floor((now - startedAt) / 1000);
          const remaining = state.timer.duration - diffSeconds;
          if (remaining > 0) {
            setTimeLeft(remaining);
            setIsRunning(true);
          } else {
            setTimeLeft(0);
            setIsRunning(false);
          }
        } else {
          setTimeLeft(state.timer.time_left !== undefined ? state.timer.time_left : state.timer.duration);
          setIsRunning(false);
        }
      }
    });

    return () => {
      socket.off('sync_timer_start');
      socket.off('sync_timer_pause');
      socket.off('sync_timer_complete');
      socket.off('room_state_sync');
    };
  }, [socket, roomCode]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            if (socket && roomCode && user) {
              const totalDuration = mode === 'focus' ? 25 * 60 : 5 * 60;
              socket.emit('timer_complete', { room_id: roomCode, user_id: user.id, duration: totalDuration });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, socket, roomCode]);

  const toggleTimer = () => {
    if (isRunning) {
      socket.emit('timer_pause', { room_id: roomCode, time_left: timeLeft });
      setIsRunning(false);
    } else {
      socket.emit('timer_start', { room_id: roomCode, mode, duration: timeLeft });
      setIsRunning(true);
    }
  };

  const resetTimer = (newMode) => {
    const duration = newMode === 'focus' ? 25 * 60 : 5 * 60;
    setMode(newMode);
    setTimeLeft(duration);
    setIsRunning(false);
    socket.emit('timer_pause', { room_id: roomCode, time_left: duration });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="flex items-center gap-4 bg-surface border border-white/10 px-4 py-2 rounded-xl text-white shadow-lg relative overflow-hidden">
      {/* Background Progress Bar */}
      <div 
        className={`absolute top-0 left-0 bottom-0 ${mode === 'focus' ? 'bg-primary/20' : 'bg-green-500/20'} transition-all duration-1000 ease-linear pointer-events-none`} 
        style={{ width: `${progress}%` }}
      />
      
      <div className="relative z-10 flex gap-2">
        <button 
          onClick={() => resetTimer('focus')}
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${mode === 'focus' ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-400'}`}
        >
          {/* Using a standard lucide icon as Focus doesn't exist */}
          <div className="w-3 h-3 rounded-full bg-current" /> Focus
        </button>
        <button 
          onClick={() => resetTimer('break')}
          className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${mode === 'break' ? 'bg-green-500 text-white' : 'hover:bg-white/10 text-gray-400'}`}
        >
          <Coffee className="w-3 h-3" /> Break
        </button>
      </div>

      <div className="text-2xl font-mono font-bold w-20 text-center tracking-widest relative z-10">
        {formatTime(timeLeft)}
      </div>

      <div className="relative z-10 flex gap-1">
        <button 
          onClick={toggleTimer}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button 
          onClick={() => resetTimer(mode)}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
