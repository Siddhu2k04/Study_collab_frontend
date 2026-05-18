import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, User as UserIcon } from 'lucide-react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';

const Chat = ({ roomCode }) => {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !roomCode) return;

    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket, roomCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('send_message', {
      room_id: roomCode,
      user_id: user.id,
      message: newMessage
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-white">Live Chat</h3>
        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Online</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = String(msg.user_id) === String(user?.id);
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-white/10 text-gray-200 rounded-bl-sm'}`}>
                {!isMe && <div className="text-xs text-primary mb-1 font-medium">{msg.username}</div>}
                <div className="text-sm">{msg.message}</div>
                <div className="text-[10px] text-white/50 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-surface border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="p-2 bg-primary rounded-full text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
