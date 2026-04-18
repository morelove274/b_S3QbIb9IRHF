import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Mic, 
  Send, 
  Volume2, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Zap,
  Clock,
  Info,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { SPEAKING_TOPICS } from './StudyData';
import { useStudy } from '../../contexts/StudyContext';

export default function AISpeakingPage() {
  const navigate = useNavigate();
  const { updateModuleProgress, updateFocusTime } = useStudy();
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [startTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    window.speechSynthesis.speak(utterance);
  };

  const startConversation = async (topic: any) => {
    setSelectedTopic(topic);
    setIsThinking(true);
    
    const prompt = `You are a professional IELTS Speaking Examiner. 
    We are practicing ${topic.part}: ${topic.title}.
    Please start the interview by introducing yourself briefly and asking the first question from this list: ${topic.questions?.join(', ') || topic.cueCard?.join(', ')}.
    Keep your tone formal, professional, and encouraging.`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });
      const aiText = result.text || "";
      setMessages([{ role: 'ai', content: aiText }]);
      speak(aiText);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([{ role: 'ai', content: "Hello! I am your AI Speaking Coach. I am ready to help you practice your IELTS speaking skills. Shall we start with the first topic?" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    window.speechSynthesis.cancel();
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsThinking(true);

    const history = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Examiner'}: ${m.content}`).join('\n');
    const prompt = `You are a professional IELTS Speaking Examiner. 
    Current Topic: ${selectedTopic.title} (${selectedTopic.part}).
    Conversation History:
    ${history}
    
    Candidate just said: "${userMsg}"
    
    Please respond as the examiner. You can:
    1. Acknowledge their answer briefly.
    2. Ask a follow-up question related to their answer or move to the next question in the topic.
    
    Keep your response concise and natural.`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });
      const aiText = result.text || "";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
      speak(aiText);
      updateModuleProgress('speaking', 1);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    const simulatedText = "Actually, I believe that technology has a profound impact on our daily lives. For instance, smartphones have revolutionized the way we communicate.";
    setInput(simulatedText);
  };

  if (!selectedTopic) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black font-headline">AI 口语教练话题选择</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SPEAKING_TOPICS.map((topic, idx) => (
            <div 
              key={idx} 
              onClick={() => startConversation(topic)}
              className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">{topic.part}</span>
                <MessageSquare className="w-6 h-6 text-primary opacity-40 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black mb-2">{topic.title}</h3>
              <p className="text-sm text-on-surface-variant font-medium">点击开启 AI 实时对话模拟</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black font-headline">{selectedTopic.title}</h2>
            <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">{selectedTopic.part} · AI 实时对练</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 shadow-xl overflow-hidden flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-6 rounded-3xl relative ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container-low text-on-surface rounded-tl-none'}`}>
                <p className="leading-relaxed font-medium">{m.content}</p>
                {m.role === 'ai' && (
                  <button onClick={() => speak(m.content)} className="absolute -right-12 top-2 p-2 text-primary hover:bg-primary/5 rounded-full transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-surface-container-low p-6 rounded-3xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm font-bold text-on-surface-variant">AI 考官正在思考...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-8 bg-surface-container-low/30 border-t border-outline-variant/10">
          <div className="flex gap-4">
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-surface-container-high text-on-surface'}`}
            >
              <Mic className="w-6 h-6" />
              {isRecording ? `录音中 ${recordingTime}s` : '语音输入'}
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="在此输入或录入你的回答..."
                className="w-full px-6 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:scale-105 disabled:opacity-50 transition-all"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h4 className="font-bold text-sm">对话轮数</h4>
          </div>
          <p className="text-3xl font-black">{messages.length} <span className="text-xs font-bold text-slate-400">ROUNDS</span></p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-sm">互动时长</h4>
          </div>
          <p className="text-3xl font-black">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')} <span className="text-xs font-bold text-slate-400">MINS</span></p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h4 className="font-bold text-sm">今日累计</h4>
          </div>
          <p className="text-3xl font-black">+{Math.ceil(sessionDuration / 60)} <span className="text-xs font-bold text-slate-400">FOCUS</span></p>
        </div>
      </div>
    </motion.div>
  );
}
