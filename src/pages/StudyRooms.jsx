import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, LogIn, Loader2 } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StudyRooms = () => {
  const { user } = useContext(AuthContext);
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!user || !token) {
      setError('You must be logged in to create a room.');
      setIsCreating(false);
      return;
    }
    try {
      const res = await api.post('/rooms/create', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCreatedRoomCode(res.data.room.room_code);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to create room');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setIsJoining(true);
    setError('');
    try {
      const res = await api.post('/rooms/join', { room_code: roomCode.toUpperCase() });
      navigate(`/room/${res.data.room.room_code}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Study Rooms</h1>
        <p className="text-gray-400">Join or create a room to study with others.</p>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Room Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-6"
        >
          {createdRoomCode ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <Plus className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Room Created!</h2>
                <p className="text-gray-400">Share this code with your friends.</p>
              </div>
              <div className="bg-surface border border-white/10 rounded-lg py-4 px-8 text-3xl tracking-[0.5em] text-white font-mono shadow-inner">
                {createdRoomCode}
              </div>
              <button
                onClick={() => navigate(`/room/${createdRoomCode}`)}
                className="w-full py-3 px-6 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex justify-center mt-4"
              >
                Join Now
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Create a Room</h2>
                <p className="text-gray-400">Start a new study session and invite your friends with a unique code.</p>
              </div>
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full py-3 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex justify-center"
              >
                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create New Room'}
              </button>
            </>
          )}
        </motion.div>

        {/* Join Room Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-neon/20 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-neon" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Join a Room</h2>
            <p className="text-gray-400">Enter a 6-digit room code to join an existing study session.</p>
          </div>
          <form onSubmit={handleJoinRoom} className="w-full space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full bg-surface border border-white/10 rounded-lg py-3 px-4 text-center text-xl tracking-widest text-white placeholder-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors uppercase"
            />
            <button
              type="submit"
              disabled={isJoining || roomCode.length < 6}
              className="w-full py-3 px-6 rounded-lg bg-neon hover:bg-neon/90 text-black font-semibold transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Room'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudyRooms;
