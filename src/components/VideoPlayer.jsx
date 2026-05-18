import React, { useState, useEffect, useContext, useRef } from 'react';
import YouTube from 'react-youtube';
import { SocketContext } from '../context/SocketContext';
import { Video, Search } from 'lucide-react';

const VideoPlayer = ({ roomCode }) => {
  const socket = useContext(SocketContext);
  const [videoId, setVideoId] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const playerRef = useRef(null);
  const ignoreNextEvent = useRef(false);
  const initialVideoState = useRef(null);

  useEffect(() => {
    if (!socket || !roomCode) return;

    socket.on('sync_video_play', (data) => {
      ignoreNextEvent.current = true;
      if (playerRef.current) {
        playerRef.current.seekTo(data.time);
        playerRef.current.playVideo();
      }
    });

    socket.on('sync_video_pause', (data) => {
      ignoreNextEvent.current = true;
      if (playerRef.current) {
        playerRef.current.pauseVideo();
      }
    });

    socket.on('sync_video_seek', (data) => {
      ignoreNextEvent.current = true;
      if (playerRef.current) {
        playerRef.current.seekTo(data.time);
      }
    });

    socket.on('sync_video_change', (data) => {
      setVideoId(data.video_id);
    });

    socket.on('room_state_sync', (state) => {
      if (state.video_id) {
        setVideoId(state.video_id);
        if (state.video_time !== undefined) {
          initialVideoState.current = {
            time: state.video_time,
            playing: state.video_playing
          };
        }
      }
    });

    return () => {
      socket.off('sync_video_play');
      socket.off('sync_video_pause');
      socket.off('sync_video_seek');
      socket.off('sync_video_change');
      socket.off('room_state_sync');
    };
  }, [socket, roomCode]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleLoadVideo = (e) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (id) {
      setVideoId(id);
      setInputUrl('');
      socket.emit('video_change', { room_id: roomCode, video_id: id });
    }
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    if (initialVideoState.current) {
      ignoreNextEvent.current = true;
      event.target.seekTo(initialVideoState.current.time);
      if (initialVideoState.current.playing) {
        event.target.playVideo();
      }
      initialVideoState.current = null;
    }
  };

  const onPlay = (event) => {
    if (ignoreNextEvent.current) {
      ignoreNextEvent.current = false;
      return;
    }
    socket.emit('video_play', {
      room_id: roomCode,
      time: event.target.getCurrentTime()
    });
  };

  const onPause = (event) => {
    if (ignoreNextEvent.current) {
      ignoreNextEvent.current = false;
      return;
    }
    socket.emit('video_pause', {
      room_id: roomCode,
      time: event.target.getCurrentTime()
    });
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-white">Synced YouTube</h3>
        </div>
      </div>

      {!videoId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-6">Paste a YouTube link to watch together</p>
          <form onSubmit={handleLoadVideo} className="w-full max-w-sm flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Load
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 bg-black relative">
          <button
            onClick={() => {
              setVideoId('');
              socket.emit('video_change', { room_id: roomCode, video_id: '' });
            }}
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/80 text-white px-3 py-1 rounded-full text-xs transition-colors backdrop-blur-sm"
          >
            Change Video
          </button>
          <div className="absolute inset-0">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              onPlay={onPlay}
              onPause={onPause}
              className="h-full w-full"
              iframeClassName="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
