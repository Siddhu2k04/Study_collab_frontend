import { io } from 'socket.io-client';

const getSocketURL = () => {
  const env = import.meta.env.VITE_API_URL;
  if (env) {
    return env.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1'
      ? 'http://localhost:5000'
      : 'https://study-collab-backend.onrender.com';
  }
  return 'https://study-collab-backend.onrender.com';
};

const URL = getSocketURL();

export const socket = io(URL, {
  autoConnect: false,
});
