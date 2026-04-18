import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  SpellCheck, 
  Headphones, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Trophy, 
  Home, 
  FileText, 
  Mic, 
  Edit, 
  Download, 
  ChevronLeft,
  Search,
  ExternalLink,
  Star,
  Play,
  ArrowRight,
  RotateCcw,
  Info,
  Volume2,
  ClipboardCheck,
  History,
  Clock,
  AlertCircle,
  TrendingUp,
  Zap,
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  Loader2,
  Square,
  Flame,
  Settings,
  Bell,
  VolumeX,
  Lock,
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  VOCAB_DATA, 
  LISTENING_RESOURCES, 
  READING_TECHNIQUES, 
  WRITING_SAMPLES,
  SPEAKING_TOPICS,
  AI_SPEAKING_TOPICS,
  MOCK_EXAMS,
  REVIEW_DATA,
  STUDY_MODULES,
  CAMBRIDGE_LIBRARY,
  DICTATION_DATA,
  DICTATION_SENTENCES
} from './study/StudyData';

import { useStudy } from '../contexts/StudyContext';

// --- Sub-Components ---

function MockExamView({ onBack }: { onBack: () => void }) {
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  React.useEffect(() => {
    if (selectedTest && timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [selectedTest, timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Simple mock scoring logic
    const correctCount = Object.keys(answers).length;
    const mockScore = Math.min(9, 4 + (correctCount * 0.5));
    setScore(mockScore);
  };

  if (!selectedTest) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black font-headline">真题模考中心</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAMBRIDGE_LIBRARY.map(book => (
            <div key={book.id} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-black text-lg">{book.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {book.tests.map(test => (
                  <button 
                    key={test.id}
                    onClick={() => setSelectedTest(test)}
                    className="py-3 bg-surface-container-low hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all border border-outline-variant/5"
                  >
                    {test.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-12">
        <div className="bg-surface-container-lowest p-12 rounded-[3rem] border border-outline-variant/10 shadow-2xl text-center space-y-8">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black font-headline">模考完成！</h2>
          <p className="text-on-surface-variant font-medium">恭喜你完成了 {selectedTest.title} 的全真模拟测试。</p>
          
          <div className="grid grid-cols-2 gap-8 py-8">
            <div className="bg-surface-container-low p-8 rounded-3xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">预估分数</p>
              <p className="text-5xl font-black text-primary">{score?.toFixed(1)}</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">用时</p>
              <p className="text-5xl font-black text-on-surface">{formatTime(3600 - timeLeft)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={onBack} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all">返回学习中心</button>
            <button className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-black hover:bg-surface-container-highest transition-all">查看详细解析</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-outline-variant/10 px-8 flex items-center justify-between bg-white">
        <div className="flex items-center gap-6">
          <button onClick={() => setSelectedTest(null)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-black text-xl">{selectedTest.title} - Mock Exam</h2>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Cambridge IELTS</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-6 py-2 bg-red-50 text-red-600 rounded-full border border-red-100">
            <Clock className="w-5 h-5" />
            <span className="font-black font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-primary text-white rounded-xl font-black shadow-lg hover:scale-105 transition-all"
          >
            提交试卷
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-outline-variant/10 p-6 space-y-2 bg-surface-container-low/30">
          {(['listening', 'reading', 'writing', 'speaking'] as const).map(section => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`w-full p-4 rounded-2xl text-left font-bold transition-all flex items-center justify-between ${currentSection === section ? 'bg-primary text-white shadow-md' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
            >
              <span className="capitalize">{section}</span>
              {currentSection === section && <ArrowRight className="w-4 h-4" />}
            </button>
          ))}
        </aside>

        {/* Question Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-black font-headline capitalize">{currentSection} Section</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {currentSection === 'listening' && "You will hear a number of different recordings and you will have to answer questions on what you hear."}
                {currentSection === 'reading' && "Read the passage below and answer the questions that follow."}
                {currentSection === 'writing' && "You should spend about 20 minutes on this task. Write at least 150 words."}
                {currentSection === 'speaking' && "This part of the test consists of an interview with an examiner."}
              </p>
            </div>

            {/* Mock Questions */}
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-8 bg-surface-container-low/50 rounded-[2rem] border border-outline-variant/5 space-y-4">
                  <p className="font-bold text-lg">Question {i}: What is the main purpose of the lecture?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {['A. To explain a theory', 'B. To provide evidence', 'C. To challenge a belief', 'D. To summarize a study'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setAnswers(prev => ({ ...prev, [`${currentSection}-${i}`]: opt }))}
                        className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${answers[`${currentSection}-${i}`] === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-outline-variant/10 hover:border-primary/30'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function AISpeakingView({ onBack }: { onBack: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    // Simulate speech-to-text
    const simulatedText = "In my opinion, having a hobby is essential for maintaining a healthy work-life balance. It allows us to disconnect from our daily stresses and engage in something we truly enjoy.";
    setInput(simulatedText);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  React.useEffect(() => {
    if (!selectedTopic) {
      window.speechSynthesis.cancel();
    }
  }, [selectedTopic]);

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
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      const aiText = response.text || "Hello, I am your IELTS Speaking Coach. Shall we begin?";
      setMessages([{ role: 'ai', content: aiText }]);
      speak(aiText);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([{ role: 'ai', content: "抱歉，AI 教练暂时无法连接。请检查网络或稍后再试。" }]);
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
    3. If it's Part 2, listen to their long turn and then ask one or two follow-up questions.
    
    Keep your response concise and natural.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      const aiText = response.text || "I see. Let's continue.";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
      speak(aiText);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const getFeedback = async () => {
    setIsThinking(true);
    const history = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Examiner'}: ${m.content}`).join('\n');
    const prompt = `As an expert IELTS Speaking Examiner, please provide a detailed evaluation of the candidate's performance based on this conversation:
    
    ${history}
    
    Please provide feedback in JSON format with the following structure:
    {
      "overallBand": number,
      "fluency": { "score": number, "comment": "string" },
      "vocabulary": { "score": number, "comment": "string" },
      "grammar": { "score": number, "comment": "string" },
      "coherence": { "score": number, "comment": "string" },
      "suggestions": ["string", "string"],
      "goodPoints": ["string", "string"]
    }
    
    The evaluation should be professional and accurate according to IELTS standards.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      setFeedback(data);
      setShowFeedback(true);
    } catch (error) {
      console.error("Feedback Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  if (selectedTopic) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-[calc(100vh-12rem)] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-black font-headline">{selectedTopic.title}</h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{selectedTopic.part} · AI 实时对练</p>
            </div>
          </div>
          <button 
            onClick={getFeedback}
            disabled={messages.length < 3 || isThinking}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> 结束并获取评分
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Chat Area */}
          <div className="flex-1 bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-3xl relative group ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/5'}`}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                    {m.role === 'ai' && (
                      <button 
                        onClick={() => speak(m.content)}
                        className="absolute -right-10 top-2 p-2 bg-surface-container-lowest border border-outline-variant/10 rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low p-5 rounded-3xl rounded-tl-none border border-outline-variant/5 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs font-bold text-on-surface-variant">AI 考官正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
                >
                  <Mic className="w-5 h-5" />
                  {isRecording ? `正在录音 ${recordingTime}s...` : '语音输入'}
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => {
                      if (e.target.value.length > 0 && input.length === 0) {
                        window.speechSynthesis.cancel();
                      }
                      setInput(e.target.value);
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="输入你的回答..."
                    className="w-full pl-6 pr-16 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:scale-105 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center text-on-surface-variant font-medium">
                提示：尽量提供详细的回答，使用连接词和丰富的词汇。
              </p>
            </div>
          </div>

          {/* Topic Info Sidebar */}
          <div className="w-80 space-y-6 hidden xl:block">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> 话题提示
              </h3>
              <div className="space-y-4">
                {selectedTopic.cueCard ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-on-surface-variant">Cue Card Points:</p>
                    <ul className="space-y-1">
                      {selectedTopic.cueCard.map((point: string, i: number) => (
                        <li key={i} className="text-xs text-on-surface flex items-start gap-2">
                          <span className="text-primary">•</span> {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-on-surface-variant">Key Questions:</p>
                    <ul className="space-y-1">
                      {selectedTopic.questions.map((q: string, i: number) => (
                        <li key={i} className="text-xs text-on-surface flex items-start gap-2">
                          <span className="text-primary">•</span> {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-black text-primary mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> 评分标准
              </h3>
              <ul className="space-y-2 text-[10px] text-on-surface-variant font-medium">
                <li>• Fluency and coherence</li>
                <li>• Lexical resource</li>
                <li>• Grammatical range and accuracy</li>
                <li>• Pronunciation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedback && feedback && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-on-surface/20 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-surface-container-lowest w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-10 overflow-y-auto space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-black font-headline mb-1">测评报告</h2>
                      <p className="text-on-surface-variant font-bold">IELTS Speaking AI Analysis</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-black text-primary">{feedback.overallBand}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Estimated Band</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: 'Fluency', data: feedback.fluency },
                      { label: 'Vocabulary', data: feedback.vocabulary },
                      { label: 'Grammar', data: feedback.grammar },
                      { label: 'Coherence', data: feedback.coherence },
                    ].map((item, i) => (
                      <div key={i} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/5">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-sm">{item.label}</span>
                          <span className="text-primary font-black">{item.data.score}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{item.data.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-black mb-4 flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" /> 表现亮点
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {feedback.goodPoints.map((p: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black mb-4 flex items-center gap-2 text-amber-600">
                        <Zap className="w-4 h-4" /> 改进建议
                      </h4>
                      <ul className="space-y-2">
                        {feedback.suggestions.map((s: string, i: number) => (
                          <li key={i} className="text-xs text-on-surface-variant flex items-start gap-2">
                            <span className="text-amber-500">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-surface-container-low border-t border-outline-variant/10 flex justify-end">
                  <button 
                    onClick={() => { setShowFeedback(false); setSelectedTopic(null); }}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
                  >
                    确认并返回
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">AI 口语教练</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {AI_SPEAKING_TOPICS.map((topic) => (
          <button 
            key={topic.id}
            onClick={() => startConversation(topic)}
            className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all text-left group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{topic.part}</span>
            </div>
            <h3 className="text-xl font-black mb-2">{topic.title}</h3>
            <p className="text-sm text-on-surface-variant mb-6">点击开始与 AI 考官进行 1-on-1 模拟面试练习。</p>
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              开始练习 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary shrink-0">
          <Bot className="w-12 h-12" />
        </div>
        <div>
          <h3 className="text-2xl font-black mb-3">关于 AI 口语教练</h3>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            我们的 AI 教练基于最新的语言模型，能够模拟真实的雅思口语面试场景。它不仅能与你对话，还能从流利度、词汇、语法和连贯性四个维度为你提供专业的测评报告和改进建议。
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2 text-xs font-bold text-on-surface"><CheckCircle2 className="w-4 h-4 text-green-500" /> 实时对话</span>
            <span className="flex items-center gap-2 text-xs font-bold text-on-surface"><CheckCircle2 className="w-4 h-4 text-green-500" /> 深度估分</span>
            <span className="flex items-center gap-2 text-xs font-bold text-on-surface"><CheckCircle2 className="w-4 h-4 text-green-500" /> 改进建议</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LibraryView({ onBack }: { onBack: () => void }) {
  const { updateModuleProgress } = useStudy();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<'listening' | 'reading' | 'writing' | 'speaking' | null>(null);

  const handleSectionComplete = () => {
    updateModuleProgress('library', 1);
  };

  if (selectedSection && selectedTest) {
    const content = selectedTest[selectedSection];
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelectedSection(null)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black font-headline">{selectedBook.title} - {selectedTest.title} - {selectedSection.toUpperCase()}</h2>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8">
          {selectedSection === 'listening' && (
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                <Volume2 className="w-8 h-8 text-primary" />
                <audio controls className="w-full">
                  <source src={content.audio} type="audio/mpeg" />
                </audio>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> 听力脚本</h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                  {content.script}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary" /> 题目与解析</h3>
                {content.questions.map((q: any, i: number) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm space-y-3">
                    <p className="font-bold">{q.q}</p>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" /> 答案: {q.a}
                    </div>
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-bold text-primary">解析:</span> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedSection === 'reading' && (
            <div className="space-y-8">
              {content.passages.map((p: any, i: number) => (
                <div key={i} className="space-y-6">
                  <h3 className="text-2xl font-black text-primary">{p.title}</h3>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-base leading-loose text-on-surface font-body whitespace-pre-wrap">
                    {p.content}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary" /> 题目与解析</h4>
                    {p.questions.map((q: any, j: number) => (
                      <div key={j} className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm space-y-3">
                        <p className="font-bold">{q.q}</p>
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" /> 答案: {q.a}
                        </div>
                        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="font-bold text-primary">解析:</span> {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSection === 'writing' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary">Task 1</h3>
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 italic text-sm">"{content.task1.prompt}"</div>
                <div className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">高分范文</h4>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{content.task1.sample}</p>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900">
                    <span className="font-bold">考官点评:</span> {content.task1.comments}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary">Task 2</h3>
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 italic text-sm">"{content.task2.prompt}"</div>
                <div className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">高分范文</h4>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{content.task2.sample}</p>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900">
                    <span className="font-bold">考官点评:</span> {content.task2.comments}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'speaking' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary">Part 1: {content.part1.topic}</h3>
                {content.part1.questions.map((q: any, i: number) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm space-y-3">
                    <p className="font-bold">Q: {q}</p>
                    <p className="text-sm italic text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="font-bold text-primary">参考答案:</span> "{content.part1.sample}"
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary">Part 2: {content.part2.topic}</h3>
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                  <h4 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Cue Card</h4>
                  <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
                    {content.part2.cue.map((c: any, i: number) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">参考范文</h4>
                  <p className="text-sm leading-relaxed text-on-surface-variant italic">"{content.part2.sample}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (selectedBook) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black font-headline">{selectedBook.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedBook.tests.map((test: any) => (
            <div key={test.id} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
              <h3 className="text-2xl font-black">{test.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setSelectedTest(test); setSelectedSection('listening'); }}
                  className="p-4 bg-blue-50 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Headphones className="w-4 h-4" /> Listening
                </button>
                <button 
                  onClick={() => { setSelectedTest(test); setSelectedSection('reading'); }}
                  className="p-4 bg-blue-50 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Reading
                </button>
                <button 
                  onClick={() => { setSelectedTest(test); setSelectedSection('writing'); }}
                  className="p-4 bg-blue-50 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Writing
                </button>
                <button 
                  onClick={() => { setSelectedTest(test); setSelectedSection('speaking'); }}
                  className="p-4 bg-blue-50 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" /> Speaking
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">剑桥雅思真题库 (1-18)</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CAMBRIDGE_LIBRARY.map((book) => (
          <button 
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group"
          >
            <div className="w-16 h-20 bg-gradient-to-br from-primary to-primary-container rounded-lg shadow-lg flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
              {book.id.replace('c', '')}
            </div>
            <span className="text-xs font-bold text-on-surface-variant text-center">{book.title}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function DictationView({ onBack }: { onBack: () => void }) {
  const HISTORY_KEY = 'ielts_dictation_history';
  const PROGRESS_KEY = 'ielts_dictation_progress_v2';
  const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;

  // Interleaved level flow: 10 words -> 10 sentences -> 10 words ... (total up to 1000 levels)
  const WORD_COUNT = DICTATION_DATA.length;
  const SENT_COUNT = DICTATION_SENTENCES.length;
  const TOTAL_LEVELS = WORD_COUNT + SENT_COUNT;

  type LevelItem = {
    id: string;
    data: typeof DICTATION_DATA[number];
    type: 'word' | 'sentence';
    typeIndex: number; // 0-based index within the word or sentence array
    levelIndex: number; // 0-based index in combined flow
  };

  // Resolve a combined-flow level index to a concrete word/sentence item.
  const getLevelAtIndex = (L: number): LevelItem | null => {
    if (L < 0 || L >= TOTAL_LEVELS) return null;
    const block = Math.floor(L / 10);
    const isWord = block % 2 === 0;
    const typeIdx = Math.floor(block / 2) * 10 + (L % 10);
    if (isWord) {
      const data = DICTATION_DATA[typeIdx % WORD_COUNT];
      return { id: data.id, data, type: 'word', typeIndex: typeIdx % WORD_COUNT, levelIndex: L };
    }
    const data = DICTATION_SENTENCES[typeIdx % SENT_COUNT];
    return { id: data.id, data, type: 'sentence', typeIndex: typeIdx % SENT_COUNT, levelIndex: L };
  };

  // Find combined-flow level index from an item id (e.g. 'd23', 's41').
  const findLevelIndexById = (id: string): number => {
    if (id.startsWith('d')) {
      const idx = DICTATION_DATA.findIndex(d => d.id === id);
      if (idx < 0) return -1;
      return Math.floor(idx / 10) * 20 + (idx % 10);
    }
    if (id.startsWith('s')) {
      const idx = DICTATION_SENTENCES.findIndex(d => d.id === id);
      if (idx < 0) return -1;
      return Math.floor(idx / 10) * 20 + 10 + (idx % 10);
    }
    return -1;
  };

  // Load saved progress once on mount.
  type ProgressRecord = {
    currentLevelIndex?: number;
    activeWordIndex?: number;
    lastEntryAt?: number;
    wrongIds?: string[];
  };
  const savedProgress = useMemo<ProgressRecord>(() => {
    try {
      const s = localStorage.getItem(PROGRESS_KEY);
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  }, []);

  // Previous-session history snapshot (read-only).
  type HistoryRecord = {
    accuracy: number | null;
    timeElapsed: number;
    wrongCharCount: number;
    savedAt: number;
  };
  const history = useMemo<HistoryRecord | null>(() => {
    try {
      const s = localStorage.getItem(HISTORY_KEY);
      return s ? (JSON.parse(s) as HistoryRecord) : null;
    } catch { return null; }
  }, []);

  // Decide whether to enter review mode: idle > 5h AND have problem words.
  const initialReviewQueue = useMemo<LevelItem[] | null>(() => {
    const ids = savedProgress.wrongIds || [];
    const last = savedProgress.lastEntryAt || 0;
    const idleTooLong = last > 0 && (Date.now() - last) > FIVE_HOURS_MS;
    if (ids.length === 0 || !idleTooLong) return null;
    const queue = ids
      .map(id => {
        const li = findLevelIndexById(id);
        return li >= 0 ? getLevelAtIndex(li) : null;
      })
      .filter((x): x is LevelItem => x !== null);
    return queue.length > 0 ? queue : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mode, setMode] = useState<'normal' | 'review'>(initialReviewQueue ? 'review' : 'normal');
  const [reviewQueue, setReviewQueue] = useState<LevelItem[]>(initialReviewQueue || []);
  const [reviewCursor, setReviewCursor] = useState(0);

  // Normal-mode progress (resumed from storage).
  const resumedLevelIndex = Math.max(
    0,
    Math.min(savedProgress.currentLevelIndex ?? 0, TOTAL_LEVELS - 1)
  );
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(resumedLevelIndex);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(
    initialReviewQueue ? 0 : (savedProgress.activeWordIndex ?? 0)
  );
  const [wrongIds, setWrongIds] = useState<string[]>(savedProgress.wrongIds || []);

  // Per-session UI state
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Per-session stats (always start at 0)
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongCharCount, setWrongCharCount] = useState(0);

  // Resolve the active level item (review queue or normal flow).
  const currentLevel: LevelItem | null = useMemo(() => {
    if (mode === 'review') return reviewQueue[reviewCursor] || null;
    return getLevelAtIndex(currentLevelIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reviewQueue, reviewCursor, currentLevelIndex]);

  const currentSentence = currentLevel?.data;
  const inputRef = useRef<HTMLInputElement>(null);
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playSound = (type: 'success' | 'error') => {
    const audio = new Audio(
      type === 'success'
        ? 'https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3'
        : 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'
    );
    audio.play().catch(e => console.log('Audio play blocked', e));
  };

  const speak = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Fully clear everything for a fresh question
  const resetUIState = () => {
    setInputValue('');
    setStatus('idle');
    setMessage('');
    setErrorCount(0);
    setShowTip(false);
    setIsLocked(false);
  };

  const nextQuestion = () => {
    if (!currentLevel || !currentSentence) return;

    // Clear any pending auto-jump
    if (jumpTimerRef.current) {
      clearTimeout(jumpTimerRef.current);
      jumpTimerRef.current = null;
    }

    const wordsLen = currentSentence.words?.length || 0;

    // Move to next word within the current item first
    if (activeWordIndex < wordsLen - 1) {
      setActiveWordIndex(prev => prev + 1);
      resetUIState();
      return;
    }

    // Finished current item - advance based on mode
    if (mode === 'review') {
      if (reviewCursor < reviewQueue.length - 1) {
        setReviewCursor(prev => prev + 1);
        setActiveWordIndex(0);
        resetUIState();
      } else {
        // Review queue exhausted -> return to normal mode at saved level
        setMode('normal');
        setReviewQueue([]);
        setReviewCursor(0);
        setActiveWordIndex(0);
        resetUIState();
      }
    } else {
      if (currentLevelIndex < TOTAL_LEVELS - 1) {
        setCurrentLevelIndex(prev => prev + 1);
        setActiveWordIndex(0);
        resetUIState();
      } else {
        // End of library - loop back to start
        setCurrentLevelIndex(0);
        setActiveWordIndex(0);
        resetUIState();
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Build full playable text for the current item (full sentence or single word).
  const getFullText = () => {
    if (!currentSentence) return '';
    return currentSentence.en && currentSentence.en.trim()
      ? currentSentence.en
      : (currentSentence.words || []).join(' ');
  };

  // Pre-warm the voices list on mount so the very first utterance plays without delay.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        // Some browsers fire `voiceschanged` asynchronously; no-op listener to ensure load.
        const noop = () => { /* voices ready */ };
        window.speechSynthesis.addEventListener('voiceschanged', noop, { once: true });
        return () => window.speechSynthesis.removeEventListener('voiceschanged', noop);
      }
    } catch (e) {
      console.log('[v0] prewarm voices failed', e);
    }
  }, []);

  // Auto-play audio & focus input whenever the question (sentence or word) changes,
  // including the very first render after entering the page.
  useEffect(() => {
    if (!currentSentence) return;
    inputRef.current?.focus();

    // On entering a new item (activeWordIndex === 0), always read the FULL sentence/word.
    // When advancing word-by-word within the same item, read just that word for focus.
    const fullText = getFullText();
    const wordText = currentSentence.words?.[activeWordIndex] || '';
    const text = activeWordIndex === 0 ? fullText : wordText;
    if (!text) return;

    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = currentLevel?.type === 'sentence' ? 0.95 : 0.9;
      // Speak immediately - the effect already runs after commit, so no timer delay needed.
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.log('[v0] speechSynthesis failed', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelIndex, reviewCursor, mode, activeWordIndex, currentSentence]);

  // Persist current progress whenever it changes (normal mode only).
  useEffect(() => {
    if (mode === 'review') return; // Don't overwrite saved progress while reviewing
    const record: ProgressRecord = {
      currentLevelIndex,
      activeWordIndex,
      lastEntryAt: Date.now(),
      wrongIds,
    };
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(record));
    } catch (e) {
      console.log('[v0] failed saving dictation progress', e);
    }
  }, [mode, currentLevelIndex, activeWordIndex, wrongIds]);

  // Keep a live ref of latest stats so unmount cleanup can snapshot them.
  const statsRef = useRef({
    correctCount: 0,
    totalAttempts: 0,
    timeElapsed: 0,
    wrongCharCount: 0,
  });
  useEffect(() => {
    statsRef.current = { correctCount, totalAttempts, timeElapsed, wrongCharCount };
  }, [correctCount, totalAttempts, timeElapsed, wrongCharCount]);

  // Clean up pending timers & save session snapshot on unmount.
  useEffect(() => {
    return () => {
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
      window.speechSynthesis.cancel();

      const { correctCount: c, totalAttempts: t, timeElapsed: e, wrongCharCount: w } = statsRef.current;
      // Only persist if user actually practised anything this session.
      if (t > 0 || e > 5) {
        const record: HistoryRecord = {
          accuracy: t > 0 ? Math.round((c / t) * 100) : null,
          timeElapsed: e,
          wrongCharCount: w,
          savedAt: Date.now(),
        };
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(record));
        } catch (err) {
          console.log('[v0] failed saving dictation history', err);
        }
      }
    };
  }, []);

  // Helper: count positional char mismatches + length diff between input and target.
  const countWrongChars = (input: string, target: string) => {
    let wrong = 0;
    const maxLen = Math.max(input.length, target.length);
    for (let i = 0; i < maxLen; i++) {
      if (input[i] !== target[i]) wrong++;
    }
    return wrong;
  };

  const handleCheck = (val: string) => {
    if (isLocked) return; // locked during auto-jump
    if (!currentLevel || !currentSentence) return;
    if (!val.trim()) return;

    const currentTarget = currentSentence.words?.[activeWordIndex]?.toLowerCase().replace(/[.,?!]/g, '') || '';
    const inputClean = val.toLowerCase().trim();

    // Count this attempt
    const nextAttempts = totalAttempts + 1;
    setTotalAttempts(nextAttempts);

    if (inputClean === currentTarget) {
      // ===== SUCCESS =====
      setStatus('success');
      setMessage('回答正确，太棒了！');
      setIsLocked(true);
      playSound('success');
      setCorrectCount(prev => prev + 1);
      speak(currentTarget);

      // In review mode: once the user gets the whole item right on its last word,
      // remove it from the wrong list.
      const isLastWordOfItem = activeWordIndex >= (currentSentence.words?.length || 0) - 1;
      if (isLastWordOfItem && currentLevel) {
        setWrongIds(prev => prev.filter(id => id !== currentLevel.id));
      }

      // Auto-jump after 1s
      jumpTimerRef.current = setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      // ===== FAILURE - NEVER auto-jump on wrong answer =====
      playSound('error');
      const newErrCount = errorCount + 1;
      setErrorCount(newErrCount);
      setStatus('error');
      setMessage('回答错误，再接再厉！');

      // Accumulate wrong character count for this session
      setWrongCharCount(prev => prev + countWrongChars(inputClean, currentTarget));

      if (newErrCount >= 3) {
        // 3rd mistake: show persistent hint. Stay on the question.
        // User must eventually type correctly to advance.
        setShowTip(true);
        speak(currentTarget);

        // Mark this item as needing review.
        if (currentLevel) {
          setWrongIds(prev => prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]);
        }
      }
    }
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    // When user starts typing again, clear only the transient red highlight/message.
    // The persistent hint (showTip) stays visible until they answer correctly.
    if (status === 'error' && !isLocked) {
      setStatus('idle');
      setMessage('');
    }
  };

  const resetProgress = () => {
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    setMode('normal');
    setReviewQueue([]);
    setReviewCursor(0);
    setCurrentLevelIndex(0);
    setActiveWordIndex(0);
    setWrongIds([]);
    resetUIState();
    setTimeElapsed(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setWrongCharCount(0);
    setStartTime(Date.now());
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch (e) {
      console.log('[v0] failed clearing progress', e);
    }
  };

  // Exit review mode early (e.g. skip to normal progress).
  const exitReviewMode = () => {
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    setMode('normal');
    setReviewQueue([]);
    setReviewCursor(0);
    setActiveWordIndex(0);
    resetUIState();
  };

  const accuracy = totalAttempts > 0
    ? Math.round((correctCount / totalAttempts) * 100)
    : null;

  if (!currentLevel || !currentSentence) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-2 sm:space-y-3 px-3 sm:px-0">
      <div className="flex items-start sm:items-center justify-between flex-wrap gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black font-headline truncate">雅思听写打字特训</h2>
              {mode === 'review' && (
                <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-500/10 text-amber-600 text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-[0.15em] sm:tracking-[0.2em] border border-amber-500/20">
                  <Sparkles className="w-3 h-3" />
                  复习模式
                </span>
              )}
            </div>
            <button
              onClick={resetProgress}
              className="text-[10px] w-fit font-bold text-red-500 hover:underline flex items-center gap-1 mt-0.5 sm:mt-1"
            >
              <RotateCcw className="w-3 h-3" /> 重置进度
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {mode === 'review' && (
            <button
              onClick={exitReviewMode}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-black text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high rounded-xl sm:rounded-2xl border border-outline-variant/10 transition-colors whitespace-nowrap"
            >
              跳过复习
            </button>
          )}
          <div className="px-3 sm:px-6 py-1.5 sm:py-2 bg-surface-container-low rounded-xl sm:rounded-2xl border border-outline-variant/10 flex-1 sm:flex-none text-center">
            <span className="text-[10px] sm:text-xs font-black text-on-surface-variant">
              {mode === 'review' ? (
                <>复习 {reviewCursor + 1}/{reviewQueue.length} · {currentLevel.type === 'word' ? '单词' : '句子'}</>
              ) : (
                <>关卡 {currentLevelIndex + 1}/{TOTAL_LEVELS} · {currentLevel.type === 'word' ? '单词' : '句子'} {currentLevel.typeIndex + 1}/{currentLevel.type === 'word' ? WORD_COUNT : SENT_COUNT}</>
              )}
              {' · '}
              <span className="text-on-surface-variant/60">第 {activeWordIndex + 1}/{currentSentence.words?.length} 词</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border border-outline-variant/10 shadow-xl sm:shadow-2xl space-y-3 sm:space-y-4 flex flex-col items-center">
        <div className="text-center space-y-2 w-full">
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-[0.15em] sm:tracking-[0.2em] inline-block">
            Listen & Type
          </span>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-tight text-balance px-2">
            {currentSentence.zh}
          </h3>
          <button
            onClick={() => speak(getFullText())}
            className="flex items-center gap-2 mx-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-surface-container-low hover:bg-surface-container-high text-primary rounded-full transition-all font-bold text-xs sm:text-sm"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> 听到什么？循环播放
          </button>
        </div>

        <div className="w-full max-w-lg space-y-2">
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCheck(inputValue);
              }}
              placeholder="请输入听到的单词"
              disabled={isLocked}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
              className={`w-full pl-4 sm:pl-8 pr-20 sm:pr-24 py-4 sm:py-6 text-center text-xl sm:text-2xl md:text-3xl font-black bg-transparent border-b-4 sm:border-b-8 transition-all duration-300 outline-none ${
                status === 'success'
                  ? 'border-green-500 text-green-600'
                  : status === 'error'
                    ? 'border-red-500 text-red-600'
                    : 'border-outline-variant/10 focus:border-primary group-hover:border-primary/50'
              }`}
            />
            <button
              type="button"
              onClick={() => handleCheck(inputValue)}
              disabled={isLocked || !inputValue.trim()}
              aria-label="确认提交"
              className={`absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all min-h-[40px] ${
                isLocked || !inputValue.trim()
                  ? 'bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:opacity-90 active:scale-95 shadow-md'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">确认</span>
            </button>
          </div>

          <p className="text-center text-[9px] sm:text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            按 Enter 或点击确认提交
          </p>

          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-center font-black text-sm sm:text-lg ${
                  status === 'success' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl sm:rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 sm:px-6 py-3 sm:py-4 text-center"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-amber-600 mb-1 sm:mb-2">
                  提示 Hint
                </p>
                <p className="text-xs sm:text-sm font-bold text-amber-800 mb-1">{currentSentence.zh}</p>
                <p className="text-lg sm:text-2xl font-black tracking-wide text-amber-900">
                  {currentSentence.words?.[activeWordIndex]?.replace(/[.,?!]/g, '') || ''}
                </p>
                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold text-amber-600">
                  请输入正确答案以继续
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-8 sm:gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">已对</p>
            <p className="text-xl sm:text-2xl font-black">{correctCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">错误</p>
            <p className="text-xl sm:text-2xl font-black text-red-500">{errorCount}/3</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">打错字数</p>
            <p className="text-2xl font-black">{wrongCharCount} <span className="text-xs font-bold text-slate-300">CHARS</span></p>
          </div>
        </div>
        <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">正确率</p>
            <p className="text-2xl font-black">{accuracy !== null ? `${accuracy}%` : '--'}</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">累计时长</p>
            <p className="text-2xl font-black">{timeElapsed} <span className="text-xs font-bold text-slate-300">SEC</span></p>
          </div>
        </div>
      </div>

      {/* Historical data from previous session */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black">上一次学习记录</p>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
              {history ? `保存于 ${new Date(history.savedAt).toLocaleString('zh-CN', { hour12: false })}` : '暂无历史数据，完成一次练习后记录会显示在这里'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-low rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">正确率</p>
            <p className="text-xl md:text-2xl font-black text-green-600">
              {history && history.accuracy !== null ? `${history.accuracy}%` : '--'}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">累计时长</p>
            <p className="text-xl md:text-2xl font-black text-blue-500">
              {history ? history.timeElapsed : '--'}
              {history && <span className="text-[10px] font-bold text-slate-300 ml-1">SEC</span>}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">打错字数</p>
            <p className="text-xl md:text-2xl font-black text-red-500">
              {history ? history.wrongCharCount : '--'}
              {history && <span className="text-[10px] font-bold text-slate-300 ml-1">CHARS</span>}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


function VocabView({ onBack }: { onBack: () => void }) {
  const { state, addMasteredWord } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [mode, setMode] = useState<'learning' | 'practice'>('learning');
  const [spellingInput, setSpellingInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const currentWord = VOCAB_DATA[currentIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (currentWord.audio) {
      if (audioRef.current) {
        audioRef.current.src = currentWord.audio;
        audioRef.current.play();
      } else {
        const audio = new Audio(currentWord.audio);
        audio.play();
        audioRef.current = audio;
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < VOCAB_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
      setMode('learning');
      setSpellingInput('');
      setIsCorrect(null);
      setScore(null);
    } else {
      onBack();
    }
  };

  const handleZhan = () => {
    addMasteredWord();
    setMode('practice');
  };

  const handleNotZhan = () => {
    setShowMeaning(true);
  };

  const checkSpelling = () => {
    const correct = spellingInput.toLowerCase().trim() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      setTimeout(handleNext, 1500);
    }
  };

  const simulateShadowing = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setScore(Math.floor(Math.random() * 20) + 80);
      setTimeout(handleNext, 2000);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">背词进度</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / VOCAB_DATA.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-primary">{currentIndex + 1}/{VOCAB_DATA.length}</span>
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === 'learning' ? (
            <motion.div 
              key={`word-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-8 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-6xl font-black text-on-surface tracking-tight">{currentWord.word}</h2>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <span className="text-lg font-medium font-mono text-slate-400">[{currentWord.pos}]</span>
                  <button onClick={playAudio} className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="min-h-[200px] flex flex-col items-center justify-center">
                {showMeaning ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 bg-surface-container-low p-8 rounded-[2.5rem] w-full border border-outline-variant/10"
                  >
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 text-left">释义</p>
                        <p className="text-3xl font-black text-on-surface text-left">{currentWord.zh}</p>
                        <p className="text-sm text-on-surface-variant mt-1 text-left">{currentWord.def}</p>
                      </div>
                      
                      {currentWord.ex && (
                        <div className="p-4 bg-white/50 rounded-2xl border border-outline-variant/5 text-left">
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">真题例句</p>
                          <p className="text-sm font-medium italic text-on-surface leading-relaxed">"{currentWord.ex}"</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-2xl text-left">
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">词根词缀</p>
                          <p className="text-xs font-bold text-on-surface">分析 (Ana-lyze)</p>
                        </div>
                        <div className="p-4 bg-green-50/50 rounded-2xl text-left">
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">近义词</p>
                          <div className="flex flex-wrap gap-1">
                            {currentWord.syn?.map(s => (
                              <span key={s} className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md shadow-sm">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setShowMeaning(true)}
                    className="group flex flex-col items-center gap-3 p-8 rounded-[2.5rem] border-2 border-dashed border-outline-variant/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                      <Search className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-primary">点击查看释义</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-8">
                <button 
                  onClick={handleNotZhan}
                  className="py-5 rounded-3xl bg-surface-container-low text-on-surface font-black text-lg hover:bg-surface-container-high transition-all active:scale-95"
                >
                  不认识
                </button>
                <button 
                  onClick={handleZhan}
                  className="py-5 rounded-3xl bg-primary text-white font-black text-lg shadow-xl shadow-blue-200 hover:scale-105 transition-all active:scale-95"
                >
                  认识 (斩)
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="practice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-8"
            >
              <div className="bg-surface-container-low p-10 rounded-[3rem] border border-outline-variant/10 shadow-sm space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">巩固练习</h3>
                  <p className="text-4xl font-black text-on-surface">{currentWord.word}</p>
                  <p className="text-xl font-bold text-primary">{currentWord.zh}</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">拼写练习</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="输入单词拼写..."
                        value={spellingInput}
                        onChange={e => setSpellingInput(e.target.value)}
                        className={`w-full px-6 py-4 bg-surface-container-lowest border rounded-2xl text-xl font-bold focus:outline-none transition-all ${
                          isCorrect === true ? 'border-green-500 ring-4 ring-green-500/10' : 
                          isCorrect === false ? 'border-red-500 ring-4 ring-red-500/10' : 
                          'border-outline-variant/20 focus:ring-4 focus:ring-primary/10'
                        }`}
                      />
                      {isCorrect === true && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-6 h-6" />}
                      {isCorrect === false && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 w-6 h-6" />}
                    </div>
                    <button 
                      onClick={checkSpelling}
                      className="w-full py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-primary hover:text-white transition-all"
                    >
                      检查拼写
                    </button>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/10 space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">发音跟读</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={simulateShadowing}
                        disabled={isRecording}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
                          isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-primary hover:bg-blue-100'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                        {isRecording ? '正在录音...' : '开始跟读'}
                      </button>
                      {score !== null && (
                        <div className="px-6 py-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-bold uppercase">评分</span>
                          <span className="text-xl font-black">{score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="w-full py-5 rounded-3xl bg-surface-container-low text-on-surface font-black text-lg hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
              >
                跳过练习，下一个 <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ListeningView({ onBack }: { onBack: () => void }) {
  const [selectedRes, setSelectedRes] = useState<typeof LISTENING_RESOURCES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [loopMode, setLoopMode] = useState<'none' | 'sentence'>('none');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock subtitles for the demo
  const subtitles = [
    { time: 0, text: "Welcome to the IELTS Listening test.", zh: "欢迎参加雅思听力测试。" },
    { time: 3, text: "You will hear a number of different recordings.", zh: "你将听到一些不同的录音。" },
    { time: 7, text: "And you will have to answer questions on what you hear.", zh: "你必须根据所听到的内容回答问题。" },
    { time: 12, text: "There will be time for you to read the instructions.", zh: "你将有时间阅读说明。" },
    { time: 17, text: "And you will have a chance to check your work.", zh: "你将有机会检查你的答案。" },
    { time: 22, text: "All the recordings will be played once only.", zh: "所有录音仅播放一次。" },
    { time: 27, text: "The test is in four sections.", zh: "测试分为四个部分。" }
  ];

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      const index = subtitles.findIndex((s, i) => {
        const next = subtitles[i + 1];
        return audioRef.current!.currentTime >= s.time && (!next || audioRef.current!.currentTime < next.time);
      });
      if (index !== -1 && index !== currentSentenceIndex) {
        setCurrentSentenceIndex(index);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeRate = () => {
    const rates = [0.5, 0.8, 1, 1.2, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
  };

  if (selectedRes) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedRes(null)} className="flex items-center gap-2 text-primary font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5" /> 返回列表
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${showSubtitles ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-outline-variant/20'}`}
            >
              {showSubtitles ? '显示字幕' : '隐藏字幕'}
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-400 border border-outline-variant/20 hover:bg-surface-container-low transition-all">
              精听模式
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Player Header */}
          <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-fixed">
                <Headphones className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-headline">{selectedRes.title}</h3>
                <p className="text-sm opacity-60 font-medium">{selectedRes.level} · 雅思精听训练</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer relative" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                seekTo((x / rect.width) * duration);
              }}>
                <div className="h-full bg-primary transition-all" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold opacity-60 tracking-widest">
                <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-10">
              <button onClick={changeRate} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center text-xs font-black">
                {playbackRate}x
              </button>
              <button onClick={() => seekTo(Math.max(0, currentTime - 5))} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center">
                <History className="w-6 h-6" />
              </button>
              <button onClick={togglePlay} className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                {isPlaying ? <Square className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button onClick={() => seekTo(Math.min(duration, currentTime + 5))} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center">
                <History className="w-6 h-6 rotate-180" />
              </button>
              <button 
                onClick={() => setLoopMode(loopMode === 'sentence' ? 'none' : 'sentence')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${loopMode === 'sentence' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
              >
                <Zap className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Subtitles Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-surface-container-lowest">
            {subtitles.map((s, i) => (
              <motion.div 
                key={i}
                onClick={() => seekTo(s.time)}
                className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                  currentSentenceIndex === i 
                    ? 'bg-primary/5 border-primary/20 shadow-sm' 
                    : 'hover:bg-surface-container-low border-transparent'
                }`}
              >
                <p className={`text-xl font-bold leading-relaxed transition-colors ${currentSentenceIndex === i ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {s.text}
                </p>
                {showSubtitles && (
                  <p className={`text-sm mt-2 font-medium transition-opacity ${currentSentenceIndex === i ? 'opacity-60' : 'opacity-30'}`}>
                    {s.zh}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <audio 
          ref={audioRef}
          src={selectedRes.link.startsWith('http') ? selectedRes.link : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">雅思听力精选资源</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LISTENING_RESOURCES?.map((res) => (
          <div 
            key={res.title} 
            onClick={() => setSelectedRes(res)}
            className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Headphones className="w-8 h-8" />
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${res.level === 'Exam Level' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {res.level}
              </span>
            </div>
            <h3 className="text-xl font-black mb-2">{res.title}</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{res.desc}</p>
            <div className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
              立即开始精听练习 <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ReadingView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">雅思阅读高分技巧</h2>
      </div>

      <div className="space-y-6">
        {READING_TECHNIQUES?.map((tech) => (
          <div key={tech.title} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">{tech.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4" /> 核心方法
                </h4>
                <p className="text-sm text-on-surface leading-relaxed">{tech.method}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Play className="w-4 h-4" /> 应用示例
                </h4>
                <p className="text-sm text-on-surface-variant italic">"{tech.example}"</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Edit className="w-4 h-4" /> 专项练习
                </h4>
                <p className="text-sm font-medium text-primary bg-blue-50 p-3 rounded-xl border border-blue-100">
                  {tech.exercise}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WritingView({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'library' | 'practice'>('library');
  const [userText, setUserText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const getFeedback = async () => {
    if (!userText.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As an IELTS writing examiner, evaluate the following essay. Provide:
        1. Band scores for: Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy.
        2. Overall Band Score.
        3. Detailed feedback and suggestions for improvement.
        4. A corrected version of the first paragraph.
        
        Essay: ${userText}
        
        Return as JSON: { "scores": { "ta": 7.0, "cc": 7.0, "lr": 7.0, "gra": 7.0 }, "overall": 7.0, "feedback": "...", "correction": "..." }`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const data = JSON.parse(response.text || "{}");
      setFeedback(data);
    } catch (error) {
      console.error(error);
      setFeedback({
        scores: { ta: 6.5, cc: 6.0, lr: 6.5, gra: 6.0 },
        overall: 6.5,
        feedback: "您的文章结构清晰，但词汇多样性有待提高。建议多使用一些学术词汇。",
        correction: "In the contemporary era, the debate surrounding lifelong employment..."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black font-headline">雅思写作练笔</h2>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-2xl">
          <button 
            onClick={() => setMode('library')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'library' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}
          >
            范文库
          </button>
          <button 
            onClick={() => setMode('practice')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'practice' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}
          >
            实战练笔
          </button>
        </div>
      </div>

      {mode === 'library' ? (
        <div className="space-y-8">
          {WRITING_SAMPLES?.map((sample) => (
            <div key={sample.title} className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-xl">
              {/* ... existing sample UI ... */}
              <div className="bg-gradient-to-br from-primary to-primary-container p-10 text-white">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest">Writing Task 2</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs opacity-80 font-bold">Target Band</span>
                    <span className="text-4xl font-black">{sample.band}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4 leading-tight">{sample.title}</h3>
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <p className="text-sm font-medium leading-relaxed italic">"{sample.topic}"</p>
                </div>
              </div>

              <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <h4 className="text-xl font-bold font-headline flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" /> 完整范文
                  </h4>
                  <div className="text-on-surface leading-loose text-lg whitespace-pre-wrap font-body">
                    {sample.content}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">词汇亮点</h4>
                    <div className="flex flex-wrap gap-2">
                      {sample.highlights?.map(h => (
                        <span key={h} className="px-3 py-1 bg-white text-primary text-xs font-bold rounded-lg border border-primary/10 shadow-sm">{h}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                    <h4 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" /> 考官点评
                    </h4>
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                      {sample.comments}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
              <h3 className="text-xl font-black mb-4">题目：科技对教育的影响</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed">Some people believe that technology has made education more accessible, while others argue it has created a digital divide. Discuss both views and give your opinion.</p>
              
              <textarea 
                value={userText}
                onChange={e => setUserText(e.target.value)}
                placeholder="在此输入您的文章..."
                className="w-full h-[400px] p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg leading-loose font-body"
              />
              
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm font-bold text-on-surface-variant">字数统计: {userText.trim().split(/\s+/).filter(Boolean).length} 词</span>
                <button 
                  onClick={getFeedback}
                  disabled={isAnalyzing || !userText.trim()}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? "AI 深度分析中..." : "获取 AI 评分���建议"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {feedback ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl text-center">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">预估总分</p>
                  <p className="text-6xl font-black">{feedback.overall}</p>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm space-y-4">
                  <h4 className="font-black text-lg">分项评分</h4>
                  <div className="space-y-3">
                    {Object.entries(feedback.scores).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-bold text-on-surface-variant uppercase">{key}</span>
                        <span className="font-black text-primary">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <h4 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3">改进建议</h4>
                  <p className="text-sm text-amber-900 leading-relaxed">{feedback.feedback}</p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-surface-container-low/50 border-2 border-dashed border-outline-variant/20 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-slate-300">
                  <Bot className="w-8 h-8" />
                </div>
                <p className="text-on-surface-variant font-bold">提交文章后，AI 将为您提供深度评分和修改建议</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SpeakingView({ onBack }: { onBack: () => void }) {
  const [recording, setRecording] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">雅思口语实战训练</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SPEAKING_TOPICS?.map((topic, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">{topic.part}</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container-low rounded-xl text-primary transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <h3 className="text-2xl font-black">{topic.title}</h3>
            
            {topic.cueCard ? (
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-3">
                <h4 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Cue Card</h4>
                <ul className="space-y-2">
                  {topic.cueCard?.map((item, i) => (
                    <li key={i} className="text-sm text-amber-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                {topic.questions?.map((q, i) => (
                  <div key={i} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                    <p className="text-sm font-bold text-on-surface">Q: {q}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 高分范文回答
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                "{topic.sampleAnswer}"
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => setRecording(!recording)}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-primary text-white hover:shadow-lg'}`}
              >
                <Mic className="w-5 h-5" />
                {recording ? '正在录音...' : '开始跟读练习'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MockView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">全真模拟考试中心</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_EXAMS?.map((exam) => (
          <div key={exam.id} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm group hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${exam.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                {exam.status === 'Available' ? '可进行' : '未解锁'}
              </span>
            </div>
            <h3 className="text-2xl font-black mb-4">{exam.title}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold">{exam.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{exam.difficulty}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {exam.sections?.map(s => (
                <span key={s} className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-lg border border-outline-variant/10">{s}</span>
              ))}
            </div>

            <button 
              disabled={exam.status !== 'Available'}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-none"
            >
              开始全真模考 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ReviewView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black font-headline">错题本与复习中心</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xl font-black font-headline flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" /> 最近错题记录
          </h3>
          <div className="space-y-4">
            {REVIEW_DATA.wrongQuestions?.map((q, i) => (
              <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">{q.type}</span>
                  <span className="text-xs text-slate-400 font-bold">{q.date}</span>
                </div>
                <h4 className="font-bold text-on-surface mb-4">{q.question}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-1">你的回答</p>
                    <p className="text-sm font-bold text-red-700">{q.user}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-[10px] font-bold text-green-400 uppercase mb-1">正确答案</p>
                    <p className="text-sm font-bold text-green-700">{q.correct}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xl font-black font-headline flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> 弱项强化建议
          </h3>
          <div className="space-y-6">
            {REVIEW_DATA.weakPoints?.map((point, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-lg">{point.area}</h4>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{point.description}</p>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">提升方案</p>
                  <p className="text-sm text-on-surface font-medium leading-relaxed">{point.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Study Center Component ---

// --- Sub-Components ---

function FlameEffect() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* Top Flame */}
      <motion.div 
        animate={{ 
          y: [-20, 0, -20],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-600/40 to-transparent blur-xl"
      />
      {/* Bottom Flame */}
      <motion.div 
        animate={{ 
          y: [20, 0, 20],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-red-700/50 via-orange-600/30 to-transparent blur-2xl"
      />
      {/* Left/Right Glow */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-red-600/20 to-transparent blur-lg" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-red-600/20 to-transparent blur-lg" />
      
      {/* Floating Embers */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 10,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 1
          }}
          animate={{ 
            y: -100,
            x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth),
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-2 h-2 bg-orange-500 rounded-full blur-[1px]"
        />
      ))}
    </motion.div>
  );
}

function WeightliftingAnimation() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none bg-white/40 backdrop-blur-md"
    >
      <div className="relative scale-[1.5] md:scale-[2]">
        {/* Person */}
        <div className="relative flex flex-col items-center">
          {/* Head with Fire Eyes */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="w-10 h-10 bg-orange-200 rounded-full relative z-20"
          >
            {/* Fire Eyes */}
            {[0, 1].map((side) => (
              <div key={side} className={`absolute top-4 ${side === 0 ? 'left-2' : 'right-2'} w-2 h-2`}>
                {/* Determined Eye Base */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-black rounded-full" />
                {/* Flame Effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                    y: [0, -4, 0]
                  }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  className="absolute -top-3 left-0 right-0 h-4 bg-orange-500 rounded-full blur-[2px]"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0.8, 0.4],
                    y: [0, -6, 0]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
                  className="absolute -top-4 left-0 right-0 h-5 bg-red-600 rounded-full blur-[3px]"
                />
              </div>
            ))}
            {/* Determined Mouth */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-1 bg-black rounded-full" />
          </motion.div>

          {/* Torso */}
          <div className="w-14 h-20 bg-red-600 rounded-t-2xl mt-[-2px] relative z-10 shadow-xl">
             <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </div>

          {/* Legs */}
          <div className="flex gap-4 mt-[-2px]">
            <motion.div 
              animate={{ rotate: [10, 20, 10] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="w-4 h-16 bg-zinc-800 rounded-b-lg origin-top" 
            />
            <motion.div 
              animate={{ rotate: [-10, -20, -10] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="w-4 h-16 bg-zinc-800 rounded-b-lg origin-top" 
            />
          </div>

          {/* Arms & Barbell - CRAZY FAST */}
          <motion.div
            animate={{ y: [40, -90, 40] }}
            transition={{ 
              duration: 0.25, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-8 flex flex-col items-center z-30"
          >
            {/* Barbell */}
            <div className="flex items-center">
              <div className="w-14 h-14 bg-zinc-900 rounded-xl shadow-2xl border-2 border-zinc-700" />
              <div className="w-10 h-12 bg-zinc-800 rounded-lg -ml-2 border-2 border-zinc-600" />
              <div className="w-48 h-4 bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-lg" />
              <div className="w-10 h-12 bg-zinc-800 rounded-lg -mr-2 border-2 border-zinc-600" />
              <div className="w-14 h-14 bg-zinc-900 rounded-xl shadow-2xl border-2 border-zinc-700" />
            </div>
            {/* Arms */}
            <div className="absolute top-0 left-14 w-3 h-12 bg-orange-200 rounded-full origin-top rotate-[-10deg]" />
            <div className="absolute top-0 right-14 w-3 h-12 bg-orange-200 rounded-full origin-top rotate-[10deg]" />
          </motion.div>
        </div>

        {/* Motivation Text - Static */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-5xl font-black text-red-600 italic drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]"
        >
          努力奋斗，Keep it all.
        </div>
      </div>
    </motion.div>
  );
}

function StudyRoomView({ onBack, autoStart }: { onBack: () => void, autoStart?: boolean }) {
  const { state, updateFocusTime } = useStudy();
  const [isFocusing, setIsFocusing] = useState(false);
  const [showFlame, setShowFlame] = useState(false);
  const [showLift, setShowLift] = useState(false);
  const [duration, setDuration] = useState(120); // minutes
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [isLocked, setIsLocked] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    flameEnabled: true,
    alarmEnabled: true
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (type: 'start' | 'alarm') => {
    if (!settings.soundEnabled) return;
    const url = type === 'start' 
      ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' // High-energy cinematic impact (CSGO vibe)
      : 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3'; // Alarm bell
    
    const audio = new Audio(url);
    audio.volume = 1.0; // Max volume
    audio.play().catch(e => console.log('Audio play blocked', e));
  };

  const startFocus = (customDuration?: number) => {
    const d = customDuration || duration;
    if (settings.flameEnabled) {
      setShowFlame(true);
      setTimeout(() => setShowFlame(false), 3000);
    }
    setShowLift(true);
    setTimeout(() => setShowLift(false), 1500); // 1.5 seconds for the lift animation
    playSound('start');
    setIsFocusing(true);
    setTimeLeft(d * 60);
    document.documentElement.classList.add('hot-theme');
  };

  useEffect(() => {
    if (autoStart) {
      setDuration(1);
      startFocus(1);
    }
  }, [autoStart]);

  const stopFocus = () => {
    setIsFocusing(false);
    setIsLocked(false);
    document.documentElement.classList.remove('hot-theme');
    // Update focus time in context
    const actualMinutes = Math.floor((duration * 60 - timeLeft) / 60);
    if (actualMinutes > 0) {
      updateFocusTime(actualMinutes);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isFocusing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isFocusing && timeLeft === 0) {
      if (settings.alarmEnabled) playSound('alarm');
      stopFocus();
    }
    return () => clearInterval(timer);
  }, [isFocusing, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const todayFocus = useMemo(() => {
    const today = new Date().getDay();
    return state.weeklyActivity?.[today] || 0;
  }, [state.weeklyActivity]);

  const currentSessionMinutes = isFocusing ? Math.floor((duration * 60 - timeLeft) / 60) : 0;
  const todayFocusDisplay = todayFocus + currentSessionMinutes;
  
  const totalFocusTime = useMemo(() => {
    return state.weeklyActivity.reduce((acc, v) => acc + v, 0) + currentSessionMinutes;
  }, [state.weeklyActivity, currentSessionMinutes]);

  const focusEfficiency = useMemo(() => {
    if (!isFocusing) return 0;
    // Dynamic efficiency that fluctuates slightly during focus
    const base = 92;
    const fluctuation = Math.floor(Math.sin(timeLeft / 10) * 3);
    return Math.min(100, Math.max(0, base + fluctuation));
  }, [isFocusing, timeLeft]);

  const focusLevel = useMemo(() => {
    return Math.floor(totalFocusTime / 60);
  }, [totalFocusTime]);

  const isCheckedIn = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.lastCheckInDate === today;
  }, [state.lastCheckInDate]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-12 relative">
      <AnimatePresence>
        {showFlame && <FlameEffect />}
        {showLift && <WeightliftingAnimation />}
      </AnimatePresence>

      <div className={`bg-surface-container-lowest p-12 rounded-[3rem] border border-outline-variant/10 shadow-2xl text-center space-y-8 transition-all duration-500 ${isFocusing ? 'ring-4 ring-red-600/20' : ''}`}>
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <button 
              onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
              className={`p-3 rounded-2xl transition-all ${settings.soundEnabled ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}
            >
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setSettings(s => ({ ...s, flameEnabled: !s.flameEnabled }))}
              className={`p-3 rounded-2xl transition-all ${settings.flameEnabled ? 'bg-orange-100 text-orange-600' : 'bg-surface-container-high text-on-surface-variant'}`}
            >
              <Flame className="w-5 h-5" />
            </button>
          </div>
          <div className="w-24 h-24 bg-blue-50 text-primary rounded-full flex items-center justify-center shadow-inner">
            <Home className="w-12 h-12" />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSettings(s => ({ ...s, alarmEnabled: !s.alarmEnabled }))}
              className={`p-3 rounded-2xl transition-all ${settings.alarmEnabled ? 'bg-amber-100 text-amber-600' : 'bg-surface-container-high text-on-surface-variant'}`}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-3 bg-surface-container-high text-on-surface-variant rounded-2xl">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isFocusing ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black font-headline">你的专属自习室</h2>
              <p className="text-on-surface-variant font-medium">这里是你深度专注的空间。沉浸式备考，从现在开始。</p>
            </div>

            <div className="bg-surface-container-low p-8 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-black text-on-surface">专注时长</span>
                <span className="text-2xl font-black text-primary">{duration} 分钟</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="240" 
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-3 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <span>1min</span>
                <span>120min</span>
                <span>240min</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 py-8">
            <div className="relative inline-block">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-surface-container-high"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={754}
                  animate={{ strokeDashoffset: 754 * (1 - timeLeft / (duration * 60)) }}
                  className="text-red-600"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-6xl font-black font-headline tracking-tighter text-on-surface">{formatTime(timeLeft)}</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-2">剩余时间</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isLocked ? 'bg-red-600 text-white shadow-lg' : 'bg-surface-container-high text-on-surface'}`}
              >
                {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                {isLocked ? '已锁定界面' : '锁定界面'}
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">今日专注</p>
            <p className="text-2xl font-black">{todayFocusDisplay} min</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
            <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">专注效率</p>
            <p className="text-2xl font-black">{focusEfficiency}%</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
            <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">专注等级</p>
            <p className="text-2xl font-black">Lv. {focusLevel}</p>
          </div>
        </div>

        <div className="space-y-4">
          {!isFocusing ? (
            <button 
              onClick={() => startFocus()}
              className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Flame className="w-6 h-6" /> 开启专注模式
            </button>
          ) : (
            <button 
              disabled={isLocked}
              onClick={stopFocus}
              className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              停止专注
            </button>
          )}
          <button 
            disabled={isLocked}
            onClick={onBack} 
            className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-black hover:bg-surface-container-highest transition-all disabled:opacity-50"
          >
            返回学习中心
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudyCenter() {
  const { state, checkIn } = useStudy();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'main' | 'vocab' | 'listening' | 'reading' | 'writing' | 'speaking' | 'mock' | 'review' | 'library' | 'ai-speaking' | 'mock-exam' | 'study-room' | 'dictation'>('main');

  const searchParams = new URLSearchParams(location.search);
  const autoStart = searchParams.get('autoStart') === 'true';

  useEffect(() => {
    if (autoStart) {
      setActiveView('study-room');
      // Clear the parameter after handling it to prevent re-triggering on refresh if needed
      // but for now let's keep it simple.
    }
  }, [autoStart]);

  const isCheckedIn = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.lastCheckInDate === today;
  }, [state.lastCheckInDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {activeView === 'mock-exam' && <MockExamView onBack={() => setActiveView('main')} />}
        {activeView === 'ai-speaking' && <AISpeakingView onBack={() => setActiveView('main')} />}
        {activeView === 'vocab' && <VocabView onBack={() => setActiveView('main')} />}
        {activeView === 'listening' && <ListeningView onBack={() => setActiveView('main')} />}
        {activeView === 'reading' && <ReadingView onBack={() => setActiveView('main')} />}
        {activeView === 'writing' && <WritingView onBack={() => setActiveView('main')} />}
        {activeView === 'speaking' && <SpeakingView onBack={() => setActiveView('main')} />}
        {activeView === 'mock' && <MockView onBack={() => setActiveView('main')} />}
        {activeView === 'review' && <ReviewView onBack={() => setActiveView('main')} />}
        {activeView === 'library' && <LibraryView onBack={() => setActiveView('main')} />}
        {activeView === 'dictation' && <DictationView onBack={() => setActiveView('main')} />}
        {activeView === 'study-room' && <StudyRoomView onBack={() => {
          setActiveView('main');
          if (autoStart) navigate('/study-center', { replace: true });
        }} autoStart={autoStart} />}
        {activeView === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            <header className="mb-10">
              <h1 className="text-5xl font-black font-headline tracking-tight text-on-surface mb-3">学习中心</h1>
              <p className="text-xl text-on-surface-variant font-medium">今天是你的备考第 {state.studyDays} 天，你已经击败了 {Math.min(99, Math.round(state.overallProgress * 1.2))} % 的备考学友。</p>
            </header>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Study Modules */}
              <div className="col-span-12 xl:col-span-8 space-y-12">
                <section>
                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-black font-headline text-on-surface">备考模块</h2>
                    <button className="text-primary font-bold text-sm hover:underline">查看详细进度</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STUDY_MODULES?.map((module) => {
                      const dynamicModule = state.modules?.find(m => m.id === module.id);
                      const progress = dynamicModule?.progress ?? module.progress;
                      const total = dynamicModule?.total ?? module.total;
                      
                      return (
                        <button 
                          key={module.id}
                          onClick={() => setActiveView(module.id as any)}
                          className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 hover:shadow-2xl hover:-translate-y-1 transition-all group text-left"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="bg-blue-50 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <module.icon className="w-8 h-8" />
                            </div>
                            <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                          </div>
                          <h3 className="text-2xl font-black mb-2">{module.title}</h3>
                          <p className="text-sm text-on-surface-variant mb-6">{module.desc}</p>
                          <div className="w-full bg-surface-container-high h-2 rounded-full mb-3 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="bg-primary h-full rounded-full"
                            ></motion.div>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                            <span>{progress}% 完成</span>
                            <span>{total}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Daily Tasks */}
                <section>
                  <h2 className="text-2xl font-black font-headline text-on-surface mb-8">今日任务</h2>
                  <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-sm">
                      <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-6 h-6 text-primary" />
                          <span className="font-black text-lg text-on-surface">
                            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                          </span>
                        </div>
                        <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                          剩余 {state.dailyGoals.filter(g => !g.completed).length} 个任务
                        </span>
                      </div>
                      <div className="divide-y divide-outline-variant/10">
                        {state.dailyGoals?.map((goal) => (
                          <div 
                            key={goal.id}
                            onClick={() => {
                              if (goal.id === 'g1') setActiveView('mock-exam');
                              else if (goal.id === 'g2') setActiveView('vocab');
                              else if (goal.id === 'g3') setActiveView('writing');
                            }}
                            className={`p-8 flex items-center justify-between transition-colors cursor-pointer ${goal.completed ? 'bg-green-50/30 hover:bg-green-50/50' : 'hover:bg-surface-container-low/20'}`}
                          >
                            <div className="flex items-center gap-6">
                              {goal.completed ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full border-4 border-primary/20 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                              )}
                              <div>
                                <h4 className={`font-black text-lg ${goal.completed ? 'text-slate-400 line-through' : ''}`}>{goal.title}</h4>
                                <p className="text-sm text-on-surface-variant">{goal.desc}{goal.completed ? ' · 已完成' : ''}</p>
                              </div>
                            </div>
                            {goal.completed ? (
                              <span className="text-green-600 font-bold text-sm">已完成</span>
                            ) : (
                              <button className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-lg transition-all">
                                开始练习
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Sidebar */}
              <div className="col-span-12 xl:col-span-4 space-y-8">
                {/* Check-in Section */}
                <section className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black">每日打卡</h3>
                          <p className="text-xs text-on-surface-variant font-bold">连续打卡 {state.streak} 天</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      disabled={isCheckedIn}
                      onClick={checkIn}
                      className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                        isCheckedIn 
                          ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed shadow-none' 
                          : 'bg-primary text-white hover:scale-[1.02] active:scale-95'
                      }`}
                    >
                      {isCheckedIn ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" /> 今日已打卡
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" /> 立即打卡签到
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <section className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-outline-variant/10">
                  <h3 className="text-xl font-black font-headline mb-8">每周目标进度</h3>
                  <div className="space-y-8">
                    {[
                      { id: 'mock', label: '真题模考' },
                      { id: 'writing', label: '写作练笔' },
                      { id: 'speaking', label: '口语对练' }
                    ].map((item) => {
                      const module = (state.modules || []).find(m => m.id === item.id);
                      const progress = module?.progress ?? 0;
                      const total = module?.total ?? '0/0';
                      
                      return (
                        <div key={item.id}>
                          <div className="flex justify-between text-sm font-bold mb-3">
                            <span className="text-on-surface-variant">{item.label}</span>
                            <span className="text-primary">{total}</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-primary h-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                            ></motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-10 pt-8 border-t border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 text-primary w-14 h-14 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">本周预计达成</p>
                        <p className="font-black text-lg">获得“勤学之星”勋章</p>
                      </div>
                    </div>
                  </div>
                </section>

                <motion.section 
                  whileHover={{ scale: 1.02 }}
                  animate={{ 
                    boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 30px rgba(0,88,188,0.2)", "0px 0px 0px rgba(0,0,0,0)"]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-10 text-white overflow-hidden min-h-[320px] shadow-xl flex flex-col justify-center"
                >
                  <div className="relative z-10 w-full space-y-6">
                    <h3 className="text-4xl font-black font-headline leading-tight">自律即自由，<br />目标就在眼前。</h3>
                    <p className="text-blue-100 text-base leading-relaxed max-w-md">保持每天 2 小时的专注学习，你将在这个月看到质的飞跃。</p>
                    <button 
                      onClick={() => setActiveView('study-room')}
                      className="inline-flex items-center gap-3 bg-white text-primary px-6 py-3 rounded-full font-black shadow-lg hover:bg-blue-50 transition-all active:scale-95"
                    >
                      <Home className="w-5 h-5" />
                      <span className="text-sm uppercase tracking-widest">你的自习室</span>
                    </button>
                  </div>
                </motion.section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
