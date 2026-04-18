import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Volume2, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
  Mic,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { VOCAB_DATA } from './StudyData';
import { useStudy } from '../../contexts/StudyContext';

export default function VocabularyPage() {
  const navigate = useNavigate();
  const { addMasteredWord } = useStudy();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [mode, setMode] = useState<'learning' | 'practice'>('learning');
  const [spellingInput, setSpellingInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const currentWord = VOCAB_DATA[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentIndex < VOCAB_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
      setMode('learning');
      setSpellingInput('');
      setIsCorrect(null);
      setSessionCount(prev => prev + 1);
    } else {
      navigate('/dashboard');
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
      setTimeout(handleNext, 1200);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10 py-10 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-surface-container-low rounded-full transition-colors shadow-sm bg-white">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tighter">真题高频核心词汇</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-blue-50 px-3 py-0.5 rounded-full">Core Vocabulary</span>
              <div className="w-40 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-out" 
                  style={{ width: `${((currentIndex + 1) / VOCAB_DATA.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-12 rounded-[3.5rem] border border-outline-variant/10 shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === 'learning' ? (
            <motion.div 
              key={`learn-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-8xl font-black text-on-surface tracking-tighter drop-shadow-sm">{currentWord.word}</h2>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-bold text-slate-300 font-mono italic">[{currentWord.pos}]</span>
                  <button onClick={playAudio} className="p-4 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Volume2 className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="min-h-[180px] flex items-center justify-center pt-8">
                {showMeaning ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/5 text-left space-y-4 shadow-inner"
                  >
                    <div className="space-y-1">
                      <p className="text-4xl font-black text-on-surface">{currentWord.zh}</p>
                      <p className="text-on-surface-variant font-medium leading-relaxed">{currentWord.def}</p>
                    </div>
                    {currentWord.ex && (
                      <div className="p-5 bg-white rounded-2xl border border-primary/5 italic text-sm text-on-surface leading-relaxed relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20"></div>
                         "{currentWord.ex}"
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setShowMeaning(true)}
                    className="group bg-surface-container-low/50 border-2 border-dashed border-outline-variant/20 px-12 py-10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <Search className="w-10 h-10 text-slate-200 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-black text-slate-300 group-hover:text-primary tracking-widest">点击揭晓中文释义</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 w-full max-w-lg mx-auto pt-10">
                <button 
                  onClick={handleNotZhan}
                  className="py-6 rounded-3xl bg-surface-container-low text-on-surface font-black text-xl hover:bg-surface-container-high transition-all active:scale-95"
                >
                  陌生
                </button>
                <button 
                  onClick={handleZhan}
                  className="py-6 rounded-3xl bg-primary text-white font-black text-xl shadow-xl shadow-blue-200 hover:scale-105 transition-all active:scale-95"
                >
                  秒杀
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="practice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-lg space-y-10"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-blue-50 px-4 py-1 rounded-full">Practice Mode</span>
                <p className="text-5xl font-black text-on-surface leading-tight">{currentWord.zh}</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type="text"
                    value={spellingInput}
                    onChange={e => setSpellingInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && checkSpelling()}
                    placeholder="输入该单词的英文字母..."
                    className={`w-full px-10 py-6 bg-surface-container-low border-4 rounded-[2.5rem] text-3xl font-black text-center focus:outline-none transition-all ${
                      isCorrect === true ? 'border-green-500 bg-green-50' : 
                      isCorrect === false ? 'border-red-500 bg-red-50' : 
                      'border-outline-variant/10 focus:border-primary focus:bg-white'
                    }`}
                  />
                  <AnimatePresence>
                    {isCorrect === true && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-4 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 className="w-7 h-7" /></motion.div>}
                    {isCorrect === false && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-4 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><AlertCircle className="w-7 h-7" /></motion.div>}
                  </AnimatePresence>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={checkSpelling}
                    className="flex-1 py-5 bg-primary text-white font-black text-lg rounded-3xl shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                  >
                    验证拼写
                  </button>
                  <button 
                    onClick={handleNext}
                    className="px-8 py-5 bg-surface-container-high text-on-surface font-black rounded-3xl hover:bg-surface-container-highest transition-all"
                  >
                    跳过
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest">本次已学</h4>
          </div>
          <p className="text-4xl font-black text-on-surface">{sessionCount} <span className="text-xs font-bold text-slate-300 uppercase">Words</span></p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest">掌握比例</h4>
          </div>
          <p className="text-4xl font-black text-on-surface">{Math.round((currentIndex / VOCAB_DATA.length) * 100)}% <span className="text-xs font-bold text-slate-300 uppercase">Mastered</span></p>
        </div>
        <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h4 className="font-bold text-sm text-on-surface-variant uppercase tracking-widest">持续时长</h4>
          </div>
          <p className="text-4xl font-black text-on-surface">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')} <span className="text-xs font-bold text-slate-300 uppercase">TIME</span></p>
        </div>
      </div>
    </motion.div>
  );
}
