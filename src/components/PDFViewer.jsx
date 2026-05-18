import React, { useState, useEffect, useContext } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { SocketContext } from '../context/SocketContext';
import { FileText, ChevronLeft, ChevronRight, Upload, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import api from '../services/api';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

const PDFViewer = ({ roomCode }) => {
  const socket = useContext(SocketContext);
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!socket || !roomCode) return;

    socket.on('sync_page', (data) => {
      setPageNumber(data.page);
    });

    socket.on('sync_zoom', (data) => {
      setScale(data.zoom);
    });

    socket.on('sync_pdf_url', (data) => {
      setFile(data.url);
    });

    socket.on('room_state_sync', (state) => {
      if (state.pdf_url) setFile(state.pdf_url);
      if (state.pdf_page) setPageNumber(state.pdf_page);
      if (state.pdf_zoom) setScale(state.pdf_zoom);
    });

    return () => {
      socket.off('sync_page');
      socket.off('sync_zoom');
      socket.off('sync_pdf_url');
      socket.off('room_state_sync');
    };
  }, [socket, roomCode]);

  const onFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      try {
        const res = await api.post('/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const url = res.data.url;
        const fullUrl = `${BACKEND_URL}${url}`;
        setFile(fullUrl);
        socket.emit('pdf_uploaded', { room_id: roomCode, url: fullUrl });
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload PDF. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      socket.emit('page_change', { room_id: roomCode, page: newPage });
    }
  };

  const changeZoom = (amount) => {
    const newScale = Math.max(0.5, Math.min(3.0, scale + amount));
    setScale(newScale);
    socket.emit('zoom_change', { room_id: roomCode, zoom: newScale });
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">PDF Viewer</h3>
        </div>

        {file && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setFile(null);
                socket.emit('pdf_uploaded', { room_id: roomCode, url: '' });
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors hidden md:block"
            >
              Change PDF
            </button>
            <div className="flex items-center bg-black/20 rounded-lg p-1">
              <button onClick={() => changeZoom(-0.2)} className="p-1 hover:bg-white/10 rounded"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-xs px-2">{Math.round(scale * 100)}%</span>
              <button onClick={() => changeZoom(0.2)} className="p-1 hover:bg-white/10 rounded"><ZoomIn className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center bg-black/20 rounded-lg p-1">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
              ><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs px-2">Page {pageNumber} of {numPages || '--'}</span>
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= numPages}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
              ><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto bg-black/20 relative flex items-start justify-center p-4">
        {!file ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                <p className="text-gray-400">Uploading and syncing PDF...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-400 mb-6">Upload a PDF to view together</p>
                <label className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors font-medium">
                  Choose PDF File
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>
              </>
            )}
          </div>
        ) : (
          <div className="relative h-full flex flex-col w-full items-center">
            <button
              onClick={() => {
                setFile(null);
                socket.emit('pdf_uploaded', { room_id: roomCode, url: '' });
              }}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/80 text-white px-3 py-1 rounded-full text-xs transition-colors backdrop-blur-sm md:hidden"
            >
              Change PDF
            </button>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-gray-400 mt-10">Loading PDF...</div>}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-2xl"
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
