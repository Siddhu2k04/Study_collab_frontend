import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { Edit3 } from 'lucide-react';

const Notes = ({ roomCode }) => {
  const socket = useContext(SocketContext);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!socket || !roomCode) return;

    socket.on('sync_note', (data) => {
      setContent(data.content);
    });

    socket.on('room_state_sync', (state) => {
      if (state.note_content) {
        setContent(state.note_content);
      }
    });

    return () => {
      socket.off('sync_note');
      socket.off('room_state_sync');
    };
  }, [socket, roomCode]);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);

    if (socket && roomCode) {
      socket.emit('note_update', {
        room_id: roomCode,
        content: value
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-lg notes-container">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <Edit3 className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold text-white">Shared Notes</h3>
      </div>

      <div className="flex-1 bg-black/20 p-4 relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Start typing your shared notes here..."
          className="w-full h-full bg-transparent text-white resize-none focus:outline-none placeholder-gray-500 font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default Notes;
