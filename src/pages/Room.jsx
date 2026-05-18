import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Users, Share2, Check, FileText, Video, Edit3, MessageSquare, ChevronDown } from 'lucide-react';
import Chat from '../components/Chat';
import Notes from '../components/Notes';
import VideoPlayer from '../components/VideoPlayer';
import PDFViewer from '../components/PDFViewer';
import PomodoroTimer from '../components/PomodoroTimer';

const Room = () => {
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [activeTab, setActiveTab] = useState('pdf');
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    socket.emit('join_room', {
      room_id: roomId,
      user_id: user.id,
      username: user.username
    });

    socket.on('user_joined', (data) => {
      setParticipants((prev) => {
        if (!prev.find(p => p.user_id === data.user_id)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    socket.on('user_left', (data) => {
      setParticipants((prev) => prev.filter(p => p.username !== data.username));
    });

    socket.on('room_state_sync', (state) => {
      if (state.participants) {
        setParticipants(state.participants.filter(p => String(p.user_id) !== String(user?.id)));
      }
    });

    return () => {
      socket.emit('leave_room', {
        room_id: roomId,
        username: user.username
      });
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('room_state_sync');
    };
  }, [socket, roomId, user]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'pdf', label: 'PDF Viewer', icon: FileText, color: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-500/20' },
    { id: 'video', label: 'Video', icon: Video, color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/20' },
    { id: 'notes', label: 'Notes', icon: Edit3, color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-500/20' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, color: 'text-green-400', border: 'border-green-500', bg: 'bg-green-500/20' }
  ];

  return (
    <div className="h-screen flex flex-col bg-background text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-white/10 glass flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rooms')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg flex items-center gap-2">
              Study Room <span className="text-primary tracking-widest">{roomId}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <PomodoroTimer roomCode={roomId} />
          
          <div className="flex items-center gap-2 text-sm text-gray-400 border-l border-white/10 pl-6 relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:text-white transition-colors focus:outline-none bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px]">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-white">{user?.username}</span>
              {participants.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                  +{participants.length}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full right-0 mt-4 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/10 mb-2">
                  Participants
                </div>
                <div className="px-4 py-2 text-sm text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {user?.username} (You)
                </div>
                {participants.map((p, idx) => (
                  <div key={idx} className="px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {p.username}
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={handleShare}
              className="ml-2 p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />} 
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black/40 border-b border-white/10 flex px-4 pt-2 gap-2 overflow-x-auto shrink-0 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all font-medium border-b-2 ${
              activeTab === tab.id 
                ? `${tab.bg} ${tab.border} text-white` 
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area (Tabbed) */}
      <div className="flex-1 p-4 bg-black/40 overflow-hidden relative">
        <div className={`absolute inset-4 transition-opacity duration-300 ${activeTab === 'pdf' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <PDFViewer roomCode={roomId} />
        </div>
        <div className={`absolute inset-4 transition-opacity duration-300 ${activeTab === 'video' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <VideoPlayer roomCode={roomId} />
        </div>
        <div className={`absolute inset-4 transition-opacity duration-300 ${activeTab === 'notes' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <Notes roomCode={roomId} />
        </div>
        <div className={`absolute inset-4 transition-opacity duration-300 ${activeTab === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <Chat roomCode={roomId} />
        </div>
      </div>
    </div>
  );
};

export default Room;
