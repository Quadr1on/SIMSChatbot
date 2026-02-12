"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Languages, Mic, Send, MoreVertical, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotInterface = () => {
  const [language, setLanguage] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [fontSize, setFontSize] = useState('medium');
  const [showMenu, setShowMenu] = useState(false);
  const chatEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    if (language && messages.length === 0) {
      const greeting = getGreeting();
      setTimeout(() => {
        setMessages([
          {
            type: 'bot',
            text: `${greeting}! I'm SIMS Assistant. How can I help you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
    }
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        type: 'user',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'I understand. Let me help you with that.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      'doctor': 'I would like to check doctor availability',
      'appointment': 'I want to book an appointment',
      'diagnosis': 'I need a quick diagnosis'
    };

    const newMessage = {
      type: 'user',
      text: actionMessages[action],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      let botResponse = '';
      if (action === 'diagnosis') {
        botResponse = 'I\'ll help you with a quick diagnosis. May I have your name please?';
      } else {
        botResponse = 'Let me help you with that. Please provide more details.';
      }
      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  const toggleVoiceMode = () => {
    if (!isVoiceMode) {
      setIsVoiceMode(true);
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setIsVoiceMode(false);
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
      // Simulate voice to text
      setTimeout(() => {
        const voiceMessage = {
          type: 'user',
          text: 'Voice message converted to text',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, voiceMessage]);
      }, 300);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }
    return () => stopAudioCapture();
  }, [isRecording]);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
      setIsRecording(false);
      setIsVoiceMode(false);
    }
  };

  const stopAudioCapture = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      const stream = microphoneRef.current.mediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    audioContextRef.current = null;
    analyserRef.current = null;
    microphoneRef.current = null;
    setAudioLevel(0);
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  if (!language) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} style={{ fontFamily: 'Spline Sans, sans-serif' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          <h1 className={`text-4xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Welcome! Pick a Language
          </h1>
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage('english')}
              className={`w-full p-6 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:border-[#2472de] bg-gray-900' 
                  : 'border-gray-200 hover:border-[#2472de] bg-gray-50'
              }`}
            >
              <Languages className={theme === 'dark' ? 'text-white' : 'text-black'} size={24} />
              <span className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>English</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage('tamil')}
              className={`w-full p-6 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:border-[#2472de] bg-gray-900' 
                  : 'border-gray-200 hover:border-[#2472de] bg-gray-50'
              }`}
            >
              <span className="text-2xl">த</span>
              <span className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>தமிழ்</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`} style={{ fontFamily: 'Spline Sans, sans-serif' }}>
      {/* Voice Mode Overlay */}
      <AnimatePresence>
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            onClick={toggleVoiceMode}
            style={{
              background: `linear-gradient(to bottom, 
                transparent 0%, 
                transparent 75%, 
                ${theme === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.95)'} 100%)`
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 pb-32 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center gap-6"
              >
                {/* Pulsing Circles */}
                <div className="relative flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-gradient-to-b from-[#2472de] to-[#1a5bb8]"
                      style={{
                        width: 120 + (audioLevel * 60 * (i + 1)),
                        height: 120 + (audioLevel * 60 * (i + 1)),
                      }}
                      animate={{
                        opacity: [0.4 - (i * 0.1), 0.1, 0.4 - (i * 0.1)],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Center Mic Button */}
                  <motion.div
                    animate={{
                      scale: 1 + (audioLevel * 0.3),
                    }}
                    transition={{
                      duration: 0.1,
                      ease: "easeOut"
                    }}
                    className="relative z-10 w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl"
                  >
                    <Mic className="text-[#2472de]" size={48} />
                  </motion.div>
                </div>

                {/* Recording Time */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-medium text-white"
                >
                  {formatTime(recordingTime)}
                </motion.div>

                {/* Instruction Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-gray-300"
                >
                  <p className="text-lg">Listening...</p>
                  <p className="text-sm mt-2 text-gray-400">Tap anywhere to stop</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        >
          SIMS Assistant
        </motion.h2>
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}
          >
            <MoreVertical className={theme === 'dark' ? 'text-white' : 'text-black'} size={20} />
          </motion.button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-white border-gray-200'
                } p-2 z-50`}
              >
                <div className={`px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Font Size
                </div>
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSize(size);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      fontSize === size 
                        ? 'bg-gradient-to-b from-[#2472de] to-[#1a5bb8] text-white' 
                        : theme === 'dark'
                        ? 'hover:bg-gray-800 text-white'
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <MessageSquare className={theme === 'dark' ? 'text-white' : 'text-black'} size={16} />
                </div>
              )}
              <div className={`max-w-[75%] ${fontSizeClasses[fontSize]}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'bot'
                      ? theme === 'dark'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-black'
                      : 'bg-gradient-to-b from-[#2472de] to-[#1a5bb8] text-white'
                  }`}
                >
                  {message.text}
                </div>
                <div className={`text-xs mt-1 px-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {message.time}
                </div>
              </div>
              {message.type === 'user' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <User className={theme === 'dark' ? 'text-white' : 'text-black'} size={16} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center mt-4"
          >
            {[
              { id: 'doctor', label: 'Doctor Availability' },
              { id: 'appointment', label: 'Book Appointment' },
              { id: 'diagnosis', label: 'Quick Diagnosis' }
            ].map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-800'
                    : 'bg-white text-black hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
        <div className={`flex items-center gap-2 rounded-2xl px-4 py-2 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className={`flex-1 bg-transparent outline-none ${theme === 'dark' ? 'text-white' : 'text-black'}`}
          />
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="text-white" size={18} /> : <Moon className="text-black" size={18} />}
          </button>
          <button
            onClick={() => setLanguage(null)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Languages className={theme === 'dark' ? 'text-white' : 'text-black'} size={18} />
          </button>
          <button
            onClick={toggleVoiceMode}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Mic className={theme === 'dark' ? 'text-white' : 'text-black'} size={18} />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`p-2 rounded-lg bg-gradient-to-b from-[#2472de] to-[#1a5bb8] ${!inputText.trim() ? 'opacity-50' : ''}`}
          >
            <Send className="text-white" size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;